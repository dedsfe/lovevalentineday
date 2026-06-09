'use client';

import { useRef, useState } from 'react';
import { Heart, X, Plus } from 'lucide-react';
import type { SpotifyData } from '@/lib/types';
import { StepHeader } from './shared';

interface Props {
  spotify:  SpotifyData;
  onChange: (payload: Partial<SpotifyData>) => void;
}

const MAX = 15;

export function Step5Reasons({ spotify, onChange }: Props) {
  const [input, setInput] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const reasons = spotify.reasons ?? [];

  const add = () => {
    const text = input.trim();
    if (!text || reasons.length >= MAX) return;
    onChange({ reasons: [...reasons, text] });
    setInput('');
    inputRef.current?.focus();
  };

  const remove = (i: number) =>
    onChange({ reasons: reasons.filter((_, idx) => idx !== i) });

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') { e.preventDefault(); add(); }
  };

  return (
    <div>
      <StepHeader
        title="Motivos"
        description="Liste os motivos pelos quais você ama essa pessoa."
        optional
      />

      {/* Input + add */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
        <div style={{
          flex: 1,
          border: '1.5px solid #E5E7EB', borderRadius: 14,
          padding: '13px 16px', background: '#fff',
          display: 'flex', alignItems: 'center', gap: 12,
          transition: 'border-color 0.15s',
        }}
          onFocus={() => {}} // handled by CSS below
        >
          <Heart size={18} color="#E11D48" fill="#E11D48" style={{ flexShrink: 0 }} />
          <input
            ref={inputRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={onKey}
            placeholder="Ex: Seu sorriso contagiante…"
            maxLength={80}
            disabled={reasons.length >= MAX}
            style={{
              flex: 1, border: 'none', outline: 'none', background: 'transparent',
              fontSize: 15, fontWeight: 600, color: '#111827', padding: 0,
              fontFamily: 'system-ui',
            }}
          />
        </div>
        <button
          onClick={add}
          disabled={!input.trim() || reasons.length >= MAX}
          style={{
            width: 52, height: 52, borderRadius: 14, border: 'none', flexShrink: 0,
            background: (!input.trim() || reasons.length >= MAX) ? '#F3F4F6' : '#E11D48',
            color: (!input.trim() || reasons.length >= MAX) ? '#9CA3AF' : '#fff',
            cursor: (!input.trim() || reasons.length >= MAX) ? 'not-allowed' : 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'background 0.15s, color 0.15s',
          }}
        >
          <Plus size={20} />
        </button>
      </div>

      {/* Counter */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        marginBottom: reasons.length > 0 ? 14 : 0,
      }}>
        {reasons.length > 0 && (
          <span style={{
            fontSize: 12, fontWeight: 700, color: '#6B7280',
            textTransform: 'uppercase', letterSpacing: '0.08em', fontFamily: 'system-ui',
          }}>
            {reasons.length} {reasons.length === 1 ? 'motivo' : 'motivos'}
          </span>
        )}
        {reasons.length >= MAX && (
          <span style={{ fontSize: 12, color: '#E11D48', fontWeight: 700, fontFamily: 'system-ui' }}>
            Máximo atingido
          </span>
        )}
      </div>

      {/* List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {reasons.map((reason, i) => (
          <div
            key={i}
            style={{
              display: 'flex', alignItems: 'flex-start', gap: 12,
              background: '#fff', border: '1.5px solid #F3F4F6',
              borderRadius: 12, padding: '13px 14px',
            }}
          >
            <div style={{
              width: 28, height: 28, borderRadius: 8,
              background: '#FFF1F2', border: '1.5px solid rgba(225,29,72,0.12)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            }}>
              <Heart size={13} color="#E11D48" fill="#E11D48" />
            </div>
            <span style={{
              flex: 1, fontSize: 14, fontWeight: 600, color: '#111827',
              lineHeight: 1.5, fontFamily: 'system-ui', paddingTop: 4,
            }}>
              {reason}
            </span>
            <button
              onClick={() => remove(i)}
              style={{
                background: 'none', border: 'none', cursor: 'pointer',
                padding: 4, borderRadius: 6, color: '#9CA3AF',
                display: 'flex', alignItems: 'center', flexShrink: 0,
                marginTop: 2,
              }}
            >
              <X size={14} />
            </button>
          </div>
        ))}
      </div>

      {reasons.length === 0 && (
        <div style={{
          padding: '32px 20px', textAlign: 'center',
          border: '2px dashed #F3F4F6', borderRadius: 16,
        }}>
          <p style={{ fontSize: 28, margin: '0 0 10px' }}>💝</p>
          <p style={{
            fontSize: 14, color: '#9CA3AF', fontWeight: 600,
            margin: 0, fontFamily: 'system-ui',
          }}>
            Adicione pelo menos um motivo para aparecer no presente.
          </p>
        </div>
      )}
    </div>
  );
}
