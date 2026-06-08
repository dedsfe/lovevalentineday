import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data', 'gifts');

// Garante que o diretório exista
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    // Gera um ID amigável de 9 caracteres alfanuméricos
    const id = Math.random().toString(36).substring(2, 11);
    
    const filePath = path.join(DATA_DIR, `${id}.json`);
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
    
    return NextResponse.json({ id });
  } catch (error) {
    console.error('Erro ao salvar presente:', error);
    return NextResponse.json({ error: 'Falha ao salvar o presente' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({ error: 'ID do presente não fornecido' }, { status: 400 });
    }
    
    // Filtro básico de segurança contra caminhos relativos
    const cleanId = id.replace(/[^a-z0-9]/gi, '');
    const filePath = path.join(DATA_DIR, `${cleanId}.json`);
    
    if (!fs.existsSync(filePath)) {
      return NextResponse.json({ error: 'Presente não encontrado' }, { status: 404 });
    }
    
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const data = JSON.parse(fileContent);
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Erro ao buscar presente:', error);
    return NextResponse.json({ error: 'Falha ao carregar o presente' }, { status: 500 });
  }
}
