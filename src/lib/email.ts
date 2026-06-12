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

  const base = siteUrl();
  const giftUrl = `${base}/presente/${claimed.id}`;
  const logoUrl = `${base}/lovepanda-logo.png`;
  const receiverName = escapeHtml(
    typeof claimed.funnel?.base?.receiverName === 'string'
      ? claimed.funnel.base.receiverName
      : 'seu amor'
  );
  const giverName = escapeHtml(
    typeof claimed.funnel?.base?.giverName === 'string'
      ? claimed.funnel.base.giverName
      : ''
  );

  try {
    const { error } = await resendClient().emails.send({
      from: emailFrom(),
      to: email,
      subject: `💌 Seu presente para ${receiverName} está pronto!`,
      html: `
<!DOCTYPE html>
<html lang="pt-BR">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#F3F4F6;font-family:Arial,'Helvetica Neue',Helvetica,sans-serif;-webkit-font-smoothing:antialiased;">

<!-- Wrapper -->
<table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#F3F4F6;padding:32px 16px;">
<tr><td align="center">
<table width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:520px;background:#ffffff;border-radius:20px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">

  <!-- Header — dark com logo -->
  <tr>
    <td style="background:linear-gradient(135deg,#0A0A0A 0%,#1A1A2E 100%);padding:36px 32px 28px;text-align:center;">
      <img src="${logoUrl}" alt="LoveValentine" width="44" height="44" style="display:inline-block;border-radius:12px;margin-bottom:14px;" />
      <div style="font-size:22px;font-weight:800;color:#ffffff;letter-spacing:-0.02em;">
        Love<span style="color:#FB7185;">Valentine</span>
      </div>
    </td>
  </tr>

  <!-- Corpo principal -->
  <tr>
    <td style="padding:36px 32px 24px;">
      <!-- Emoji destaque -->
      <div style="text-align:center;font-size:48px;margin-bottom:16px;">🎉</div>

      <h1 style="margin:0 0 12px;font-size:24px;font-weight:800;color:#111827;text-align:center;letter-spacing:-0.02em;line-height:1.2;">
        Presente criado com sucesso!
      </h1>

      <p style="margin:0 0 28px;font-size:15px;color:#6B7280;text-align:center;line-height:1.6;">
        ${giverName ? `<strong style="color:#111827;">${giverName}</strong>, o` : 'O'} pagamento foi confirmado e o presente para
        <strong style="color:#E11D48;">${receiverName}</strong> já está disponível.
      </p>

      <!-- Divider sutil -->
      <div style="height:1px;background:linear-gradient(90deg,transparent,#E5E7EB,transparent);margin:0 0 28px;"></div>

      <!-- Instrução -->
      <p style="margin:0 0 6px;font-size:12px;font-weight:700;color:#9CA3AF;text-transform:uppercase;letter-spacing:0.1em;text-align:center;">
        Link do presente
      </p>

      <!-- Link box -->
      <div style="background:#F9FAFB;border:1.5px solid #E5E7EB;border-radius:12px;padding:14px 16px;margin-bottom:24px;">
        <a href="${giftUrl}" style="font-size:13px;color:#374151;word-break:break-all;text-decoration:none;font-weight:500;">${giftUrl}</a>
      </div>

      <!-- CTA principal -->
      <table width="100%" cellpadding="0" cellspacing="0" border="0">
        <tr><td align="center">
          <a href="${giftUrl}" style="display:inline-block;background:linear-gradient(135deg,#E11D48,#BE123C);color:#ffffff;text-decoration:none;padding:16px 40px;border-radius:14px;font-size:16px;font-weight:800;letter-spacing:-0.01em;box-shadow:0 8px 24px rgba(225,29,72,0.35);">
            Abrir presente →
          </a>
        </td></tr>
      </table>

      <!-- Dica WhatsApp -->
      <div style="margin-top:28px;background:#F0FDF4;border:1.5px solid rgba(34,197,94,0.2);border-radius:12px;padding:14px 16px;text-align:center;">
        <p style="margin:0;font-size:13px;color:#166534;line-height:1.5;">
          <strong>💡 Dica:</strong> Copie o link acima e envie pelo <strong>WhatsApp</strong> para surpreender ${receiverName}!
        </p>
      </div>
    </td>
  </tr>

  <!-- Footer -->
  <tr>
    <td style="background:#F9FAFB;border-top:1px solid #F3F4F6;padding:24px 32px;text-align:center;">
      <p style="margin:0 0 8px;font-size:12px;color:#9CA3AF;line-height:1.5;">
        Feito com ❤️ por <a href="${base}" style="color:#E11D48;text-decoration:none;font-weight:600;">LoveValentine</a>
      </p>
      <p style="margin:0;font-size:11px;color:#D1D5DB;">
        Presente digital personalizado para casais
      </p>
    </td>
  </tr>

</table>
</td></tr>
</table>

</body>
</html>
      `,
      text: `Seu presente LoveValentine para ${receiverName} está pronto!\n\nAbra aqui: ${giftUrl}\n\nDica: copie o link e envie pelo WhatsApp para surpreender!`,
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
