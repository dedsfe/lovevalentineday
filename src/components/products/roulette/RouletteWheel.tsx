'use client';

import { useState, useRef } from 'react';
import type { RouletteData } from '@/lib/types';

// ─── Colors ───────────────────────────────────────────────────────────────────

const SEGMENT_COLORS = [
  '#E11D48', '#7C3AED', '#0891B2', '#D97706',
  '#059669', '#EA580C', '#6366F1', '#DB2777',
  '#0D9488', '#9333EA',
];

// ─── SVG helpers ─────────────────────────────────────────────────────────────

const R  = 140;   // wheel radius
const CX = 150;   // center x
const CY = 150;   // center y

function segmentPath(index: number, total: number): string {
  const angle     = 360 / total;
  const startDeg  = -90 + index * angle;
  const endDeg    = startDeg + angle;
  const toRad     = (d: number) => (d * Math.PI) / 180;
  const x1 = CX + R * Math.cos(toRad(startDeg));
  const y1 = CY + R * Math.sin(toRad(startDeg));
  const x2 = CX + R * Math.cos(toRad(endDeg));
  const y2 = CY + R * Math.sin(toRad(endDeg));
  const large = angle > 180 ? 1 : 0;
  return `M ${CX} ${CY} L ${x1} ${y1} A ${R} ${R} 0 ${large} 1 ${x2} ${y2} Z`;
}

function textTransform(index: number, total: number): { x: number; y: number; rotate: number } {
  const angle    = 360 / total;
  const midDeg   = -90 + (index + 0.5) * angle;
  const toRad    = (d: number) => (d * Math.PI) / 180;
  const textR    = R * 0.65;
  const x        = CX + textR * Math.cos(toRad(midDeg));
  const y        = CY + textR * Math.sin(toRad(midDeg));
  // Flip text in the bottom half so it's always readable
  const rotate   = midDeg > 90 || midDeg < -90 ? midDeg + 180 : midDeg;
  return { x, y, rotate };
}

function truncate(s: string, n: number) {
  return s.length > n ? s.slice(0, n - 1) + '…' : s;
}

// ─── Component ───────────────────────────────────────────────────────────────

interface Props { data: RouletteData }

