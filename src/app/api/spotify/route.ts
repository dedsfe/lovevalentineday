import { NextRequest, NextResponse } from 'next/server';
import { rateLimitOk, tooManyRequests } from '@/lib/rateLimit';

// ─── Spotify token cache ──────────────────────────────────────────────────────

let tokenCache: { value: string; expiresAt: number } | null = null;

async function getSpotifyToken(): Promise<string> {
  if (tokenCache && Date.now() < tokenCache.expiresAt) return tokenCache.value;

  const clientId     = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
  if (!clientId || !clientSecret) throw new Error('Credenciais do Spotify não configuradas');

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

// ─── Deezer fallback (sem API key, gratuito) ──────────────────────────────────

async function getDeezerPreview(title: string, artist: string): Promise<string | null> {
  try {
    const ctrl = new AbortController();
    const tid  = setTimeout(() => ctrl.abort(), 2500);
    const q    = encodeURIComponent(`${title} ${artist}`);
    const res  = await fetch(`https://api.deezer.com/search?q=${q}&limit=1`, { signal: ctrl.signal });
    clearTimeout(tid);
    if (!res.ok) return null;
    const json = await res.json();
    return json.data?.[0]?.preview ?? null;
  } catch {
    return null;
  }
}

// ─── Format helper ────────────────────────────────────────────────────────────

async function formatTrack(track: {
  id: string;
  name: string;
  artists: { name: string }[];
  album: { name: string; images: { url: string }[] };
  preview_url: string | null;
  duration_ms: number;
}) {
  // Spotify preview primeiro; se null, busca no Deezer automaticamente
  let audioUrl = track.preview_url;
  if (!audioUrl) {
    audioUrl = await getDeezerPreview(track.name, track.artists[0]?.name ?? '');
  }

  return {
    id:         track.id,
    title:      track.name,
    artist:     track.artists.map(a => a.name).join(', '),
    album:      track.album.name,
    albumArt:   track.album.images[0]?.url ?? null,
    previewUrl: audioUrl,        // Spotify OU Deezer — sempre que disponível
    hasRealPreview: !!audioUrl,  // true = toca de verdade
    durationMs: track.duration_ms,
  };
}

// ─── Deezer search (no credentials needed — fallback + preview enrichment) ────

async function searchDeezer(q: string) {
  try {
    // mesmo timeout do getDeezerPreview — Deezer fora do ar não pode segurar a função
    const ctrl = new AbortController();
    const tid  = setTimeout(() => ctrl.abort(), 2500);
    const res  = await fetch(`https://api.deezer.com/search?q=${encodeURIComponent(q)}&limit=6`, { signal: ctrl.signal });
    clearTimeout(tid);
    if (!res.ok) return [];
    const json = await res.json();
    return (json.data ?? []).map((t: {
      id: number; title: string; duration: number;
      artist: { name: string };
      album: { title: string; cover_medium: string };
      preview: string;
    }) => ({
      id:             `deezer_${t.id}`,
      title:          t.title,
      artist:         t.artist.name,
      album:          t.album.title,
      albumArt:       t.album.cover_medium ?? null,
      previewUrl:     t.preview || null,
      hasRealPreview: !!t.preview,
      durationMs:     t.duration * 1000,
    }));
  } catch { return []; }
}

// ─── Route ────────────────────────────────────────────────────────────────────

function extractTrackId(input: string): string | null {
  const m = input.match(/track\/([a-zA-Z0-9]+)/) || input.match(/^([a-zA-Z0-9]{22})$/);
  return m ? m[1] : null;
}

export async function GET(request: NextRequest) {
  // 30 buscas / min por IP — protege a cota da API do Spotify
  if (!(await rateLimitOk(request, 'spotify', 30, 60))) return tooManyRequests();

  const { searchParams } = request.nextUrl;
  const searchQuery = searchParams.get('search');
  const trackParam  = searchParams.get('track');

  // ── Busca por nome ──────────────────────────────────────────────────────
  if (searchQuery) {
    try {
      const token   = await getSpotifyToken();
      const res     = await fetch(
        `https://api.spotify.com/v1/search?q=${encodeURIComponent(searchQuery)}&type=track&limit=6`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (!res.ok) throw new Error('spotify_error');
      const json    = await res.json();
      const results = await Promise.all((json.tracks?.items ?? []).map(formatTrack));
      return NextResponse.json({ results });
    } catch {
      // Spotify unavailable or not configured — fall back to Deezer silently
      const results = await searchDeezer(searchQuery);
      return NextResponse.json({ results });
    }
  }

  // ── Busca por ID / URL ──────────────────────────────────────────────────
  if (trackParam) {
    try {
      const token   = await getSpotifyToken();
      const trackId = extractTrackId(trackParam);
      if (!trackId) return NextResponse.json({ error: 'URL ou ID inválido' }, { status: 400 });

      const res = await fetch(`https://api.spotify.com/v1/tracks/${trackId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.status === 404) return NextResponse.json({ error: 'Música não encontrada' }, { status: 404 });
      if (!res.ok) throw new Error('spotify_error');
      return NextResponse.json(await formatTrack(await res.json()));
    } catch {
      return NextResponse.json({ error: 'Não foi possível buscar a música.' }, { status: 500 });
    }
  }

  return NextResponse.json({ error: 'Parâmetro search ou track obrigatório' }, { status: 400 });
}
