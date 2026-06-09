'use client';

import type { GiftBase } from '@/lib/types';

interface Props {
  base:     GiftBase;
  onChange: (payload: Partial<GiftBase>) => void;
}

// ─── Shared input style ───────────────────────────────────────────────────────

const inputBase: React.CSSProperties = {
  width: '100%', boxSizing: 'border-box',
  padding: '14px 16px',
  border: '1.5px solid #E5E7EB',
  borderRadius: 12,
  fontSize: 15, fontWeight: 500, color: '#111827',
  background: '#fff',
  outline: 'none',
  fontFamily: 'system-ui, -apple-system, sans-serif',
  transition: 'border-color 0.15s, box-shadow 0.15s',
};

// ─── Field wrapper ────────────────────────────────────────────────────────────

function Field({ icon, label, children }: { icon: string; label: string; children: React.ReactNode }) {
  return (
    <div>
      <label style={{
        display: 'flex', alignItems: 'center', gap: 7,
        fontSize: 12, fontWeight: 700, color: '#6B7280',
        textTransform: 'uppercase', letterSpacing: '0.08em',
        marginBottom: 8,
      }}>
        <span>{icon}</span>
        {label}
      </label>
      {children}
    </div>
  );
}

// ─── Component ───────────────────────────────────────────────────────────────

export function Step1Names({ base, onChange }: Props) {
  const today = new Date().toISOString().slice(0, 10);

  return (
    <div>
      {/* Title */}
      <h1 style={{
        fontSize: 30, fontWeight: 800, color: '#111827',
        margin: '0 0 6px', letterSpacing: '-0.02em', lineHeight: 1.15,
        fontFamily: 'system-ui, -apple-system, sans-serif',
      }}>
        Nomes &amp; Data
      </h1>
      <p style={{ fontSize: 16, color: '#6B7280', margin: '0 0 22px', fontFamily: 'system-ui' }}>
        Quem são os apaixonados?
      </p>

      {/* "Editable later" hint */}
      <div style={{
        display: 'inline-flex', alignItems: 'center', gap: 6,
        background: '#FFF1F2', borderRadius: 20,
        padding: '6px 14px', marginBottom: 32,
      }}>
        <span style={{ fontSize: 13, color: '#E11D48', fontWeight: 600, fontFamily: 'system-ui' }}>
          ✏️ Você poderá editar todas as informações depois.
        </span>
      </div>

      {/* ── Global focus styles ── */}
      <style>{`
        .criar-input:focus {
          border-color: #E11D48 !important;
          box-shadow: 0 0 0 3px rgba(225,29,72,0.10);
        }
        .criar-input::placeholder { color: #C4C4C4; }
        .criar-input[type="date"]::-webkit-calendar-picker-indicator { opacity: 0.4; cursor: pointer; }
        .criar-input[type="time"]::-webkit-calendar-picker-indicator { opacity: 0.4; cursor: pointer; }
      `}</style>

      {/* ── Fields ── */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

        <Field icon="💌" label="Seu nome">
          <input
            className="criar-input"
            type="text"
            value={base.giverName}
            onChange={e => onChange({ giverName: e.target.value })}
            placeholder="Ex: Lucas"
            maxLength={40}
            style={inputBase}
          />
        </Field>

        <Field icon="💛" label="Nome de quem vai receber">
          <input
            className="criar-input"
            type="text"
            value={base.receiverName}
            onChange={e => onChange({ receiverName: e.target.value })}
            placeholder="Ex: Isabela"
            maxLength={40}
            style={inputBase}
          />
        </Field>

        <Field icon="📅" label="Desde quando estão juntos?">
          <input
            className="criar-input"
            type="date"
            value={base.startDate}
            onChange={e => onChange({ startDate: e.target.value })}
            max={today}
            style={inputBase}
          />
        </Field>

        <Field icon="⏰" label="Horário (opcional)">
          <input
            className="criar-input"
            type="time"
            value={base.startTime ?? '00:00'}
            onChange={e => onChange({ startTime: e.target.value })}
            style={inputBase}
          />
          <p style={{ fontSize: 12, color: '#9CA3AF', margin: '6px 0 0', fontFamily: 'system-ui' }}>
            Aparece no contador de tempo juntos.
          </p>
        </Field>

      </div>
    </div>
  );
}
