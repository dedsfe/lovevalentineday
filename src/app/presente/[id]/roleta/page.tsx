'use client';

import { useEffect, useRef, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import confetti from 'canvas-confetti';
import { fetchGift } from '@/lib/gift-store';
import { MiniPlayer } from '../MiniPlayer';

const HEART_PATH = 'M0.5 0.84 C0.18 0.63 0 0.48 0 0.3 A0.25 0.25 0 0 1 0.5 0.16 A0.25 0.25 0 0 1 1 0.3 C1 0.48 0.82 0.63 0.5 0.84Z';

function burst(el: HTMLElement | null) {
  try {
    const rect   = el?.getBoundingClientRect();
    const clamp  = (v: number) => Math.max(0.05, Math.min(0.95, v));
    const x = rect ? clamp((rect.left + rect.width / 2) / window.innerWidth)  : 0.5;
    const y = rect ? clamp((rect.top  + rect.height * 0.35) / window.innerHeight) : 0.5;
    const origin = { x, y };
    const colors = ['#E11D48','#F43F5E','#FB7185','#FF6B9D','#FDE68A','#A78BFA','#60A5FA'];

    let heart: confetti.Shape | undefined;
    try { heart = confetti.shapeFromPath({ path: HEART_PATH }); } catch { /* fallback to circles */ }

    const shapes = heart ? [heart] : undefined;

    confetti({ shapes, colors: ['#E11D48','#F43F5E','#FB7185'], particleCount: 50, spread: 90, origin, startVelocity: 50, gravity: 0.7, ticks: 220, scalar: 1.2 });
    setTimeout(() => confetti({ particleCount: 100, spread: 70, origin, startVelocity: 60, colors, ticks: 260 }), 200);
    setTimeout(() => confetti({ shapes, colors, particleCount: 40, spread: 140, origin, startVelocity: 22, decay: 0.93, ticks: 320, scalar: 0.9 }), 420);
  } catch { /* noop */ }
}

// ─── Palette ──────────────────────────────────────────────────────────────────

const COLORS = [
  '#E11D48','#7C3AED','#2563EB','#059669',
  '#D97706','#DB2777','#0891B2','#65A30D',
  '#9333EA','#B45309','#DC2626','#0284C7',
];

// ─── Wheel SVG ────────────────────────────────────────────────────────────────

function Wheel({ options, rotation }: { options: string[]; rotation: number }) {
  const n   = options.length;
  const cx  = 160;
  const cy  = 160;
  const r   = 150;
  const sa  = 360 / n; // sector angle degrees

  const toRad = (deg: number) => ((deg - 90) * Math.PI) / 180;

  const sectors = options.map((label, i) => {
    const start = i * sa;
    const end   = start + sa;
    const x1    = cx + r * Math.cos(toRad(start));
    const y1    = cy + r * Math.sin(toRad(start));
    const x2    = cx + r * Math.cos(toRad(end));
    const y2    = cy + r * Math.sin(toRad(end));
    const large = sa > 180 ? 1 : 0;
    const mid   = start + sa / 2;
    const tr    = r * 0.62;
    const tx    = cx + tr * Math.cos(toRad(mid));
    const ty    = cy + tr * Math.sin(toRad(mid));
    const d     = `M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2} Z`;
    return { d, label, tx, ty, mid, color: COLORS[i % COLORS.length] };
  });

  return (
    <svg
      width={320} height={320}
      style={{ display: 'block', transform: `rotate(${rotation}deg)`, willChange: 'transform' }}
    >
      {sectors.map((s, i) => (
        <g key={i}>
          <path d={s.d} fill={s.color} stroke="#0A0A0A" strokeWidth={2} />
          <text
            x={s.tx} y={s.ty}
            textAnchor="middle" dominantBaseline="middle"
            transform={`rotate(${s.mid}, ${s.tx}, ${s.ty})`}
            fill="#fff" fontWeight="700"
            fontSize={Math.max(9, Math.min(13, 120 / options.length))}
            fontFamily="system-ui"
            style={{ userSelect: 'none', pointerEvents: 'none' }}
          >
            {s.label.length > 10 ? s.label.slice(0, 9) + '…' : s.label}
          </text>
        </g>
      ))}
      {/* Center cap */}
      <circle cx={cx} cy={cy} r={18} fill="#0A0A0A" stroke="rgba(255,255,255,0.15)" strokeWidth={2} />
    </svg>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function RoletaPage() {
  const { id } = useParams<{ id: string }>();

  const [options,    setOptions]    = useState<string[]>([]);
  const [title,      setTitle]      = useState('Roleta Surpresa');
  const [notFound,   setNotFound]   = useState(false);
  const [pendingPay, setPendingPay] = useState(false);
  const [hasWordle,  setHasWordle]  = useState(false);

  const [rotation, setRotation] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [winner,   setWinner]   = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const wheelRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    // fetchGift (API) e não loadGift: o destinatário abre em outro aparelho,
    // onde o localStorage nunca viu este presente.
    let cancelled = false;
    fetchGift(id).then(gift => {
      if (cancelled) return;
      // Pendente: a API não devolve o funnel — é "aguardando pagamento", não "não existe"
      if (gift?.status === 'pending') { setPendingPay(true); return; }
      if (!gift || gift.funnel.roulette.options.length < 2) { setNotFound(true); return; }
      setOptions(gift.funnel.roulette.options);
      setTitle(gift.funnel.roulette.title || 'Roleta Surpresa');
      setHasWordle(
        gift.funnel.extras.includes('wordle') &&
        gift.funnel.wordle.word.length >= 3
      );
    });
    return () => { cancelled = true; };
  }, [id]);

  const spin = () => {
    if (spinning || options.length < 2) return;

    setSpinning(true);
    setWinner(null);

    const n           = options.length;
    const sectorAngle = 360 / n;
    const winnerIdx   = Math.floor(Math.random() * n);

    // Target rotation: many full spins + lands winner sector under pointer (top)
    // Pointer is at top (0°). Wheel starts with sector 0 at top.
    // After rotating R°, the sector at R° (mod 360) from start is under pointer.
    // We want sector winnerIdx → winnerIdx * sectorAngle + sectorAngle/2 === R (mod 360)
    const winnerCenter = winnerIdx * sectorAngle + sectorAngle / 2;
    const BASE_SPINS   = 8;
    const current360   = rotation % 360;
    const needed       = (winnerCenter - current360 + 360) % 360;
    const target       = rotation + BASE_SPINS * 360 + needed;

    setRotation(target);

    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      setSpinning(false);
      setWinner(options[winnerIdx]);
      burst(containerRef.current);
    }, 5200);
  };

  if (notFound || pendingPay) {
    return (
      <div style={{ minHeight: '100dvh', background: '#0A0A0A', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontFamily: 'system-ui', padding: '0 24px' }}>
        <p style={{ fontSize: 48, margin: '0 0 12px' }}>{pendingPay ? '⏳' : '🎡'}</p>
        <p style={{ fontSize: 18, fontWeight: 700, color: '#fff', margin: '0 0 24px', textAlign: 'center' }}>
          {pendingPay ? 'Liberando após a confirmação do pagamento' : 'Roleta não encontrada'}
        </p>
        <Link href={`/presente/${id}`} style={{ color: '#E11D48', fontWeight: 700, fontSize: 14, textDecoration: 'none' }}>← Voltar ao presente</Link>
      </div>
    );
  }

  if (options.length === 0) {
    return (
      <div style={{ minHeight: '100dvh', background: '#0A0A0A', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: 32, height: 32, borderRadius: '50%', border: '3px solid rgba(255,255,255,0.1)', borderTopColor: '#E11D48', animation: 'spin 0.8s linear infinite' }} />
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      </div>
    );
  }

  const otherProducts = hasWordle
    ? [{ href: `/presente/${id}/wordle`, label: 'Wordle do Amor', icon: '🟩' }]
    : [];

  return (
    <div ref={containerRef} style={{ minHeight: '100dvh', background: '#0A0A0A', fontFamily: 'system-ui', display: 'flex', flexDirection: 'column', alignItems: 'center', paddingBottom: 80 }}>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}} @keyframes pop{0%{transform:scale(0.8)}60%{transform:scale(1.06)}100%{transform:scale(1)}}`}</style>

      {/* Header */}
      <div style={{ width: '100%', maxWidth: 400, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 24px 0', boxSizing: 'border-box' }}>
        <Link href={`/presente/${id}`} style={{ fontSize: 13, fontWeight: 700, color: 'rgba(255,255,255,0.4)', textDecoration: 'none' }}>← Presente</Link>
        <span style={{ fontSize: 15, fontWeight: 900, color: '#fff', letterSpacing: '-0.01em' }}>{title}</span>
        <span style={{ width: 60 }} />
      </div>

      {/* Pointer */}
      <div style={{ marginTop: 32, position: 'relative', width: 320, height: 320 }}>
        {/* Triangle pointer at top */}
        <div style={{
          position: 'absolute', top: -10, left: '50%', transform: 'translateX(-50%)',
          width: 0, height: 0, zIndex: 10,
          borderLeft: '10px solid transparent',
          borderRight: '10px solid transparent',
          borderTop: '20px solid #fff',
          filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.5))',
        }} />

        {/* Wheel container with CSS transition */}
        <div
          ref={wheelRef}
          style={{
            width: 320, height: 320, borderRadius: '50%',
            boxShadow: '0 0 0 3px rgba(255,255,255,0.08), 0 8px 40px rgba(0,0,0,0.5)',
            transition: spinning ? 'transform 5s cubic-bezier(0.17,0.67,0.12,0.99)' : 'none',
            transform: `rotate(${rotation}deg)`,
            willChange: 'transform',
            overflow: 'hidden',
          }}
        >
          <Wheel options={options} rotation={0} />
        </div>
      </div>

      {/* Winner */}
      {winner && (
        <div style={{
          marginTop: 28, padding: '18px 28px', borderRadius: 18,
          background: 'rgba(225,29,72,0.12)', border: '1.5px solid rgba(225,29,72,0.3)',
          textAlign: 'center', animation: 'pop 0.4s ease',
          maxWidth: 340, width: 'calc(100% - 48px)', boxSizing: 'border-box',
        }}>
          <p style={{ fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,0.35)', letterSpacing: '0.1em', textTransform: 'uppercase', margin: '0 0 6px' }}>Resultado</p>
          <p style={{ fontSize: 24, fontWeight: 900, color: '#fff', margin: 0, lineHeight: 1.2 }}>{winner}</p>
        </div>
      )}

      <MiniPlayer
        presenteHref={`/presente/${id}`}
        otherProducts={otherProducts}
      />

      {/* Spin button */}
      <div style={{ marginTop: winner ? 20 : 36, marginBottom: 48 }}>
        <button
          onClick={spin}
          disabled={spinning}
          style={{
            padding: '18px 52px', borderRadius: 18, border: 'none',
            background: spinning ? 'rgba(255,255,255,0.06)' : '#E11D48',
            color: spinning ? 'rgba(255,255,255,0.3)' : '#fff',
            fontSize: 17, fontWeight: 800, cursor: spinning ? 'default' : 'pointer',
            fontFamily: 'system-ui', letterSpacing: '-0.01em',
            transition: 'background 0.2s, color 0.2s',
          }}
        >
          {spinning ? 'Girando…' : winner ? 'Girar novamente' : 'Girar a roleta'}
        </button>
      </div>
    </div>
  );
}
