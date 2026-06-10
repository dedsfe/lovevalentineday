import { createClient, type SupabaseClient } from '@supabase/supabase-js';

// Server-side only — não importar em componentes client.

const URL_ = process.env.NEXT_PUBLIC_SUPABASE_URL!;

// Chave publishable: respeita RLS (insert pending + select). Usada nas rotas públicas.
export function supabasePublic(): SupabaseClient {
  return createClient(URL_, process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!);
}

// Chave secret: ignora RLS. Usada só no webhook do Stripe para marcar como pago.
export function supabaseAdmin(): SupabaseClient {
  const key = process.env.SUPABASE_SECRET_KEY;
  if (!key) throw new Error('SUPABASE_SECRET_KEY não configurada');
  return createClient(URL_, key);
}
