import { supabaseAdmin } from '@/lib/supabase';

// Rate limit de janela fixa por rota+IP, persistido no Postgres (função
// hit_rate_limit, migração rate_limits) — funciona entre instâncias serverless.
// Fail-open: se o Supabase falhar, a requisição passa; indisponibilidade do
// rate limit não pode derrubar o produto.
export async function rateLimitOk(
  request: Request,
  route: string,
  max: number,
  windowSecs: number
): Promise<boolean> {
  // x-real-ip é setado pela Vercel (não forjável pelo cliente)
  const ip =
    request.headers.get('x-real-ip') ??
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    'unknown';

  try {
    const { data, error } = await supabaseAdmin().rpc('hit_rate_limit', {
      p_key: `${route}:${ip}`,
      p_max: max,
      p_window_secs: windowSecs,
    });
    if (error) {
      console.error('Rate limit indisponível:', error);
      return true;
    }
    return data === true;
  } catch (err) {
    console.error('Rate limit indisponível:', err);
    return true;
  }
}

export const tooManyRequests = () =>
  Response.json({ error: 'Muitas requisições — tente novamente em instantes' }, { status: 429 });
