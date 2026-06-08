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
  const match = input.match(/track\/([a-zA-Z0-9]+)/) || input.match(/^([a-zA-Z0-9]{22})$/);
  return match ? match[1] : null;
}

function formatTrack(track: {
  id: string;
  name: string;
  artists: { name: string }[];
  album: { name: string; images: { url: string }[] };
  preview_url: string | null;
  duration_ms: number;
}) {
  return {
    id:         track.id,
    title:      track.name,
    artist:     track.artists.map(a => a.name).join(', '),
    album:      track.album.name,
    albumArt:   track.album.images[0]?.url ?? null,
    previewUrl: track.preview_url ?? null,
    durationMs: track.duration_ms,
  };
}

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const trackParam  = searchParams.get('track');
  const searchQuery = searchParams.get('search');

  try {
    const token = await getAccessToken();

    // ── Busca por nome ────────────────────────────────────────────────────
    if (searchQuery) {
      const res = await fetch(
        `https://api.spotify.com/v1/search?q=${encodeURIComponent(searchQuery)}&type=track&limit=6`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (!res.ok) throw new Error('Erro na busca do Spotify');
      const json = await res.json();
      const results = (json.tracks?.items ?? []).map(formatTrack);
      return NextResponse.json({ results });
    }

    // ── Busca por ID / URL ────────────────────────────────────────────────
    if (trackParam) {
      const trackId = extractTrackId(trackParam);
      if (!trackId) return NextResponse.json({ error: 'URL ou ID inválido' }, { status: 400 });

      const res = await fetch(`https://api.spotify.com/v1/tracks/${trackId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.status === 404) return NextResponse.json({ error: 'Música não encontrada' }, { status: 404 });
      if (!res.ok) throw new Error('Erro na API do Spotify');

      return NextResponse.json(formatTrack(await res.json()));
    }

    return NextResponse.json({ error: 'Parâmetro search ou track obrigatório' }, { status: 400 });

  } catch (err) {
    const message = err instanceof Error ? err.message : 'Erro desconhecido';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
