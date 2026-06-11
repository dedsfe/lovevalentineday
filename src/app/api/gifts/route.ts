import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { rateLimitOk, tooManyRequests } from '@/lib/rateLimit';

export async function GET(request: NextRequest) {
  // 60 leituras / min por IP — o destinatário abre 1 presente; isso barra scraping
  if (!(await rateLimitOk(request, 'gifts', 60, 60))) return tooManyRequests();

  const id = request.nextUrl.searchParams.get('id');
  if (!id) {
    return NextResponse.json({ error: 'ID do presente não fornecido' }, { status: 400 });
  }

  const cleanId = id.replace(/[^a-z0-9]/gi, '');
  const { data, error } = await supabaseAdmin()
    .from('gifts')
    .select('id, created_at, status, funnel, addons')
    .eq('id', cleanId)
    .maybeSingle();

  if (error) {
    console.error('Erro ao buscar presente:', error);
    return NextResponse.json({ error: 'Falha ao carregar o presente' }, { status: 500 });
  }
  if (!data) {
    return NextResponse.json({ error: 'Presente não encontrado' }, { status: 404 });
  }

  // Gate de pagamento: presente pendente não revela o conteúdo (nomes, fotos, mensagem).
  if (data.status !== 'paid') {
    return NextResponse.json({
      id:        data.id,
      createdAt: data.created_at,
      status:    data.status,
    });
  }

  return NextResponse.json({
    id:        data.id,
    createdAt: data.created_at,
    status:    data.status,
    funnel:    data.funnel,
    addons:    data.addons,
  });
}
