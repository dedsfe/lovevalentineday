import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { supabaseAdmin } from '@/lib/supabase';
import { sendGiftEmailIfNeeded } from '@/lib/email';

// Stripe → checkout.session.completed → marca o presente como pago.
// Configurar o endpoint no dashboard: https://dashboard.stripe.com/webhooks
//   URL: https://<dominio>/api/stripe/webhook · evento: checkout.session.completed

export async function POST(request: Request) {
  const secret    = process.env.STRIPE_WEBHOOK_SECRET;
  const stripeKey = process.env.STRIPE_SECRET_KEY;
  if (!secret || !stripeKey) {
    return NextResponse.json({ error: 'Webhook não configurado' }, { status: 500 });
  }

  const signature = request.headers.get('stripe-signature');
  if (!signature) {
    return NextResponse.json({ error: 'Assinatura ausente' }, { status: 400 });
  }

  const stripe  = new Stripe(stripeKey);
  const rawBody = await request.text();

  let event: Stripe.Event;
  try {
    event = await stripe.webhooks.constructEventAsync(rawBody, signature, secret);
  } catch {
    return NextResponse.json({ error: 'Assinatura inválida' }, { status: 400 });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const giftId  = session.metadata?.gift_id;

    if (giftId) {
      const { error } = await supabaseAdmin()
        .from('gifts')
        .update({ status: 'paid', amount_total: session.amount_total })
        .eq('id', giftId);

      if (error) {
        console.error('Webhook: falha ao marcar presente como pago:', error);
        // 500 faz o Stripe reenviar o evento depois
        return NextResponse.json({ error: 'Falha ao atualizar presente' }, { status: 500 });
      }

      try {
        await sendGiftEmailIfNeeded(giftId);
      } catch (err) {
        console.error('Webhook Stripe: falha ao enviar email do presente:', err);
        // 500 faz o Stripe reenviar o evento depois
        return NextResponse.json({ error: 'Falha ao enviar email' }, { status: 500 });
      }
    }
  }

  return NextResponse.json({ received: true });
}
