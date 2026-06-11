import { NextResponse } from 'next/server';
import { MercadoPagoConfig, Payment, WebhookSignatureValidator } from 'mercadopago';
import { supabaseAdmin } from '@/lib/supabase';
import { totalCents } from '@/lib/pricing';

// Mercado Pago → notificação de pagamento → busca o pagamento na API e,
// se aprovado, marca o presente como pago via external_reference.
// O webhook é configurado no painel da aplicação (Suas integrações → Webhooks);
// o MP_WEBHOOK_SECRET vem de lá e habilita a validação de assinatura.

export async function POST(request: Request) {
  const accessToken = process.env.MP_ACCESS_TOKEN;
  if (!accessToken) {
    return NextResponse.json({ error: 'Webhook não configurado' }, { status: 500 });
  }

  const url    = new URL(request.url);
  const dataId = url.searchParams.get('data.id');
  const type   = url.searchParams.get('type') ?? url.searchParams.get('topic');

  // Fail-closed: sem o secret configurado o webhook NÃO processa nada.
  // Evita que alguém POste notificações forjadas marcando presentes como pagos.
  const secret = process.env.MP_WEBHOOK_SECRET;
  if (!secret) {
    console.error('Webhook MP: MP_WEBHOOK_SECRET não configurado — rejeitando.');
    return NextResponse.json({ error: 'Webhook não configurado' }, { status: 503 });
  }
  try {
    WebhookSignatureValidator.validate({
      xSignature: request.headers.get('x-signature'),
      xRequestId: request.headers.get('x-request-id'),
      dataId,
      secret,
    });
  } catch {
    return NextResponse.json({ error: 'Assinatura inválida' }, { status: 401 });
  }

  // Só pagamentos interessam (merchant_order etc. são ignorados)
  if (type !== 'payment' || !dataId) {
    return NextResponse.json({ received: true });
  }

  try {
    // A notificação é só um aviso — o status real vem da API do Mercado Pago
    const payment = await new Payment(new MercadoPagoConfig({ accessToken })).get({ id: dataId });
    const giftId  = payment.external_reference;

    if (payment.status === 'approved' && giftId) {
      const supabase = supabaseAdmin();
      const { data: gift } = await supabase
        .from('gifts')
        .select('id, status, addons')
        .eq('id', giftId)
        .maybeSingle();

      if (!gift) {
        console.error(`Webhook MP: pagamento ${dataId} aprovado para presente inexistente ${giftId}`);
        return NextResponse.json({ received: true });
      }
      if (gift.status === 'paid') {
        return NextResponse.json({ received: true });
      }

      // Defesa extra: o valor pago tem que bater com o preço do presente
      // (base + extras). Um pagamento de centavos com external_reference
      // forjado não pode liberar um presente cheio.
      const paidCents     = Math.round((payment.transaction_amount ?? 0) * 100);
      const expectedCents = totalCents(gift.addons ?? []);
      if (paidCents < expectedCents) {
        console.error(
          `Webhook MP: valor pago (${paidCents}) menor que o esperado (${expectedCents}) ` +
          `para o presente ${giftId} — pagamento ${dataId} NÃO libera o presente.`
        );
        return NextResponse.json({ received: true });
      }

      const { error } = await supabase
        .from('gifts')
        .update({
          status: 'paid',
          amount_total: paidCents,
        })
        .eq('id', giftId);

      if (error) {
        console.error('Webhook MP: falha ao marcar presente como pago:', error);
        // 500 faz o Mercado Pago reenviar a notificação depois
        return NextResponse.json({ error: 'Falha ao atualizar presente' }, { status: 500 });
      }
    }
  } catch (err) {
    console.error('Webhook MP: falha ao consultar pagamento:', err);
    return NextResponse.json({ error: 'Falha ao consultar pagamento' }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
