import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET(request: NextRequest) {
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
