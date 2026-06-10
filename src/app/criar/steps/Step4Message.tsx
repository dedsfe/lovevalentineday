'use client';

import { useRef, useState } from 'react';
import { ImagePlus, X } from 'lucide-react';
import type { SpotifyData } from '@/lib/types';
import { StepHeader, SectionDivider, FieldCard, inlineInput } from './shared';

interface Props {
  spotify:  SpotifyData;
  onChange: (payload: Partial<SpotifyData>) => void;
}

const MAX_CHARS = 400;

const SUGGESTIONS = [
  'Você é a melhor parte dos meus dias. Cada momento ao seu lado é um presente.',
  'Eu te escolho todos os dias. Ontem, hoje e sempre.',
  'Obrigado por existir e por fazer parte da minha vida. Te amo mais do que as palavras conseguem dizer.',
  'Você é meu lar favorito.',
];

export function Step4Message({ spotify, onChange }: Props) {
  const [msgFocused, setMsgFocused] = useState(false);
  const [capFocused, setCapFocused] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const msg     = spotify.specialMessage ?? '';
  const len     = msg.length;
  const photo   = spotify.closingPhoto   ?? '';
  const caption = spotify.closingCaption ?? '';

  const pickPhoto = () => fileRef.current?.click();

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => onChange({ closingPhoto: ev.target?.result as string });
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  return (
    <div>
      <StepHeader
        title="Mensagem"
        description="Uma palavra do coração aparece em destaque no presente."
        optional
      />

      {/* ── Special message textarea ────────────────────────────────── */}
      <div style={{
        border: `1.5px solid ${msgFocused ? '#E11D48' : '#E5E7EB'}`,
        borderRadius: 16,
        overflow: 'hidden',
        boxShadow: msgFocused ? '0 0 0 3.5px rgba(225,29,72,0.09)' : 'none',
        transition: 'border-color 0.15s, box-shadow 0.15s',
        background: '#fff',
      }}>
        <textarea
          value={msg}
          maxLength={MAX_CHARS}
          placeholder="Escreva sua mensagem de amor aqui… Ela aparecerá com destaque dentro do presente."
          onFocus={() => setMsgFocused(true)}
          onBlur={() => setMsgFocused(false)}
          onChange={e => onChange({ specialMessage: e.target.value })}
          style={{
            width: '100%', border: 'none', outline: 'none', resize: 'none',
            fontSize: 16, lineHeight: 1.6, fontWeight: 500,
            color: '#111827', background: 'transparent',
            padding: '18px 20px 12px',
            fontFamily: 'system-ui, -apple-system, sans-serif',
            minHeight: 160,
            boxSizing: 'border-box',
          }}
        />
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '8px 20px 14px',
          borderTop: '1px solid #F9FAFB',
        }}>
          <span style={{ fontSize: 12, color: '#9CA3AF', fontFamily: 'system-ui' }}>
            {len === 0 ? 'Dica: seja sincero e específico ❤️' : ''}
          </span>
          <span style={{
            fontSize: 12, fontWeight: 700, fontFamily: 'system-ui',
            color: len >= MAX_CHARS * 0.9 ? '#E11D48' : '#9CA3AF',
          }}>
            {len}/{MAX_CHARS}
          </span>
        </div>
      </div>

      {len === 0 && (
        <div style={{ marginTop: 24 }}>
          <p style={{
            fontSize: 12, fontWeight: 700, color: '#6B7280',
            textTransform: 'uppercase', letterSpacing: '0.08em',
            margin: '0 0 12px', fontFamily: 'system-ui',
          }}>
            Inspirações
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {SUGGESTIONS.map((s, i) => (
              <button
                key={i}
                onClick={() => onChange({ specialMessage: s })}
                style={{
                  textAlign: 'left', background: '#FAFAFA',
                  border: '1.5px solid #F3F4F6',
                  borderRadius: 12, padding: '12px 16px',
                  cursor: 'pointer', transition: 'border-color 0.15s, background 0.15s',
                  fontFamily: 'system-ui',
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLButtonElement).style.borderColor = '#E11D48';
                  (e.currentTarget as HTMLButtonElement).style.background  = '#FFF1F2';
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLButtonElement).style.borderColor = '#F3F4F6';
                  (e.currentTarget as HTMLButtonElement).style.background  = '#FAFAFA';
                }}
              >
                <p style={{ fontSize: 14, color: '#374151', margin: 0, lineHeight: 1.5, fontWeight: 500 }}>
                  "{s}"
                </p>
              </button>
            ))}
          </div>
        </div>
      )}

      {len > 0 && (
        <button
          onClick={() => onChange({ specialMessage: '' })}
          style={{
            marginTop: 12, background: 'none', border: 'none', cursor: 'pointer',
            fontSize: 13, color: '#9CA3AF', fontFamily: 'system-ui', padding: 0,
          }}
        >
          Limpar mensagem
        </button>
      )}

      {/* ── Closing photo ───────────────────────────────────────────── */}
      <div style={{ marginTop: 40 }}>
        <SectionDivider label="Foto de encerramento" />
        <p style={{
          fontSize: 13, color: '#6B7280', margin: '0 0 18px', lineHeight: 1.5,
          fontFamily: 'system-ui',
        }}>
          Aparece depois da mensagem: foto de vocês com um texto romântico sobreposto.
        </p>

        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          style={{ display: 'none' }}
          onChange={handleFile}
        />

        {photo ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {/* Preview */}
            <div style={{ position: 'relative', borderRadius: 16, overflow: 'hidden', aspectRatio: '16/9' }}>
              <img src={photo} alt="foto de encerramento" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
              {/* Blur overlay preview */}
              <div style={{
                position: 'absolute', top: 0, left: 0, right: 0, height: '55%',
                backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)',
                background: 'rgba(0,0,0,0.28)',
              }} />
              {caption && (
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, padding: '16px 18px' }}>
                  <p style={{
                    color: '#fff', fontWeight: 700, fontSize: 16, margin: 0,
                    lineHeight: 1.35, textShadow: '0 1px 6px rgba(0,0,0,0.6)',
                    fontFamily: 'system-ui',
                  }}>
                    {caption}
                  </p>
                </div>
              )}
              <button
                onClick={() => onChange({ closingPhoto: '', closingCaption: '' })}
                style={{
                  position: 'absolute', top: 10, right: 10,
                  width: 30, height: 30, borderRadius: '50%',
                  background: 'rgba(0,0,0,0.55)', border: 'none',
                  cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}
              >
                <X size={14} color="#fff" />
              </button>
            </div>

            {/* Caption input */}
            <FieldCard icon="✍️" label="Texto sobre a foto" focused={capFocused}>
              <input
                style={inlineInput}
                type="text"
                value={caption}
                placeholder="Ex: Você é meu maior presente… ❤️"
                maxLength={80}
                onFocus={() => setCapFocused(true)}
                onBlur={() => setCapFocused(false)}
                onChange={e => onChange({ closingCaption: e.target.value })}
              />
            </FieldCard>

            <button
              onClick={pickPhoto}
              style={{
                background: 'none', border: 'none', cursor: 'pointer',
                fontSize: 13, color: '#9CA3AF', fontFamily: 'system-ui', padding: 0, textAlign: 'left',
              }}
            >
              Trocar foto
            </button>
          </div>
        ) : (
          <button
            onClick={pickPhoto}
            style={{
              width: '100%', border: '2px dashed #E5E7EB', borderRadius: 16,
              padding: '32px 20px', background: '#FAFAFA',
              cursor: 'pointer', display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center', gap: 12,
              transition: 'border-color 0.15s, background 0.15s',
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLButtonElement).style.borderColor = '#E11D48';
              (e.currentTarget as HTMLButtonElement).style.background  = '#FFF1F2';
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLButtonElement).style.borderColor = '#E5E7EB';
              (e.currentTarget as HTMLButtonElement).style.background  = '#FAFAFA';
            }}
          >
            <div style={{
              width: 52, height: 52, borderRadius: 14,
              background: '#fff', border: '1.5px solid #E5E7EB',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <ImagePlus size={24} color="#9CA3AF" />
            </div>
            <div>
              <p style={{ fontSize: 15, fontWeight: 700, color: '#374151', margin: '0 0 4px', fontFamily: 'system-ui' }}>
                Adicionar foto de encerramento
              </p>
              <p style={{ fontSize: 12, color: '#9CA3AF', margin: 0, fontFamily: 'system-ui' }}>
                Recomendado: foto horizontal (16:9)
              </p>
            </div>
          </button>
        )}
      </div>
    </div>
  );
}
