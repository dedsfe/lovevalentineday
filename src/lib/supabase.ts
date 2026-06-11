import { createClient, type SupabaseClient } from '@supabase/supabase-js';

// Server-side only — não importar em componentes client.
// Todo acesso à tabela gifts passa por aqui (service role); o anon/publishable key
// não tem mais nenhuma policy de RLS, então a tabela é inacessível pelo browser.

const URL_ = process.env.NEXT_PUBLIC_SUPABASE_URL!;

// Chave secret: ignora RLS. Único caminho de leitura/escrita em gifts.
export function supabaseAdmin(): SupabaseClient {
  const key = process.env.SUPABASE_SECRET_KEY;
  if (!key) throw new Error('SUPABASE_SECRET_KEY não configurada');
  return createClient(URL_, key);
}
