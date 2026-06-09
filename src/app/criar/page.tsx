'use client';

import { useReducer, useState } from 'react';
import Link from 'next/link';
import {
  INITIAL_FUNNEL, funnelReducer, STEPS, canAdvance,
  type StepId,
} from './funnel';
import { LivePreview } from './LivePreview';
import { Step1Names } from './steps/Step1Names';

// ─── Stepper ──────────────────────────────────────────────────────────────────

function Stepper({
  current, total, onGoto,
}: {
  current: number;
  total:   number;
  onGoto:  (n: number) => void;
}) {
  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      {Array.from({ length: total }, (_, i) => {
        const n    = i + 1;
        const done = n < current;
        const active = n === current;
        return (
          <div key={n} style={{ display: 'flex', alignItems: 'center', flex: i < total - 1 ? 1 : 'none' }}>
            <button
              onClick={() => done && onGoto(n)}
              style={{
                width: 36, height: 36, borderRadius: '50%', flexShrink: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontWeight: 800, fontSize: 14, border: 'none',
                background: done || active ? '#E11D48' : '#F3F4F6',
                color: done || active ? '#fff' : '#9CA3AF',
                outline: active ? '3px solid rgba(225,29,72,0.2)' : 'none',
                outlineOffset: 2,
                cursor: done ? 'pointer' : 'default',
                transition: 'all 0.25s',
                fontFamily: 'system-ui',
              }}
            >
              {done ? '✓' : n}
            </button>
            {i < total - 1 && (
              <div style={{
                flex: 1, height: 2, minWidth: 8,
                background: done ? '#E11D48' : '#F3F4F6',
                transition: 'background 0.3s',
              }} />
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─── Step placeholder (steps 2–6, to be built in parts 4–7) ──────────────────

function StepPlaceholder({ title, description }: { title: string; description: string }) {
  return (
    <div>
      <h1 style={{
        fontSize: 30, fontWeight: 800, color: '#111827',
        margin: '0 0 6px', letterSpacing: '-0.02em', lineHeight: 1.15,
        fontFamily: 'system-ui',
      }}>
        {title}
      </h1>
      <p style={{ fontSize: 16, color: '#6B7280', margin: '0 0 32px', fontFamily: 'system-ui' }}>
        {description}
      </p>
      <div style={{
        padding: '36px 28px', borderRadius: 16,
        background: '#FAFAFA', border: '2px dashed #E5E7EB',
        textAlign: 'center',
      }}>
        <p style={{ fontSize: 28, margin: '0 0 12px' }}>🚧</p>
        <p style={{ fontSize: 14, color: '#9CA3AF', fontWeight: 600, margin: 0, fontFamily: 'system-ui' }}>
          Esta etapa será habilitada em breve.
        </p>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function CriarPage() {
  const [step, setStep]   = useState<StepId>(1);
  const [state, dispatch] = useReducer(funnelReducer, INITIAL_FUNNEL);

  const ok       = canAdvance(step, state);
  const progress = ((step - 1) / (STEPS.length - 1)) * 100;
  const stepMeta = STEPS[step - 1];

  const advance = () => {
    if (ok && step < STEPS.length) setStep(s => (s + 1) as StepId);
  };
  const back = () => {
    if (step > 1) setStep(s => (s - 1) as StepId);
  };

  return (
    <div style={{
      minHeight: '100dvh', background: '#F7F8FA',
      display: 'flex', flexDirection: 'column',
      fontFamily: 'system-ui, -apple-system, sans-serif',
    }}>

      {/* ── Header ────────────────────────────────────────────── */}
      <header style={{
        height: 57, flexShrink: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 28px',
        background: '#fff', borderBottom: '1px solid #EBEBEB',
        position: 'sticky', top: 0, zIndex: 50,
      }}>
        <Link href="/" style={{ textDecoration: 'none' }}>
          <span style={{ fontSize: 17, fontWeight: 900, color: '#111', letterSpacing: '-0.01em' }}>
            Love<span style={{ color: '#E11D48' }}>Valentine</span>
          </span>
        </Link>

        {/* Progress bar */}
        <div style={{ flex: 1, maxWidth: 360, margin: '0 32px', height: 4, background: '#F3F4F6', borderRadius: 2, overflow: 'hidden' }}>
          <div style={{
            height: '100%', background: '#E11D48', borderRadius: 2,
            width: `${progress}%`,
            transition: 'width 0.4s cubic-bezier(0.4,0,0.2,1)',
          }} />
        </div>

        <span style={{ fontSize: 12, color: '#9CA3AF', fontWeight: 700, whiteSpace: 'nowrap' }}>
          {step} de {STEPS.length}
        </span>
      </header>

      {/* ── Body ──────────────────────────────────────────────── */}
      <div style={{ flex: 1, display: 'flex' }}>

        {/* Left: form (full width on mobile, ~60% on desktop) */}
        <div style={{
          flex: 1, minWidth: 0,
          background: '#fff',
          borderRight: '1px solid #EBEBEB',
          display: 'grid',
          gridTemplateRows: '1fr auto',
          minHeight: 'calc(100dvh - 57px)',
        }}>
          {/* Scrollable form content */}
          <div style={{ overflowY: 'auto', padding: '40px 0 24px', display: 'flex', justifyContent: 'center' }}>
            <div style={{ width: '100%', maxWidth: 520, padding: '0 40px' }}>

              <Stepper current={step} total={STEPS.length} onGoto={n => setStep(n as StepId)} />

              <div style={{ marginTop: 44 }}>
                {step === 1 && (
                  <Step1Names
                    base={state.base}
                    onChange={payload => dispatch({ type: 'PATCH_BASE', payload })}
                  />
                )}
                {step > 1 && (
                  <StepPlaceholder
                    title={stepMeta.title}
                    description={stepMeta.description}
                  />
                )}
              </div>

            </div>
          </div>

          {/* Nav buttons */}
          <div style={{
            borderTop: '1px solid #F3F4F6',
            padding: '20px 0 32px',
            display: 'flex', justifyContent: 'center',
          }}>
            <div style={{ width: '100%', maxWidth: 520, padding: '0 40px', display: 'flex', gap: 12 }}>
              {step > 1 && (
                <button
                  onClick={back}
                  style={{
                    flex: 1, padding: '16px 0', borderRadius: 14,
                    background: '#fff', border: '2px solid #E5E7EB', color: '#374151',
                    fontSize: 15, fontWeight: 700, cursor: 'pointer',
                    fontFamily: 'system-ui', letterSpacing: '-0.01em',
                  }}
                >
                  ← Voltar
                </button>
              )}
              <button
                onClick={advance}
                disabled={!ok}
                style={{
                  flex: 2, padding: '16px 0', borderRadius: 14, border: 'none',
                  background: ok ? '#E11D48' : '#F3F4F6',
                  color: ok ? '#fff' : '#9CA3AF',
                  fontSize: 15, fontWeight: 800,
                  cursor: ok ? 'pointer' : 'not-allowed',
                  fontFamily: 'system-ui', letterSpacing: '-0.01em',
                  transition: 'background 0.2s, color 0.2s',
                }}
              >
                {step === STEPS.length ? 'Concluir →' : 'Próximo Passo →'}
              </button>
            </div>
          </div>
        </div>

        {/* Right: live preview — hidden on mobile, visible lg+ */}
        <div
          className="hidden lg:flex"
          style={{
            width: 420, flexShrink: 0,
            flexDirection: 'column', alignItems: 'center',
            padding: '32px 28px 32px',
            background: '#111111',
            position: 'sticky', top: 57,
            height: 'calc(100dvh - 57px)',
            overflowY: 'auto',
          }}
        >
          {/* Label */}
          <div style={{
            width: '100%', display: 'flex',
            alignItems: 'center', justifyContent: 'space-between',
            marginBottom: 24,
          }}>
            <span style={{
              fontSize: 10, fontWeight: 800, color: 'rgba(255,255,255,0.4)',
              letterSpacing: '0.14em', textTransform: 'uppercase',
            }}>
              Visualização ao vivo
            </span>
            <div style={{
              width: 6, height: 6, borderRadius: '50%', background: '#22C55E',
              boxShadow: '0 0 0 3px rgba(34,197,94,0.2)',
            }} />
          </div>

          <LivePreview base={state.base} spotify={state.spotify} />
        </div>
      </div>
    </div>
  );
}
