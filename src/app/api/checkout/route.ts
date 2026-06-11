import { NextResponse } from 'next/server';
import { randomBytes } from 'crypto';
import { MercadoPagoConfig, Preference } from 'mercadopago';
import Stripe from 'stripe';
import { supabaseAdmin } from '@/lib/supabase';
import type { FunnelData } from '@/app/criar/funnel';

const BASE_PRICE_CENTS = 2990;
const EXTRA_PRICE_CENTS: Record<'wordle' | 'roulette', number> = {
  wordle:   990,
  roulette: 990,
};
const EXTRA_LABEL: Record<'wordle' | 'roulette', string> = {
  wordle:   'Wordle do Amor',
  roulette: 'Roleta Surpresa',
};

// 16 chars hex — aleatoriedade criptográfica, não enumerável
function generateGiftId(): string {
  return randomBytes(8).toString('hex');
}

export async function POST(request: Request) {
  try {
    const { funnel, addons } = (await request.json()) as {
      funnel: FunnelData;
      addons: ('wordle' | 'roulette')[];
    };

    if (!funnel?.base?.giverName || !funnel?.base?.receiverName) {
      return NextResponse.json({ error: 'Presente incompleto' }, { status: 400 });
    }

    const extras = (addons ?? []).filter((k): k is 'wordle' | 'roulette' => k in EXTRA_PRICE_CENTS);
    // O presente só exibe o que foi pago — alinha funnel.extras com os addons cobrados
    funnel.extras = extras;
    const id     = generateGiftId();
    const origin = request.headers.get('origin') ?? new URL(request.url).origin;

    const mpToken    = process.env.MP_ACCESS_TOKEN;
    const stripeKey  = process.env.STRIPE_SECRET_KEY;

    // ── Modo dev (sem gateway configurado): salva como pago p/ preview local e pula pra entrega ──
    if (!mpToken && !stripeKey) {
      const { error } = await supabaseAdmin().from('gifts').insert({
        id, funnel, addons: extras, status: 'paid',
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
          // auto_return e notification_url exigem URL pública; em localhost o MP rejeita
          ...(origin.startsWith('https') && {
            auto_return: 'approved',
            notification_url: `${origin}/api/mercadopago/webhook`,
          }),
        },
      });

      const { error } = await supabaseAdmin().from('gifts').insert({
        id, funnel, addons: extras, status: 'pending',
      });
      if (error) throw error;

      return NextResponse.json({ url: preference.init_point });
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
      id, funnel, addons: extras, status: 'pending', stripe_session_id: session.id,
    });
    if (error) throw error;

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error('Erro no checkout:', err);
    return NextResponse.json({ error: 'Falha ao iniciar o pagamento' }, { status: 500 });
  }
}
