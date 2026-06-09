'use client';

import { useState } from 'react';
import type { GiftBase } from '@/lib/types';

interface Props {
  base:     GiftBase;
  onChange: (payload: Partial<GiftBase>) => void;
}

// ─── FieldCard ────────────────────────────────────────────────────────────────

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
      }}>
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
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            fontSize: 10, fontWeight: 800, color: focused ? '#E11D48' : '#9CA3AF',
            textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 4,
            transition: 'color 0.15s', fontFamily: 'system-ui',
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

// ─── Date select (3 dropdowns, no native popup) ───────────────────────────────

const MONTHS = [
  'Janeiro','Fevereiro','Março','Abril','Maio','Junho',
  'Julho','Agosto','Setembro','Outubro','Novembro','Dezembro',
];

const selectStyle: React.CSSProperties = {
  border: 'none', outline: 'none', background: 'transparent',
  fontSize: 15, fontWeight: 600, color: '#111827', padding: 0,
  fontFamily: 'system-ui, -apple-system, sans-serif',
  appearance: 'none', cursor: 'pointer', minWidth: 0,
};

function DateSelect({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const maxYear = new Date().getFullYear();

  // Local state so each select is independently selectable before all 3 are filled
  const init = value ? value.split('-') : ['', '', ''];
  const [y, setY] = useState(init[0] || '');
  const [m, setM] = useState(init[1] ? String(parseInt(init[1])) : '');
  const [d, setD] = useState(init[2] ? String(parseInt(init[2])) : '');

  const daysInMonth = (y && m)
    ? new Date(parseInt(y), parseInt(m), 0).getDate()
    : 31;

  const notify = (ny: string, nm: string, nd: string) => {
    if (ny && nm && nd)
      onChange(`${ny}-${nm.padStart(2, '0')}-${nd.padStart(2, '0')}`);
  };

  const handleY = (v: string) => { setY(v); notify(v, m, d); };
  const handleM = (v: string) => {
    // Clamp day if new month has fewer days
    const maxD = new Date(parseInt(y) || 2000, parseInt(v), 0).getDate();
    const clampedD = d && parseInt(d) > maxD ? '' : d;
    setM(v); if (clampedD !== d) setD(clampedD);
    notify(y, v, clampedD);
  };
  const handleD = (v: string) => { setD(v); notify(y, m, v); };

  const years = Array.from({ length: maxYear - 1940 + 1 }, (_, i) => maxYear - i);
  const sep   = <span style={{ color: '#D1D5DB', fontWeight: 700, flexShrink: 0 }}>/</span>;

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 4, width: '100%', overflow: 'hidden' }}>
      <select value={d} onChange={e => handleD(e.target.value)} style={{ ...selectStyle, flex: '0 0 auto' }}>
        <option value="">Dia</option>
        {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(n => (
          <option key={n} value={String(n)}>{n}</option>
        ))}
      </select>
      {sep}
      <select value={m} onChange={e => handleM(e.target.value)} style={{ ...selectStyle, flex: '1 1 0', minWidth: 0 }}>
        <option value="">Mês</option>
        {MONTHS.map((name, i) => (
          <option key={i + 1} value={String(i + 1)}>{name}</option>
        ))}
      </select>
      {sep}
      <select value={y} onChange={e => handleY(e.target.value)} style={{ ...selectStyle, flex: '0 0 auto' }}>
        <option value="">Ano</option>
        {years.map(yr => <option key={yr} value={String(yr)}>{yr}</option>)}
      </select>
    </div>
  );
}

// ─── Component ───────────────────────────────────────────────────────────────

export function Step1Names({ base, onChange }: Props) {
  const [focused, setFocused] = useState<string | null>(null);

  const focus = (id: string) => setFocused(id);
  const blur  = () => setFocused(null);
  const isFoc = (id: string) => focused === id;

  return (
    <div>
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

      <div style={{
        display: 'inline-flex', alignItems: 'center', gap: 6,
        background: '#FFF1F2', border: '1px solid rgba(225,29,72,0.15)',
        borderRadius: 20, padding: '6px 14px', marginBottom: 32,
      }}>
        <span style={{ fontSize: 12.5, color: '#E11D48', fontWeight: 700, fontFamily: 'system-ui' }}>
          ✏️ Você poderá editar todas as informações depois.
        </span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

        {/* Seu nome */}
        <FieldCard icon="💌" label="Seu nome" focused={isFoc('giver')}>
          <input
            style={inlineInput}
            type="text"
            value={base.giverName}
            placeholder="Ex: Lucas"
            maxLength={40}
            onFocus={() => focus('giver')}
            onBlur={blur}
            onChange={e => onChange({ giverName: e.target.value })}
          />
        </FieldCard>

        {/* Nome de quem recebe */}
        <FieldCard icon="💛" label="Nome de quem vai receber" focused={isFoc('receiver')}>
          <input
            style={inlineInput}
            type="text"
            value={base.receiverName}
            placeholder="Ex: Isabela"
            maxLength={40}
            onFocus={() => focus('receiver')}
            onBlur={blur}
            onChange={e => onChange({ receiverName: e.target.value })}
          />
        </FieldCard>

        {/* Data */}
        <FieldCard icon="📅" label="Desde quando estão juntos?" focused={isFoc('date')}>
          <div
            onFocus={() => focus('date')}
            onBlur={e => { if (!e.currentTarget.contains(e.relatedTarget)) blur(); }}
          >
            <DateSelect value={base.startDate} onChange={v => onChange({ startDate: v })} />
          </div>
        </FieldCard>

        {/* Horário */}
        <FieldCard
          icon="⏰"
          label="Horário (opcional)"
          focused={isFoc('time')}
          note="Torna o contador de tempo ainda mais preciso."
        >
          <input
            style={inlineInput}
            type="time"
            value={base.startTime ?? '00:00'}
            onFocus={() => focus('time')}
            onBlur={blur}
            onChange={e => onChange({ startTime: e.target.value })}
          />
        </FieldCard>

      </div>
    </div>
  );
}
