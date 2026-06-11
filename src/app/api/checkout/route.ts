import { NextResponse } from 'next/server';
import { randomBytes } from 'crypto';
import { MercadoPagoConfig, Preference } from 'mercadopago';
import Stripe from 'stripe';
import { supabaseAdmin } from '@/lib/supabase';
import type { FunnelData } from '@/app/criar/funnel';
import { BASE_PRICE_CENTS, EXTRA_PRICE_CENTS, EXTRA_LABEL, isExtraKey, totalCents } from '@/lib/pricing';
import { rateLimitOk, tooManyRequests } from '@/lib/rateLimit';
import { offloadGiftPhotos } from '@/lib/giftPhotos';

// Upload de fotos + preference no MP na mesma request — folga acima do default
export const maxDuration = 60;

// 16 chars hex — aleatoriedade criptográfica, não enumerável
function generateGiftId(): string {
  return randomBytes(8).toString('hex');
}

// ~6 MB: ~10 fotos comprimidas em base64 cabem com folga; acima disso é abuso.
const MAX_BODY_BYTES = 6_000_000;

export async function POST(request: Request) {
  try {
    // 10 checkouts / 10 min por IP — cada um cria linha no banco e preference no MP
    if (!(await rateLimitOk(request, 'checkout', 10, 600))) return tooManyRequests();

    const raw = await request.text();
    if (raw.length > MAX_BODY_BYTES) {
      return NextResponse.json({ error: 'Presente muito grande' }, { status: 413 });
    }

    let parsed: { funnel: FunnelData; addons: ('wordle' | 'roulette')[] };
    try {
      parsed = JSON.parse(raw);
    } catch {
      return NextResponse.json({ error: 'Requisição inválida' }, { status: 400 });
    }
    const { funnel, addons } = parsed;

    if (!funnel?.base?.giverName || !funnel?.base?.receiverName) {
      return NextResponse.json({ error: 'Presente incompleto' }, { status: 400 });
    }

    const extras = (addons ?? []).filter(isExtraKey);
    // O presente só exibe o que foi pago — alinha funnel.extras com os addons cobrados
    funnel.extras = extras;
    const id     = generateGiftId();
    // Preço congelado no momento do checkout — o webhook valida contra ele,
    // pra mudança de preço não quebrar checkouts em andamento.
    const amountExpected = totalCents(extras);
    // Fotos base64 → Supabase Storage; o funnel gravado só carrega URLs
    const storedFunnel = await offloadGiftPhotos(funnel, id);
    // Nunca confiar no header Origin (controlável pelo cliente) p/ montar back_urls e
    // notification_url. Em produção usa a URL canônica; em dev cai no origin local.
    const origin = process.env.NEXT_PUBLIC_SITE_URL ?? new URL(request.url).origin;

    const mpToken    = process.env.MP_ACCESS_TOKEN;
    const stripeKey  = process.env.STRIPE_SECRET_KEY;

    // ── Modo dev (sem gateway configurado): salva como pago p/ preview local e pula pra entrega ──
    if (!mpToken && !stripeKey) {
      const { error } = await supabaseAdmin().from('gifts').insert({
        id, funnel: storedFunnel, addons: extras, status: 'paid', amount_expected: amountExpected,
      });
      if (error) throw error;
      return NextResponse.json({ url: `${origin}/criar/entrega/${id}`, devMode: true });
    }

    // ── Gateway principal: Mercado Pago Checkout Pro (Pix + cartão + boleto) ──
    if (mpToken) {
      const preference = await new Preference(new MercadoPagoConfig({ accessToken: mpToken })).create({
        body: {
          items: [
            {
              id: 'gift-base',
              title: 'Presente Digital',
              description: 'Música · Contador · Fotos · Mensagem · Motivos',
              quantity: 1,
              currency_id: 'BRL',
              unit_price: BASE_PRICE_CENTS / 100,
            },
            ...extras.map(key => ({
              id: `extra-${key}`,
              title: EXTRA_LABEL[key],
              quantity: 1,
              currency_id: 'BRL',
              unit_price: EXTRA_PRICE_CENTS[key] / 100,
            })),
          ],
          external_reference: id,
          statement_descriptor: 'LOVEVALENTINE',
          back_urls: {
            success: `${origin}/criar/entrega/${id}`,
            pending: `${origin}/criar/entrega/${id}`,
            failure: `${origin}/criar/upsell`,
          },
          // Notificações de pagamento chegam pelo webhook a nível de aplicação
          // (painel MP), assinado. O notification_url por preferência foi removido:
          // mandava notificações sem assinatura (merchant_order) que só geravam 401.
          // auto_return exige URL pública; em localhost o MP rejeita.
          ...(origin.startsWith('https') && {
            auto_return: 'approved',
          }),
        },
      });

      const { error } = await supabaseAdmin().from('gifts').insert({
        id, funnel: storedFunnel, addons: extras, status: 'pending', amount_expected: amountExpected,
      });
      if (error) throw error;

      // O id volta junto pro cliente guardar em localStorage — se o checkout do
      // MP não redirecionar de volta, o link de entrega não se perde.
      return NextResponse.json({ url: preference.init_point, id });
    }

    // ── Fallback dormante: Stripe Checkout hospedado ──
    const stripe = new Stripe(stripeKey!);

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'brl',
            unit_amount: BASE_PRICE_CENTS,
            product_data: {
              name: 'Presente Digital',
              description: 'Música · Contador · Fotos · Mensagem · Motivos',
            },
          },
          quantity: 1,
        },
        ...extras.map(key => ({
          price_data: {
            currency: 'brl',
            unit_amount: EXTRA_PRICE_CENTS[key],
            product_data: { name: EXTRA_LABEL[key] },
          },
          quantity: 1,
        })),
      ],
      metadata: { gift_id: id },
      success_url: `${origin}/criar/entrega/${id}`,
      cancel_url:  `${origin}/criar/upsell`,
    });

    const { error } = await supabaseAdmin().from('gifts').insert({
      id, funnel: storedFunnel, addons: extras, status: 'pending', amount_expected: amountExpected, stripe_session_id: session.id,
    });
    if (error) throw error;

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error('Erro no checkout:', err);
    return NextResponse.json({ error: 'Falha ao iniciar o pagamento' }, { status: 500 });
  }
}
