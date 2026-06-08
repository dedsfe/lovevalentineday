'use client';

import { useState, useEffect } from 'react';
import type { RouletteData } from '@/lib/types';

// ─── Colors ───────────────────────────────────────────────────────────────────

const SEGMENT_COLORS = [
  '#E11D48', '#7C3AED', '#0891B2', '#D97706',
  '#059669', '#EA580C', '#6366F1', '#DB2777',
  '#0D9488', '#9333EA',
];

const EMOJIS = ['🎉', '❤️', '🎊', '✨', '💕', '🌟', '💝', '🎈'];

// ─── Text wrap (tspan) ────────────────────────────────────────────────────────

function wrapText(text: string, maxChars: number): string[] {
  const words = text.split(' ');
  const lines: string[] = [];
  let line = '';

  for (const word of words) {
    if (word.length > maxChars) {
      if (line) { lines.push(line); line = ''; }
      for (let i = 0; i < word.length; i += maxChars)
        lines.push(word.slice(i, i + maxChars));
    } else if (!line) {
      line = word;
    } else if ((line + ' ' + word).length <= maxChars) {
      line += ' ' + word;
    } else {
      lines.push(line);
      line = word;
    }
  }
  if (line) lines.push(line);
  return lines.slice(0, 4); // max 4 lines
}

// ─── SVG helpers ─────────────────────────────────────────────────────────────

const R  = 140;
const CX = 150;
const CY = 150;

function segmentPath(i: number, n: number) {
  const a = 360 / n;
  const s = (-90 + i * a) * (Math.PI / 180);
  const e = s + a * (Math.PI / 180);
  const x1 = CX + R * Math.cos(s), y1 = CY + R * Math.sin(s);
  const x2 = CX + R * Math.cos(e), y2 = CY + R * Math.sin(e);
  return `M ${CX} ${CY} L ${x1} ${y1} A ${R} ${R} 0 ${a > 180 ? 1 : 0} 1 ${x2} ${y2} Z`;
}

function textInfo(i: number, n: number) {
  const a    = 360 / n;
  const mid  = -90 + (i + 0.5) * a;
  const r    = (d: number) => d * Math.PI / 180;
  const tR   = R * 0.63;
  const x    = CX + tR * Math.cos(r(mid));
  const y    = CY + tR * Math.sin(r(mid));
  const rot  = mid > 90 || mid < -90 ? mid + 180 : mid;

  // chord width available for text
  const chord    = 2 * tR * Math.sin(r(a / 2));
  const fontSize = n <= 4 ? 13 : n <= 7 ? 11 : 10;
  const maxChars = Math.max(6, Math.floor(chord / (fontSize * 0.62)));
  const lineH    = fontSize * 1.4;

  return { x, y, rot, fontSize, maxChars, lineH };
}

// ─── Particle type ────────────────────────────────────────────────────────────

type Particle = { id: number; x: number; emoji: string; dur: number; delay: number; size: number };

// ─── Component ───────────────────────────────────────────────────────────────

interface Props { data: RouletteData }

