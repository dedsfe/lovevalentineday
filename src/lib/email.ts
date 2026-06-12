import 'server-only';

import { Resend } from 'resend';
import { supabaseAdmin } from '@/lib/supabase';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function normalizeBuyerEmail(value: unknown): string | null {
  if (typeof value !== 'string') return null;
  const email = value.trim().toLowerCase();
  if (!email || email.length > 254 || !EMAIL_RE.test(email)) return null;
  return email;
}

function siteUrl(): string {
  const url = process.env.NEXT_PUBLIC_SITE_URL;
  if (!url) throw new Error('NEXT_PUBLIC_SITE_URL não configurada');
  return url.replace(/\/+$/, '');
}

function resendClient(): Resend {
  const key = process.env.RESEND_API_KEY;
  if (!key) throw new Error('RESEND_API_KEY não configurada');
  return new Resend(key);
}

function emailFrom(): string {
  return process.env.RESEND_FROM_EMAIL ?? 'LoveValentine <onboarding@resend.dev>';
}

function truncateError(err: unknown): string {
  const msg = err instanceof Error ? err.message : String(err);
  return msg.slice(0, 1000);
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export async function sendGiftEmailIfNeeded(giftId: string): Promise<void> {
  const supabase = supabaseAdmin();

  const { data: claimed, error: claimError } = await supabase
    .from('gifts')
    .update({ email_sent_at: new Date().toISOString(), email_error: null })
    .eq('id', giftId)
    .eq('status', 'paid')
    .not('buyer_email', 'is', null)
    .is('email_sent_at', null)
    .select('id, buyer_email, funnel')
    .maybeSingle();

  if (claimError) throw claimError;
  if (!claimed?.buyer_email) return;

  const email = normalizeBuyerEmail(claimed.buyer_email);
  if (!email) {
    await supabase
      .from('gifts')
      .update({ email_sent_at: null, email_error: 'Email inválido' })
      .eq('id', giftId);
    return;
  }

  const giftUrl = `${siteUrl()}/presente/${claimed.id}`;
  const receiverName = escapeHtml(
    typeof claimed.funnel?.base?.receiverName === 'string'
      ? claimed.funnel.base.receiverName
      : 'seu amor'
  );

  try {
    const { error } = await resendClient().emails.send({
      from: emailFrom(),
      to: email,
      subject: 'Seu presente LoveValentine está pronto',
      html: `
        <div style="font-family:Arial,sans-serif;line-height:1.5;color:#111827">
          <h1 style="font-size:24px;margin:0 0 16px">Seu presente está pronto</h1>
          <p>O pagamento foi confirmado e o presente para ${receiverName} já pode ser acessado.</p>
          <p>
            <a href="${giftUrl}" style="display:inline-block;background:#E11D48;color:#fff;text-decoration:none;padding:12px 18px;border-radius:10px;font-weight:700">
              Abrir presente
            </a>
          </p>
          <p>Se o botão não funcionar, copie este link:</p>
          <p><a href="${giftUrl}">${giftUrl}</a></p>
        </div>
      `,
      text: `Seu presente LoveValentine está pronto: ${giftUrl}`,
    });

    if (error) throw new Error(error.message);
  } catch (err) {
    await supabase
      .from('gifts')
      .update({ email_sent_at: null, email_error: truncateError(err) })
      .eq('id', giftId);
    throw err;
  }
}
