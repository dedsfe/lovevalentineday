import { NextRequest, NextResponse } from 'next/server';

// Token cache — dura 1h, reutilizado entre requests
let tokenCache: { value: string; expiresAt: number } | null = null;

async function getAccessToken(): Promise<string> {
  if (tokenCache && Date.now() < tokenCache.expiresAt) {
    return tokenCache.value;
  }

  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error('SPOTIFY_CLIENT_ID e SPOTIFY_CLIENT_SECRET não configurados');
  }

  const res = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`,
    },
    body: 'grant_type=client_credentials',
  });

  if (!res.ok) throw new Error('Falha ao obter token do Spotify');

  const json = await res.json();
  tokenCache = { value: json.access_token, expiresAt: Date.now() + (json.expires_in - 60) * 1000 };
  return tokenCache.value;
}

function extractTrackId(input: string): string | null {
  // Aceita URL completa ou só o ID
  const match = input.match(/track\/([a-zA-Z0-9]+)/) || input.match(/^([a-zA-Z0-9]{22})$/);
  return match ? match[1] : null;
}

export async function GET(request: NextRequest) {
  const raw = request.nextUrl.searchParams.get('track');
  if (!raw) return NextResponse.json({ error: 'Parâmetro track ausente' }, { status: 400 });

  const trackId = extractTrackId(raw);
  if (!trackId) return NextResponse.json({ error: 'URL ou ID inválido' }, { status: 400 });

  try {
    const token = await getAccessToken();

    const res = await fetch(`https://api.spotify.com/v1/tracks/${trackId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (res.status === 404) return NextResponse.json({ error: 'Música não encontrada' }, { status: 404 });
    if (!res.ok) throw new Error('Erro na API do Spotify');

    const track = await res.json();

    return NextResponse.json({
      id:         track.id,
      title:      track.name,
      artist:     track.artists.map((a: { name: string }) => a.name).join(', '),
      albumArt:   track.album.images[0]?.url ?? null,
      previewUrl: track.preview_url ?? null,      // null em algumas regiões/tracks
      durationMs: track.duration_ms,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Erro desconhecido';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