export function RouletteWheel({ data }: Props) {
  const options = data.options.filter(o => o.trim());
  const n       = options.length;

  const [rotation,  setRotation]  = useState(0);
  const [spinning,  setSpinning]  = useState(false);
  const [winner,    setWinner]    = useState<string | null>(null);
  const [particles, setParticles] = useState<Particle[]>([]);

  // Confetti burst when winner is revealed
  useEffect(() => {
    if (!winner) { setParticles([]); return; }
    const burst: Particle[] = Array.from({ length: 18 }, (_, i) => ({
      id:    Date.now() + i,
      x:     8 + Math.random() * 84,
      emoji: EMOJIS[Math.floor(Math.random() * EMOJIS.length)],
      dur:   1.4 + Math.random() * 0.9,
      delay: Math.random() * 0.5,
      size:  18 + Math.random() * 14,
    }));
    setParticles(burst);
    const t = setTimeout(() => setParticles([]), 3200);
    return () => clearTimeout(t);
  }, [winner]);

  const spin = () => {
    if (spinning || n < 2) return;
    const winIdx    = Math.floor(Math.random() * n);
    const segAngle  = 360 / n;
    const fullSpins = (5 + Math.floor(Math.random() * 4)) * 360;
    const landAngle = (360 - (winIdx + 0.5) * segAngle) % 360;
    const curMod    = ((rotation % 360) + 360) % 360;
    const delta     = (landAngle - curMod + 360) % 360;

    setWinner(null);
    setSpinning(true);
    setRotation(prev => prev + fullSpins + delta);

    setTimeout(() => { setSpinning(false); setWinner(options[winIdx]); }, 4300);
  };

  if (n < 2) return (
    <div style={{ background: '#0F172A', borderRadius: 24, padding: '48px 24px', textAlign: 'center', maxWidth: 390, width: '100%' }}>
      <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 15, fontWeight: 600 }}>
        Adicione pelo menos 2 opções para ver a roleta
      </p>
    </div>
  );

  return (
    <div style={{ width: '100%', maxWidth: 390, position: 'relative' }}>

      {/* ── Main card ────────────────────────────────────────────── */}
      <div style={{
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
            filter: 'drop-shadow(0 2px 6px rgba(0,0,0,0.6))',
          }} />

          <div style={{ borderRadius: '50%', boxShadow: '0 8px 40px rgba(0,0,0,0.5)', overflow: 'hidden' }}>
            <svg
              width={300} height={300} viewBox="0 0 300 300"
              style={{
                display: 'block',
                transform: `rotate(${rotation}deg)`,
                transition: spinning ? 'transform 4.2s cubic-bezier(0.23, 1, 0.32, 1)' : 'none',
              }}
            >
              {options.map((option, i) => {
                const { x, y, rot, fontSize, maxChars, lineH } = textInfo(i, n);
                const lines   = wrapText(option, maxChars);
                const startY  = y - (lines.length - 1) * lineH / 2;

                return (
                  <g key={i}>
                    <path
                      d={segmentPath(i, n)}
                      fill={SEGMENT_COLORS[i % SEGMENT_COLORS.length]}
                      stroke="rgba(0,0,0,0.15)"
                      strokeWidth={1.5}
                    />
                    <text
                      textAnchor="middle"
                      dominantBaseline="middle"
                      fill="white"
                      fontSize={fontSize}
                      fontWeight="700"
                      transform={`rotate(${rot}, ${x}, ${y})`}
                    >
                      {lines.map((line, li) => (
                        <tspan key={li} x={x} y={startY + li * lineH}>
                          {line}
                        </tspan>
                      ))}
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
              color: '#FFFFFF', border: 'none', borderRadius: 50,
              padding: '16px 48px', fontSize: 17, fontWeight: 800,
              cursor: spinning ? 'not-allowed' : 'pointer',
              transition: 'background 0.2s, transform 0.1s',
              transform: spinning ? 'scale(0.97)' : 'scale(1)',
            }}
          >
            {spinning ? 'Girando…' : 'Girar! 🎰'}
          </button>
        </div>

        {/* Result */}
        <div style={{ minHeight: 88, padding: '20px 20px 28px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {winner && !spinning && (
            <div style={{
              background: '#1E293B', border: '2px solid rgba(255,255,255,0.12)',
              borderRadius: 18, padding: '18px 28px', textAlign: 'center',
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
      </div>

      {/* ── Emoji particles (above card) ─────────────────────────── */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden', borderRadius: 24, zIndex: 20 }}>
        {particles.map(p => (
          <span
            key={p.id}
            style={{
              position: 'absolute',
              left: `${p.x}%`,
              bottom: '30%',
              fontSize: p.size,
              lineHeight: 1,
              animation: `floatUp ${p.dur}s ease-out ${p.delay}s forwards`,
              willChange: 'transform, opacity',
            }}
          >
            {p.emoji}
          </span>
        ))}
      </div>

      <style>{`
        @keyframes popIn {
          0%   { transform: scale(0.7); opacity: 0; }
          100% { transform: scale(1);   opacity: 1; }
        }
        @keyframes floatUp {
          0%   { transform: translateY(0) rotate(0deg) scale(1);   opacity: 1; }
          100% { transform: translateY(-320px) rotate(720deg) scale(0.4); opacity: 0; }
        }
      `}</style>
    </div>
  );
}
