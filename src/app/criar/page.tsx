'use client';

import { useReducer, useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  INITIAL_FUNNEL, funnelReducer, STEPS, canAdvance,
  type StepId, type FunnelData,
} from './funnel';
import { LivePreview } from './LivePreview';

type PreviewProduct = 'spotify' | 'wordle' | 'roulette';
import { Step1Names }   from './steps/Step1Names';
import { Step2Music }   from './steps/Step2Music';
import { Step3Photos }  from './steps/Step3Photos';
import { Step4Message } from './steps/Step4Message';
import { Step5Reasons } from './steps/Step5Reasons';
import { Step6Extras }  from './steps/Step6Extras';

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
        const n     = i + 1;
        const done  = n < current;
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

// ─── Page ─────────────────────────────────────────────────────────────────────

const DRAFT_KEY = 'lv_funnel_draft';
const STEP_KEY  = 'lv_funnel_step';

export default function CriarPage() {
  const router = useRouter();
  // Always start with stable server-side defaults to avoid hydration mismatch.
  // localStorage is read in the first useEffect (client-only).
  const [step, setStep]             = useState<StepId>(1);
  const [state, dispatch]           = useReducer(funnelReducer, INITIAL_FUNNEL);
  const [ready, setReady]           = useState(false);
  const [previewProduct, setPreviewProduct] = useState<PreviewProduct>('spotify');

  // Hydrate from localStorage after mount
  useEffect(() => {
    try {
      const rawDraft = localStorage.getItem(DRAFT_KEY);
      const rawStep  = parseInt(localStorage.getItem(STEP_KEY) ?? '1');
      if (rawDraft) dispatch({ type: 'LOAD', payload: { ...INITIAL_FUNNEL, ...JSON.parse(rawDraft) } });
      if (rawStep >= 1 && rawStep <= 6) setStep(rawStep as StepId);
    } catch { /* keep defaults */ }
    setReady(true);
  }, []);

  // Persist on every change (only after hydration)
  useEffect(() => {
    if (!ready) return;
    try { localStorage.setItem(DRAFT_KEY, JSON.stringify(state)); } catch { /* storage full */ }
  }, [state, ready]);
  useEffect(() => { if (ready) localStorage.setItem(STEP_KEY, String(step)); }, [step, ready]);

  const handleToggleExtra = useCallback((key: 'wordle' | 'roulette') => {
    dispatch({ type: 'TOGGLE_EXTRA', payload: key });
    // auto-switch preview to the newly activated extra
    if (!state.extras.includes(key)) setPreviewProduct(key);
    else setPreviewProduct('spotify');
  }, [state.extras]);

  const ok       = canAdvance(step, state);
  const progress = ((step - 1) / (STEPS.length - 1)) * 100;
  const stepMeta = STEPS[step - 1];

  const advance = () => {
    if (!ok) return;
    if (step < STEPS.length) {
      setStep(s => (s + 1) as StepId);
    } else {
      router.push('/criar/upsell');
    }
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

      {/* ── Mobile preview strip (hidden on lg+) ─────────────── */}
      <div
        className="lg:hidden"
        style={{
          background: '#0D0D0D',
          backgroundImage: 'radial-gradient(ellipse at 50% 0%, rgba(225,29,72,0.12) 0%, transparent 60%)',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          flexShrink: 0,
        }}
      >
        {/* LIVE label */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7,
          padding: '14px 0 10px',
        }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 6,
            background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.2)',
            borderRadius: 20, padding: '3px 10px',
          }}>
            <div style={{ width: 5, height: 5, borderRadius: '50%', background: '#22C55E', boxShadow: '0 0 0 2px rgba(34,197,94,0.3)' }} />
            <span style={{ fontSize: 10, color: '#4ADE80', fontWeight: 800, letterSpacing: '0.1em', fontFamily: 'system-ui' }}>
              LIVE
            </span>
          </div>
          <span style={{ fontSize: 10, fontWeight: 700, color: 'rgba(255,255,255,0.3)', letterSpacing: '0.1em', textTransform: 'uppercase', fontFamily: 'system-ui' }}>
            Visualização ao vivo
          </span>
        </div>

        {/* Phone preview — clipped to 230px, fades out below */}
        <div style={{ position: 'relative', height: 230, overflow: 'hidden', display: 'flex', justifyContent: 'center' }}>
          <LivePreview
            base={state.base} spotify={state.spotify}
            width={190} scrollable={false}
            extras={state.extras} wordle={state.wordle} roulette={state.roulette}
            previewProduct={step === 6 ? previewProduct : 'spotify'}
            onPreviewChange={setPreviewProduct}
          />
          {/* Gradient fade at bottom */}
          <div style={{
            position: 'absolute', bottom: 0, left: 0, right: 0, height: 80,
            background: 'linear-gradient(to bottom, transparent, #0D0D0D)',
            zIndex: 30, pointerEvents: 'none',
          }} />
        </div>
      </div>

      {/* ── Body ──────────────────────────────────────────────── */}
      <div style={{ flex: 1, display: 'flex' }}>

        {/* Left: form */}
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
                {step === 2 && (
                  <Step2Music
                    spotify={state.spotify}
                    onChange={payload => dispatch({ type: 'PATCH_SPOTIFY', payload })}
                  />
                )}
                {step === 3 && (
                  <Step3Photos
                    spotify={state.spotify}
                    onChange={payload => dispatch({ type: 'PATCH_SPOTIFY', payload })}
                  />
                )}
                {step === 4 && (
                  <Step4Message
                    spotify={state.spotify}
                    onChange={payload => dispatch({ type: 'PATCH_SPOTIFY', payload })}
                  />
                )}
                {step === 5 && (
                  <Step5Reasons
                    spotify={state.spotify}
                    onChange={payload => dispatch({ type: 'PATCH_SPOTIFY', payload })}
                  />
                )}
                {step === 6 && (
                  <Step6Extras
                    wordle={state.wordle}
                    roulette={state.roulette}
                    extras={state.extras}
                    onToggle={handleToggleExtra}
                    onWordle={payload => dispatch({ type: 'PATCH_WORDLE', payload })}
                    onRoulette={payload => dispatch({ type: 'PATCH_ROULETTE', payload })}
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
                {step === STEPS.length ? 'Ver resumo e pagar →' : 'Próximo Passo →'}
              </button>
            </div>
          </div>
        </div>

        {/* Right: live preview — desktop only (lg+) */}
        <div
          className="hidden lg:flex"
          style={{
            width: 420, flexShrink: 0,
            flexDirection: 'column', alignItems: 'center',
            padding: '28px 28px 32px',
            background: '#0D0D0D',
            backgroundImage: 'radial-gradient(ellipse at 50% 0%, rgba(225,29,72,0.1) 0%, transparent 55%)',
            position: 'sticky', top: 57,
            height: 'calc(100dvh - 57px)',
            overflowY: 'auto',
          }}
        >
          {/* Top bar */}
          <div style={{
            width: '100%', display: 'flex',
            alignItems: 'center', justifyContent: 'space-between',
            marginBottom: 28,
          }}>
            <div>
              <span style={{
                fontSize: 10, fontWeight: 800, color: 'rgba(255,255,255,0.35)',
                letterSpacing: '0.14em', textTransform: 'uppercase',
                display: 'block', marginBottom: 3,
                fontFamily: 'system-ui',
              }}>
                Visualização ao vivo
              </span>
              <span style={{
                fontSize: 12, color: 'rgba(255,255,255,0.2)', fontWeight: 500,
                fontFamily: 'system-ui',
              }}>
                {stepMeta.title}
              </span>
            </div>
            <div style={{
              display: 'flex', alignItems: 'center', gap: 6,
              background: 'rgba(34,197,94,0.1)',
              border: '1px solid rgba(34,197,94,0.2)',
              borderRadius: 20, padding: '5px 12px',
            }}>
              <div style={{
                width: 5, height: 5, borderRadius: '50%', background: '#22C55E',
                boxShadow: '0 0 0 2px rgba(34,197,94,0.3)',
              }} />
              <span style={{ fontSize: 10, color: '#4ADE80', fontWeight: 800, letterSpacing: '0.1em', fontFamily: 'system-ui' }}>
                LIVE
              </span>
            </div>
          </div>

          <LivePreview
            base={state.base} spotify={state.spotify}
            extras={state.extras} wordle={state.wordle} roulette={state.roulette}
            previewProduct={step === 6 ? previewProduct : 'spotify'}
            onPreviewChange={setPreviewProduct}
          />
        </div>
      </div>
    </div>
  );
}
