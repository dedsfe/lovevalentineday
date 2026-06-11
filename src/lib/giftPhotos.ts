import { supabaseAdmin } from '@/lib/supabase';
import type { FunnelData } from '@/app/criar/funnel';

// As fotos chegam do funil como data-URLs base64 dentro do JSON. Guardar isso
// na tabela gifts incha o banco (TOAST) e trafega megabytes a cada leitura.
// No checkout, cada foto vira um objeto no bucket gift-photos e o funnel passa
// a guardar só a URL pública (caminho não-enumerável: id do presente é
// aleatório, mesmo modelo de capability-URL do próprio presente).
//
// Fail-open por foto: se um upload falhar, a foto fica em base64 e o checkout
// segue — indisponibilidade do Storage não pode bloquear uma venda.

const BUCKET = 'gift-photos';

const MIME_EXT: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png':  'png',
  'image/webp': 'webp',
  'image/gif':  'gif',
  'image/heic': 'heic',
  'image/heif': 'heif',
};

function parseDataUrl(value: string): { mime: string; buffer: Buffer } | null {
  const m = value.match(/^data:(image\/[a-z+.-]+);base64,(.+)$/i);
  if (!m) return null;
  try {
    return { mime: m[1].toLowerCase(), buffer: Buffer.from(m[2], 'base64') };
  } catch {
    return null;
  }
}

async function uploadPhoto(giftId: string, name: string, dataUrl: string): Promise<string> {
  const parsed = parseDataUrl(dataUrl);
  if (!parsed) return dataUrl; // já é URL (ou valor vazio) — nada a fazer

  const ext  = MIME_EXT[parsed.mime] ?? 'jpg';
  const path = `${giftId}/${name}.${ext}`;

  try {
    const storage = supabaseAdmin().storage.from(BUCKET);
    const { error } = await storage.upload(path, parsed.buffer, {
      contentType: parsed.mime,
      upsert: true,
    });
    if (error) {
      console.error(`Fotos: falha ao subir ${path} — mantendo base64:`, error);
      return dataUrl;
    }
    return storage.getPublicUrl(path).data.publicUrl;
  } catch (err) {
    console.error(`Fotos: falha ao subir ${path} — mantendo base64:`, err);
    return dataUrl;
  }
}

// O funnel vem de JSON do cliente — qualquer campo pode faltar ou ter tipo
// errado. Valor que não é string passa reto (vira o que o cliente mandou,
// inofensivo no JSONB); só data-URLs de imagem viram upload.
async function maybeUpload<T>(giftId: string, name: string, value: T): Promise<T | string> {
  if (typeof value !== 'string' || !value) return value;
  return uploadPhoto(giftId, name, value);
}

export async function offloadGiftPhotos(funnel: FunnelData, giftId: string): Promise<FunnelData> {
  const out = structuredClone(funnel);

  if (out.base && typeof out.base === 'object') {
    out.base.coverPhoto = (await maybeUpload(giftId, 'cover', out.base.coverPhoto)) as string;
  }
  if (out.spotify && typeof out.spotify === 'object') {
    const photos = Array.isArray(out.spotify.photos) ? out.spotify.photos : [];
    const [closing, uploaded] = await Promise.all([
      maybeUpload(giftId, 'closing', out.spotify.closingPhoto),
      Promise.all(photos.map((p, i) => maybeUpload(giftId, `photo-${i}`, p))),
    ]);
    out.spotify.closingPhoto = closing as string;
    out.spotify.photos       = uploaded as string[];
  }
  return out;
}
