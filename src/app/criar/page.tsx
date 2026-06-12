'use client';

import { useReducer, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Pencil, Eye } from 'lucide-react';
import {
  INITIAL_FUNNEL, funnelReducer, STEPS, canAdvance,
  type StepId,
} from './funnel';
import { LivePreview } from './LivePreview';

type MobileView = 'edit' | 'preview';
import { Step1Names }   from './steps/Step1Names';
import { Step2Music }   from './steps/Step2Music';
import { Step3Photos }  from './steps/Step3Photos';
import { Step4Message } from './steps/Step4Message';
import { Step5Reasons } from './steps/Step5Reasons';

// ─── Mobile view switcher ─────────────────────────────────────────────────────

function MobileViewSwitcher({ active, onChange }: { active: MobileView; onChange: (v: MobileView) => void }) {
  const tabs: { key: MobileView; label: string; icon: React.ReactNode }[] = [
    { key: 'edit',    label: 'Edição',        icon: <Pencil size={13} strokeWidth={2.5} /> },
    { key: 'preview', label: 'Visualização',  icon: <Eye    size={13} strokeWidth={2.5} /> },
  ];
  return (
    <div style={{
      display: 'flex',
      background: 'rgba(255,255,255,0.07)',
      border: '1px solid rgba(255,255,255,0.13)',
      borderRadius: 13, padding: 3, gap: 3,
      width: '100%', maxWidth: 300,
    }}>
      {tabs.map(t => {
        const isActive = active === t.key;
        return (
          <button
            key={t.key}
            onClick={() => onChange(t.key)}
            style={{
              flex: 1, display: 'flex', alignItems: 'center',
              justifyContent: 'center', gap: 6,
              padding: '10px 12px', borderRadius: 10, border: 'none',
              background: isActive ? '#E11D48' : 'transparent',
              boxShadow: isActive
                ? '0 2px 10px rgba(225,29,72,0.45), inset 0 1px 0 rgba(255,255,255,0.12)'
                : 'none',
              color: isActive ? '#fff' : 'rgba(255,255,255,0.4)',
              fontSize: 13, fontWeight: isActive ? 700 : 500,
              cursor: 'pointer', fontFamily: 'system-ui',
              letterSpacing: isActive ? '-0.01em' : '0',
              transition: 'all 0.18s ease',
            }}
          >
            <span style={{ display: 'flex', alignItems: 'center', opacity: isActive ? 1 : 0.7 }}>
              {t.icon}
            </span>
            <span>{t.label}</span>
          </button>
        );
      })}
    </div>
  );
}

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
  const [mobileView, setMobileView] = useState<MobileView>('edit');

  // Hydrate from localStorage after mount
  useEffect(() => {
    try {
      const rawDraft = localStorage.getItem(DRAFT_KEY);
      const rawStep  = parseInt(localStorage.getItem(STEP_KEY) ?? '1');
      if (rawDraft) dispatch({ type: 'LOAD', payload: { ...INITIAL_FUNNEL, ...JSON.parse(rawDraft) } });
      if (rawStep >= 1 && rawStep <= 5) setStep(rawStep as StepId);
    } catch { /* keep defaults */ }
    setReady(true);
  }, []);

  // Persist on every change (only after hydration)
  useEffect(() => {
    if (!ready) return;
    try { localStorage.setItem(DRAFT_KEY, JSON.stringify(state)); } catch { /* storage full */ }
  }, [state, ready]);
  useEffect(() => { if (ready) localStorage.setItem(STEP_KEY, String(step)); }, [step, ready]);

  const ok       = canAdvance(step, state);
  const progress = ((step - 1) / 7) * 100;
  const stepMeta = STEPS[step - 1];

  const advance = () => {
    if (!ok) return;
    if (step < STEPS.length) {
      setStep(s => (s + 1) as StepId);
    } else {
      router.push('/criar/upsell/wordle');
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
      height: mobileView === 'preview' ? '100dvh' : undefined,
      overflow: mobileView === 'preview' ? 'hidden' : undefined,
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
          {step} de 8
        </span>
      </header>

      {/* ── Mobile: tab switcher (hidden on lg+) ────────────────── */}
      <div
        className="lg:hidden flex items-center justify-center"
        style={{
          position: 'sticky', top: 57, zIndex: 40,
          background: '#0D0D0D',
          backgroundImage: 'radial-gradient(ellipse at 50% 60%, rgba(225,29,72,0.1) 0%, transparent 70%)',
          borderBottom: '1px solid rgba(255,255,255,0.07)',
          padding: '10px 20px',
        }}
      >
        <MobileViewSwitcher active={mobileView} onChange={setMobileView} />
      </div>

      {/* ── Body ──────────────────────────────────────────────── */}
      <div style={{
        flex: 1, display: 'flex', minHeight: 0,
        background: mobileView === 'preview' ? '#0D0D0D' : undefined,
      }}>

        {/* Left: form — collapses to 0 on mobile when preview is active */}
        <div
          style={{
            flex: mobileView === 'preview' ? '0 0 0px' : 1,
            minWidth: 0,
            overflow: 'hidden',
            background: mobileView === 'preview' ? 'transparent' : '#fff',
            borderRight: mobileView === 'preview' ? 'none' : '1px solid #EBEBEB',
            display: 'grid',
            gridTemplateRows: '1fr auto',
          }}
        >
          {/* Scrollable form content */}
          <div style={{ overflowY: 'auto', padding: '32px 0 24px', display: 'flex', justifyContent: 'center' }}>
            <div style={{ width: '100%', maxWidth: 520, padding: '0 24px' }}>

              <div className="hidden lg:block">
                <Stepper current={step} total={8} onGoto={n => setStep(n as StepId)} />
                <div style={{ marginBottom: 44 }} />
              </div>

              <div>
                {step === 1 && (
                  <Step1Names
                    base={state.base}
                    buyerEmail={state.buyerEmail}
                    onChange={payload => dispatch({ type: 'PATCH_BASE', payload })}
                    onEmailChange={payload => dispatch({ type: 'PATCH_BUYER_EMAIL', payload })}
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
              </div>

            </div>
          </div>

          {/* Nav buttons */}
          <div style={{
            borderTop: '1px solid #F3F4F6',
            padding: '14px 0 24px',
            display: 'flex', justifyContent: 'center',
            background: '#fff',
          }}>
            <div style={{ width: '100%', maxWidth: 520, padding: '0 24px', display: 'flex', gap: 10 }}>
              {step > 1 && (
                <button
                  onClick={back}
                  style={{
                    flex: 1, padding: '15px 0', borderRadius: 14,
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
                  flex: 2, padding: '15px 0', borderRadius: 14, border: 'none',
                  background: ok ? '#E11D48' : '#F3F4F6',
                  color: ok ? '#fff' : '#9CA3AF',
                  fontSize: 15, fontWeight: 800,
                  cursor: ok ? 'pointer' : 'not-allowed',
                  fontFamily: 'system-ui', letterSpacing: '-0.01em',
                  transition: 'background 0.2s, color 0.2s',
                }}
              >
                {step === STEPS.length ? 'Ver resumo e pagar →' : 'Próximo →'}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile preview — in-flow, takes flex:1 when active */}
        <div
          style={{
            flex: mobileView === 'preview' ? 1 : 0,
            minWidth: 0,
            overflow: 'hidden',
            background: 'transparent',
            backgroundImage: mobileView === 'preview'
              ? 'radial-gradient(ellipse at 50% 20%, rgba(225,29,72,0.1) 0%, transparent 60%)'
              : 'none',
            display: mobileView === 'preview' ? 'flex' : 'none',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: mobileView === 'preview' ? '20px 16px' : 0,
          }}
        >
          {mobileView === 'preview' && (
            <LivePreview
              base={state.base} spotify={state.spotify}
              extras={state.extras} wordle={state.wordle} roulette={state.roulette}
              previewProduct="spotify"
              onPreviewChange={() => {}}
            />
          )}
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
            previewProduct="spotify"
            onPreviewChange={() => {}}
          />
        </div>

      </div>
    </div>
  );
}
