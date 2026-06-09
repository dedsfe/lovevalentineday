'use client';

import { useState } from 'react';
import type { SpotifyData } from '@/lib/types';
import { StepHeader } from './shared';

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
  const [focused, setFocused] = useState(false);
  const msg = spotify.specialMessage ?? '';
  const len = msg.length;

  return (
    <div>
      <StepHeader
        title="Mensagem"
        description="Uma palavra do coração aparece em destaque no presente."
        optional
      />

      {/* Textarea */}
      <div style={{
        border: `1.5px solid ${focused ? '#E11D48' : '#E5E7EB'}`,
        borderRadius: 16,
        overflow: 'hidden',
        boxShadow: focused ? '0 0 0 3.5px rgba(225,29,72,0.09)' : 'none',
        transition: 'border-color 0.15s, box-shadow 0.15s',
        background: '#fff',
      }}>
        <textarea
          value={msg}
          maxLength={MAX_CHARS}
          placeholder="Escreva sua mensagem de amor aqui… Ela aparecerá com destaque dentro do presente."
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
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
        {/* Counter */}
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

      {/* Quick suggestions */}
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
                  (e.currentTarget as HTMLButtonElement).style.background = '#FFF1F2';
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLButtonElement).style.borderColor = '#F3F4F6';
                  (e.currentTarget as HTMLButtonElement).style.background = '#FAFAFA';
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

      {/* Clear button */}
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
    </div>
  );
}