export function RouletteWheel({ data }: Props) {
  const options = data.options.filter(o => o.trim());
  const n       = options.length;

  const [rotation, setRotation] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [winner,   setWinner]   = useState<string | null>(null);
  const transitionRef = useRef(false);

  const maxChars = Math.max(6, Math.floor(18 / Math.sqrt(n)));
  const fontSize  = Math.max(10, Math.min(16, Math.floor(160 / (n * 3))));

  const spin = () => {
    if (spinning || n < 2) return;

    const winIndex    = Math.floor(Math.random() * n);
    const segAngle    = 360 / n;
    const fullSpins   = (5 + Math.floor(Math.random() * 4)) * 360;
    const landAngle   = (360 - (winIndex + 0.5) * segAngle) % 360;
    const currentMod  = ((rotation % 360) + 360) % 360;
    const delta       = (landAngle - currentMod + 360) % 360;
    const newRotation = rotation + fullSpins + delta;

    transitionRef.current = true;
    setWinner(null);
    setSpinning(true);
    setRotation(newRotation);

    setTimeout(() => {
      setSpinning(false);
      setWinner(options[winIndex]);
    }, 4300);
  };

  if (n < 2) {
    return (
      <div style={{ background: '#0F172A', borderRadius: 24, padding: '48px 24px', textAlign: 'center', maxWidth: 390, width: '100%' }}>
        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 15, fontWeight: 600 }}>
          Adicione pelo menos 2 opções para ver a roleta
        </p>
      </div>
    );
  }

  return (
    <div style={{
      width: '100%', maxWidth: 390,
      background: '#0F172A', borderRadius: 24, overflow: 'hidden',
      fontFamily: 'system-ui, -apple-system, sans-serif',
    }}>
      {/* Title */}
      <div style={{ padding: '24px 20px 20px', textAlign: 'center' }}>
        <p style={{ fontSize: 20, fontWeight: 800, color: '#FFFFFF', margin: 0, wordBreak: 'break-word' }}>
          {data.title || 'Roleta do Casal'}
        </p>
      </div>

      {/* Wheel */}
      <div style={{ position: 'relative', display: 'flex', justifyContent: 'center', padding: '0 20px' }}>
        {/* Pointer */}
        <div style={{
          position: 'absolute', top: -2, left: '50%', transform: 'translateX(-50%)',
          width: 0, height: 0, zIndex: 10,
          borderLeft: '13px solid transparent',
          borderRight: '13px solid transparent',
          borderTop: '26px solid #FFFFFF',
          filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.5))',
        }} />

        {/* Wheel SVG */}
        <div style={{
          borderRadius: '50%',
          boxShadow: '0 8px 40px rgba(0,0,0,0.5)',
          overflow: 'hidden',
        }}>
          <svg
            width={300} height={300}
            viewBox="0 0 300 300"
            style={{
              transform: `rotate(${rotation}deg)`,
              transition: spinning
                ? 'transform 4.2s cubic-bezier(0.23, 1, 0.32, 1)'
                : 'none',
              display: 'block',
            }}
          >
            {/* Segments */}
            {options.map((option, i) => {
              const { x, y, rotate } = textTransform(i, n);
              return (
                <g key={i}>
                  <path
                    d={segmentPath(i, n)}
                    fill={SEGMENT_COLORS[i % SEGMENT_COLORS.length]}
                    stroke="rgba(0,0,0,0.15)"
                    strokeWidth={1.5}
                  />
                  <text
                    x={x} y={y}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fill="white"
                    fontSize={fontSize}
                    fontWeight="700"
                    transform={`rotate(${rotate}, ${x}, ${y})`}
                    style={{ pointerEvents: 'none' }}
                  >
                    {truncate(option, maxChars)}
                  </text>
                </g>
              );
            })}

            {/* Center cap */}
            <circle cx={CX} cy={CY} r={24} fill="#0F172A" />
            <circle cx={CX} cy={CY} r={18} fill="#1E293B" />
          </svg>
        </div>
      </div>

      {/* Spin button */}
      <div style={{ padding: '24px 20px 0', display: 'flex', justifyContent: 'center' }}>
        <button
          onClick={spin}
          disabled={spinning}
          style={{
            background: spinning ? '#334155' : '#E11D48',
            color: '#FFFFFF',
            border: 'none',
            borderRadius: 50,
            padding: '16px 48px',
            fontSize: 17,
            fontWeight: 800,
            cursor: spinning ? 'not-allowed' : 'pointer',
            transition: 'background 0.2s, transform 0.1s',
            transform: spinning ? 'scale(0.97)' : 'scale(1)',
            letterSpacing: '0.01em',
          }}
        >
          {spinning ? 'Girando…' : 'Girar! 🎰'}
        </button>
      </div>

      {/* Result */}
      <div style={{ minHeight: 88, padding: '20px 20px 28px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {winner && !spinning && (
          <div style={{
            background: '#1E293B',
            border: '2px solid rgba(255,255,255,0.12)',
            borderRadius: 18,
            padding: '18px 28px',
            textAlign: 'center',
            animation: 'popIn 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)',
          }}>
            <p style={{ fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 8px' }}>
              Resultado
            </p>
            <p style={{ fontSize: 22, fontWeight: 800, color: '#FFFFFF', margin: 0, wordBreak: 'break-word' }}>
              {winner}
            </p>
          </div>
        )}
      </div>

      <style>{`
        @keyframes popIn {
          0%   { transform: scale(0.7); opacity: 0; }
          100% { transform: scale(1);   opacity: 1; }
        }
      `}</style>
    </div>
  );
}
