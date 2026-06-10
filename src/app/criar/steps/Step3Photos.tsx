'use client';

import { useRef, useState } from 'react';
import type { SpotifyData } from '@/lib/types';
import { StepHeader } from './shared';

interface Props {
  spotify:  SpotifyData;
  onChange: (payload: Partial<SpotifyData>) => void;
}

const MAX = 10;
const MAX_DIM = 900;  // px — keeps photo quality good while staying well under 5MB

async function compressImage(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = e => {
      const img = new Image();
      img.onload = () => {
        const scale  = Math.min(1, MAX_DIM / Math.max(img.width, img.height));
        const w      = Math.round(img.width  * scale);
        const h      = Math.round(img.height * scale);
        const canvas = document.createElement('canvas');
        canvas.width  = w;
        canvas.height = h;
        canvas.getContext('2d')!.drawImage(img, 0, 0, w, h);
        resolve(canvas.toDataURL('image/jpeg', 0.72));
      };
      img.onerror = reject;
      img.src = e.target!.result as string;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export function Step3Photos({ spotify, onChange }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragIdx, setDragIdx]   = useState<number | null>(null);
  const [overIdx, setOverIdx]   = useState<number | null>(null);
  const [dropZone, setDropZone] = useState(false);

  const photos = spotify.photos;

  // ── Add files ───────────────────────────────────────────────────────────────

  const addFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const remaining = MAX - photos.length;
    if (remaining <= 0) return;
    const accepted = Array.from(files).filter(f => f.type.startsWith('image/')).slice(0, remaining);
    const base64s  = await Promise.all(accepted.map(compressImage));
    onChange({ photos: [...photos, ...base64s] });
  };

  // ── Remove ──────────────────────────────────────────────────────────────────

  const remove = (i: number) =>
    onChange({ photos: photos.filter((_, idx) => idx !== i) });

  // ── Drag-to-reorder ─────────────────────────────────────────────────────────

  const onDragStart = (i: number) => setDragIdx(i);
  const onDragOver  = (e: React.DragEvent, i: number) => { e.preventDefault(); setOverIdx(i); };
  const onDragLeave = () => setOverIdx(null);

  const onDrop = (e: React.DragEvent, toIdx: number) => {
    e.preventDefault();
    setOverIdx(null);
    if (dragIdx === null || dragIdx === toIdx) { setDragIdx(null); return; }
    const next = [...photos];
    const [moved] = next.splice(dragIdx, 1);
    next.splice(toIdx, 0, moved);
    onChange({ photos: next });
    setDragIdx(null);
  };

  // ── Drop zone (drag files from OS) ─────────────────────────────────────────

  const onZoneDragOver  = (e: React.DragEvent) => { e.preventDefault(); setDropZone(true); };
  const onZoneDragLeave = () => setDropZone(false);
  const onZoneDrop      = (e: React.DragEvent) => {
    e.preventDefault();
    setDropZone(false);
    addFiles(e.dataTransfer.files);
  };

  const canAdd = photos.length < MAX;

  return (
    <div>
      <StepHeader
        title="Fotos"
        description="O carousel de vocês — até 10 fotos, arrastáveis para reordenar."
        optional
      />

      {/* ── Upload zone ─────────────────────────────────────────────────────── */}
      {canAdd && (
        <div
          onClick={() => inputRef.current?.click()}
          onDragOver={onZoneDragOver}
          onDragLeave={onZoneDragLeave}
          onDrop={onZoneDrop}
          style={{
            border: `2px dashed ${dropZone ? '#E11D48' : '#E5E7EB'}`,
            borderRadius: 16,
            padding: '28px 20px',
            textAlign: 'center',
            cursor: 'pointer',
            background: dropZone ? '#FFF1F2' : '#FAFAFA',
            transition: 'border-color 0.15s, background 0.15s',
            marginBottom: photos.length > 0 ? 20 : 0,
          }}
        >
          <div style={{ fontSize: 36, marginBottom: 10 }}>📸</div>
          <p style={{
            fontSize: 15, fontWeight: 700, color: '#374151',
            margin: '0 0 4px', fontFamily: 'system-ui',
          }}>
            {photos.length === 0 ? 'Adicionar fotos' : 'Adicionar mais fotos'}
          </p>
          <p style={{ fontSize: 13, color: '#9CA3AF', margin: 0, fontFamily: 'system-ui' }}>
            Clique ou arraste arquivos aqui · {photos.length}/{MAX} fotos
          </p>
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            multiple
            style={{ display: 'none' }}
            onChange={e => addFiles(e.target.files)}
          />
        </div>
      )}

      {/* ── Photo grid ──────────────────────────────────────────────────────── */}
      {photos.length > 0 && (
        <div>
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            marginBottom: 12,
          }}>
            <span style={{
              fontSize: 12, fontWeight: 700, color: '#6B7280',
              textTransform: 'uppercase', letterSpacing: '0.08em', fontFamily: 'system-ui',
            }}>
              {photos.length} {photos.length === 1 ? 'foto' : 'fotos'} adicionadas
            </span>
            {photos.length >= MAX && (
              <span style={{ fontSize: 12, color: '#E11D48', fontWeight: 700, fontFamily: 'system-ui' }}>
                Máximo atingido
              </span>
            )}
          </div>

          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10,
          }}>
            {photos.map((src, i) => (
              <div
                key={i}
                draggable
                onDragStart={() => onDragStart(i)}
                onDragOver={e => onDragOver(e, i)}
                onDragLeave={onDragLeave}
                onDrop={e => onDrop(e, i)}
                style={{
                  position: 'relative', aspectRatio: '1/1', borderRadius: 12,
                  overflow: 'hidden', cursor: 'grab',
                  border: `2px solid ${overIdx === i && dragIdx !== i ? '#E11D48' : 'transparent'}`,
                  opacity: dragIdx === i ? 0.5 : 1,
                  transition: 'opacity 0.15s, border-color 0.15s',
                }}
              >
                <img
                  src={src}
                  alt={`Foto ${i + 1}`}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                />

                {/* Order badge */}
                <div style={{
                  position: 'absolute', top: 6, left: 6,
                  background: 'rgba(0,0,0,0.55)', color: '#fff',
                  fontSize: 11, fontWeight: 800, borderRadius: 6, padding: '2px 7px',
                  fontFamily: 'system-ui',
                }}>
                  {i + 1}
                </div>

                {/* Remove button */}
                <button
                  onClick={e => { e.stopPropagation(); remove(i); }}
                  style={{
                    position: 'absolute', top: 5, right: 5,
                    width: 26, height: 26, borderRadius: '50%',
                    background: 'rgba(0,0,0,0.6)', border: 'none',
                    color: '#fff', fontSize: 14, fontWeight: 700,
                    cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    lineHeight: 1,
                  }}
                >
                  ×
                </button>

                {/* First photo badge */}
                {i === 0 && (
                  <div style={{
                    position: 'absolute', bottom: 6, left: 0, right: 0,
                    display: 'flex', justifyContent: 'center',
                  }}>
                    <span style={{
                      background: '#E11D48', color: '#fff',
                      fontSize: 9, fontWeight: 800, borderRadius: 4, padding: '2px 7px',
                      fontFamily: 'system-ui', textTransform: 'uppercase', letterSpacing: '0.06em',
                    }}>
                      Capa
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>

          <p style={{
            fontSize: 12, color: '#9CA3AF', margin: '12px 0 0',
            fontFamily: 'system-ui', textAlign: 'center',
          }}>
            Arraste as fotos para reordenar · A primeira vira a capa
          </p>
        </div>
      )}
    </div>
  );
}
