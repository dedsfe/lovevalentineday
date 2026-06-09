'use client';

import { useState } from 'react';
import type { GiftBase } from '@/lib/types';

interface Props {
  base:     GiftBase;
  onChange: (payload: Partial<GiftBase>) => void;
}

// ─── Card field ───────────────────────────────────────────────────────────────

function FieldCard({
  icon, label, focused, note, children,
}: {
  icon: string; label: string; focused: boolean; note?: string; children: React.ReactNode;
}) {
  return (
    <div>
      <div style={{
        background: '#fff',
        border: `1.5px solid ${focused ? '#E11D48' : '#E5E7EB'}`,
        borderRadius: 14,
        padding: '13px 16px',
        display: 'flex', alignItems: 'center', gap: 14,
        boxShadow: focused ? '0 0 0 3.5px rgba(225,29,72,0.09)' : 'none',
        transition: 'border-color 0.15s, box-shadow 0.15s',
        cursor: 'text',
      }}>
        {/* Icon bubble */}
        <div style={{
          width: 40, height: 40, borderRadius: 11,
          background: focused ? '#FFF1F2' : '#F9FAFB',
          border: `1.5px solid ${focused ? 'rgba(225,29,72,0.18)' : '#F0F0F0'}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 19, flexShrink: 0,
          transition: 'background 0.15s, border-color 0.15s',
        }}>
          {icon}
        </div>

        {/* Label + input */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            fontSize: 10, fontWeight: 800, color: focused ? '#E11D48' : '#9CA3AF',
            textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 4,
            transition: 'color 0.15s',
            fontFamily: 'system-ui',
          }}>
            {label}
          </div>
          {children}
        </div>
      </div>
      {note && (
        <p style={{ fontSize: 11.5, color: '#9CA3AF', margin: '5px 0 0 8px', fontFamily: 'system-ui' }}>
          {note}
        </p>
      )}
    </div>
  );
}

// ─── Inline input style ───────────────────────────────────────────────────────

const inlineInput: React.CSSProperties = {
  width: '100%', border: 'none', outline: 'none', background: 'transparent',
  fontSize: 15, fontWeight: 600, color: '#111827', padding: 0,
  fontFamily: 'system-ui, -apple-system, sans-serif',
};

// ─── Component ───────────────────────────────────────────────────────────────

export function Step1Names({ base, onChange }: Props) {
  const [focused, setFocused] = useState<string | null>(null);
  const today = new Date().toISOString().slice(0, 10);

  const focus   = (id: string) => setFocused(id);
  const blur    = () => setFocused(null);
  const isFoc   = (id: string) => focused === id;

  return (
    <div>
      {/* Title */}
      <h1 style={{
        fontSize: 30, fontWeight: 800, color: '#111827',
        margin: '0 0 6px', letterSpacing: '-0.02em', lineHeight: 1.15,
        fontFamily: 'system-ui',
      }}>
        Nomes &amp; Data
      </h1>
      <p style={{ fontSize: 16, color: '#6B7280', margin: '0 0 22px', fontFamily: 'system-ui' }}>
        Quem são os apaixonados?
      </p>

      {/* "Editable later" hint */}
      <div style={{
        display: 'inline-flex', alignItems: 'center', gap: 6,
        background: '#FFF1F2', border: '1px solid rgba(225,29,72,0.15)',
        borderRadius: 20, padding: '6px 14px', marginBottom: 32,
      }}>
        <span style={{ fontSize: 12.5, color: '#E11D48', fontWeight: 700, fontFamily: 'system-ui' }}>
          ✏️ Você poderá editar todas as informações depois.
        </span>
      </div>

      {/* ── Calendar accent-color ── */}
      <style>{`
        .s1-input[type="date"],
        .s1-input[type="time"] {
          color-scheme: light;
          accent-color: #E11D48;
        }
        .s1-input::placeholder { color: #D1D5DB; }
        .s1-input[type="date"]::-webkit-calendar-picker-indicator,
        .s1-input[type="time"]::-webkit-calendar-picker-indicator {
          cursor: pointer;
          opacity: 0;
          position: absolute;
          right: 0; top: 0; bottom: 0;
          width: 36px;
        }
        .s1-date-wrapper { position: relative; width: 100%; display: flex; align-items: center; }
        .s1-date-icon {
          position: absolute; right: 0; top: 50%; transform: translateY(-50%);
          pointer-events: none; color: #9CA3AF; font-size: 15px;
          transition: color 0.15s;
        }
      `}</style>

      {/* ── Fields ── */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

        {/* Seu nome */}
        <FieldCard icon="💌" label="Seu nome" focused={isFoc('giver')}>
          <input
            className="s1-input"
            type="text"
            value={base.giverName}
            onChange={e => onChange({ giverName: e.target.value })}
            onFocus={() => focus('giver')}
            onBlur={blur}
            placeholder="Ex: Lucas"
            maxLength={40}
            style={inlineInput}
          />
        </FieldCard>

        {/* Nome de quem recebe */}
        <FieldCard icon="💛" label="Nome de quem vai receber" focused={isFoc('receiver')}>
          <input
            className="s1-input"
            type="text"
            value={base.receiverName}
            onChange={e => onChange({ receiverName: e.target.value })}
            onFocus={() => focus('receiver')}
            onBlur={blur}
            placeholder="Ex: Isabela"
            maxLength={40}
            style={inlineInput}
          />
        </FieldCard>

        {/* Data do relacionamento */}
        <FieldCard icon="📅" label="Desde quando estão juntos?" focused={isFoc('date')}>
          <div className="s1-date-wrapper">
            <input
              className="s1-input"
              type="date"
              value={base.startDate}
              onChange={e => onChange({ startDate: e.target.value })}
              onFocus={() => focus('date')}
              onBlur={blur}
              max={today}
              style={{ ...inlineInput, width: '100%' }}
            />
            <span className="s1-date-icon" style={{ color: isFoc('date') ? '#E11D48' : '#9CA3AF' }}>
              📅
            </span>
          </div>
        </FieldCard>

        {/* Horário */}
        <FieldCard
          icon="⏰"
          label="Horário (opcional)"
          focused={isFoc('time')}
          note="Torna o contador de tempo ainda mais preciso."
        >
          <div className="s1-date-wrapper">
            <input
              className="s1-input"
              type="time"
              value={base.startTime ?? '00:00'}
              onChange={e => onChange({ startTime: e.target.value })}
              onFocus={() => focus('time')}
              onBlur={blur}
              style={{ ...inlineInput, width: '100%' }}
            />
            <span className="s1-date-icon" style={{ color: isFoc('time') ? '#E11D48' : '#9CA3AF' }}>
              ⏰
            </span>
          </div>
        </FieldCard>

      </div>
    </div>
  );
}
