'use client';

import dynamic from 'next/dynamic';
import { useState } from 'react';
import { Pencil, Plus, X } from 'lucide-react';
import { DemoPageLayout } from '@/components/DemoPageLayout';
import type { RouletteData } from '@/lib/types';

const RouletteWheel = dynamic(
  () => import('@/components/products/roulette/RouletteWheel').then(mod => mod.RouletteWheel),
  {
    ssr: false,
    loading: () => (
      <div style={{ minHeight: 360, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.5)', fontFamily: 'system-ui', fontWeight: 700 }}>
        Carregando...
      </div>
    ),
  }
);

const DEMO: RouletteData = {
  title:   'O que a gente vai fazer hoje, meu amor? 💕',
  options: ['Jantar romântico', 'Cinema juntos', 'Netflix e pipoca', 'Passeio ao pôr do sol', 'Spa em casa', 'Surpresa do Lucas'],
};

const MAX_OPTIONS = 12;

export default function DemoRoulette() {
  const [data, setData]       = useState<RouletteData>(DEMO);
  const [editing, setEditing] = useState(false);
  const [input, setInput]     = useState('');

  const addOption = () => {
    const text = input.trim();
    if (!text || data.options.length >= MAX_OPTIONS) return;
    setData(d => ({ ...d, options: [...d.options, text] }));
    setInput('');
  };

  const removeOption = (idx: number) =>
    setData(d => ({ ...d, options: d.options.filter((_, i) => i !== idx) }));

  return (
    <DemoPageLayout bg="#0F172A">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14, padding: '0 0 32px' }}>
        <RouletteWheel data={data} />

        {/* ── Personalizar — o visitante prova que a roleta é dele ───────── */}
        <div style={{ padding: '0 16px', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
          <button
            onClick={() => setEditing(e => !e)}
            style={{
              width: '100%',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              padding: '13px 0', borderRadius: 14, cursor: 'pointer',
              background: editing ? 'rgba(225,29,72,0.14)' : 'rgba(255,255,255,0.06)',
              border: `1.5px solid ${editing ? 'rgba(225,29,72,0.45)' : 'rgba(255,255,255,0.12)'}`,
              color: editing ? '#FB7185' : 'rgba(255,255,255,0.75)',
              fontSize: 14, fontWeight: 800, letterSpacing: '-0.01em',
            }}
          >
            <Pencil size={14} strokeWidth={2.5} />
            {editing ? 'Fechar edição' : 'Personalizar com as suas opções'}
          </button>

          {editing && (
            <div style={{
              marginTop: 12,
              background: 'rgba(255,255,255,0.04)',
              border: '1.5px solid rgba(255,255,255,0.1)',
              borderRadius: 16, padding: 16,
              display: 'flex', flexDirection: 'column', gap: 12,
            }}>
              {/* Título */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <label style={{ fontSize: 11, fontWeight: 800, color: 'rgba(255,255,255,0.45)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                  Título da roleta
                </label>
                <input
                  value={data.title}
                  onChange={e => setData(d => ({ ...d, title: e.target.value }))}
                  placeholder="O que vamos fazer hoje?"
                  maxLength={50}
                  style={{
                    width: '100%', boxSizing: 'border-box',
                    background: 'rgba(0,0,0,0.3)', border: '1.5px solid rgba(255,255,255,0.12)',
                    borderRadius: 12, padding: '11px 14px',
                    color: '#fff', fontSize: 14, fontWeight: 600, fontFamily: 'inherit',
                    outline: 'none',
                  }}
                />
              </div>

              {/* Adicionar opção */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <label style={{ fontSize: 11, fontWeight: 800, color: 'rgba(255,255,255,0.45)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                  Opções · {data.options.length}/{MAX_OPTIONS}
                </label>
                <div style={{ display: 'flex', gap: 8 }}>
                  <input
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addOption(); } }}
                    placeholder="Ex: Café da manhã na cama…"
                    maxLength={50}
                    disabled={data.options.length >= MAX_OPTIONS}
                    style={{
                      flex: 1, minWidth: 0, boxSizing: 'border-box',
                      background: 'rgba(0,0,0,0.3)', border: '1.5px solid rgba(255,255,255,0.12)',
                      borderRadius: 12, padding: '11px 14px',
                      color: '#fff', fontSize: 14, fontWeight: 600, fontFamily: 'inherit',
                      outline: 'none',
                    }}
                  />
                  <button
                    onClick={addOption}
                    disabled={!input.trim() || data.options.length >= MAX_OPTIONS}
                    style={{
                      width: 46, borderRadius: 12, border: 'none', flexShrink: 0,
                      background: (!input.trim() || data.options.length >= MAX_OPTIONS) ? 'rgba(255,255,255,0.08)' : '#E11D48',
                      color: (!input.trim() || data.options.length >= MAX_OPTIONS) ? 'rgba(255,255,255,0.3)' : '#fff',
                      cursor: (!input.trim() || data.options.length >= MAX_OPTIONS) ? 'not-allowed' : 'pointer',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}
                  >
                    <Plus size={18} />
                  </button>
                </div>
              </div>

              {/* Lista de opções */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {data.options.map((opt, i) => (
                  <div key={`${opt}-${i}`} style={{
                    display: 'flex', alignItems: 'center', gap: 10,
                    background: 'rgba(0,0,0,0.25)', border: '1.5px solid rgba(255,255,255,0.07)',
                    borderRadius: 10, padding: '9px 12px',
                  }}>
                    <span style={{
                      width: 22, height: 22, borderRadius: '50%', flexShrink: 0,
                      background: 'rgba(225,29,72,0.15)', border: '1.5px solid rgba(225,29,72,0.3)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 11, fontWeight: 800, color: '#FB7185',
                    }}>
                      {i + 1}
                    </span>
                    <span style={{ flex: 1, fontSize: 14, fontWeight: 600, color: 'rgba(255,255,255,0.85)', wordBreak: 'break-word' }}>
                      {opt}
                    </span>
                    <button
                      onClick={() => removeOption(i)}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 2, color: 'rgba(255,255,255,0.4)', flexShrink: 0 }}
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>

              <p style={{ margin: 0, fontSize: 11.5, color: 'rgba(255,255,255,0.35)' }}>
                Mínimo 2 opções para girar. No presente de verdade, você escolhe tudo isso no momento de criar.
              </p>
            </div>
          )}
        </div>
      </div>
    </DemoPageLayout>
  );
}
