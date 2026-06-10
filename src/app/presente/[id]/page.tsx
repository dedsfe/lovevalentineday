'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { SpotifyPlayer } from '@/components/products/spotify/SpotifyPlayer';
import { loadGift, type StoredGift } from '@/lib/gift-store';

// ─── Mini Wordle preview (fake tiles, just for aesthetics) ────────────────────

const WORDLE_PREVIEW = [
  ['correct','absent','present','absent','correct'],
  ['absent','correct','correct','present','absent'],
  ['correct','correct','correct','correct','correct'],
];
const TILE_COLOR: Record<string, string> = {
  correct: '#22C55E',
  present: '#EAB308',
  absent:  'rgba(255,255,255,0.08)',
};

function WordlePreview() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      {WORDLE_PREVIEW.map((row, ri) => (
        <div key={ri} style={{ display: 'flex', gap: 4 }}>
          {row.map((state, ci) => (
            <div key={ci} style={{
              width: 20, height: 20, borderRadius: 4,
              background: TILE_COLOR[state],
              border: state === 'absent' ? '1px solid rgba(255,255,255,0.15)' : 'none',
            }} />
          ))}
        </div>
      ))}
    </div>
  );
}

// ─── Mini roulette preview ────────────────────────────────────────────────────

const WHEEL_COLORS = ['#E11D48','#7C3AED','#2563EB','#059669','#D97706','#DB2777'];

function MiniWheel({ n }: { n: number }) {
  const cx = 36; const cy = 36; const r = 32;
  const count = Math.min(n, 6);
  const sa    = 360 / count;
  const toRad = (deg: number) => ((deg - 90) * Math.PI) / 180;

  return (
    <svg width={72} height={72} style={{ display: 'block' }}>
      {Array.from({ length: count }, (_, i) => {
        const s = i * sa; const e = s + sa;
        const x1 = cx + r * Math.cos(toRad(s)); const y1 = cy + r * Math.sin(toRad(s));
        const x2 = cx + r * Math.cos(toRad(e)); const y2 = cy + r * Math.sin(toRad(e));
        const d  = `M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${sa > 180 ? 1 : 0} 1 ${x2} ${y2} Z`;
        return <path key={i} d={d} fill={WHEEL_COLORS[i % WHEEL_COLORS.length]} stroke="#0A0A0A" strokeWidth={1.5} />;
      })}
      <circle cx={cx} cy={cy} r={8} fill="#0A0A0A" />
    </svg>
  );
}

// ─── Game widget ──────────────────────────────────────────────────────────────

function GameWidget({
  href, accent, glow, preview, badge, title, subtitle, cta,
}: {
  href: string; accent: string; glow: string;
  preview: React.ReactNode;
  badge: string; title: string; subtitle: string; cta: string;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <Link href={href} style={{ textDecoration: 'none', display: 'block' }}>
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          position: 'relative', overflow: 'hidden',
          borderRadius: 24,
          border: `1.5px solid ${hovered ? accent + '55' : 'rgba(255,255,255,0.08)'}`,
          background: hovered ? `${accent}0D` : 'rgba(255,255,255,0.03)',
          padding: '24px 22px',
          transition: 'all 0.22s ease',
          boxShadow: hovered ? `0 0 32px ${glow}` : 'none',
          cursor: 'pointer',
        }}
      >
        {/* Glow blob */}
        <div style={{
          position: 'absolute', top: -40, right: -40,
          width: 140, height: 140, borderRadius: '50%',
          background: `radial-gradient(circle, ${accent}22 0%, transparent 70%)`,
          pointerEvents: 'none', transition: 'opacity 0.22s',
          opacity: hovered ? 1 : 0.4,
        }} />

        <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
          {/* Preview visual */}
          <div style={{
            flexShrink: 0, width: 80, height: 80,
            background: `${accent}11`,
            border: `1.5px solid ${accent}22`,
            borderRadius: 18,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            {preview}
          </div>

          {/* Text */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <span style={{
              display: 'inline-block',
              fontSize: 10, fontWeight: 800, letterSpacing: '0.1em',
              textTransform: 'uppercase', color: accent,
              background: `${accent}18`, borderRadius: 6,
              padding: '2px 8px', marginBottom: 8,
              fontFamily: 'system-ui',
            }}>
              {badge}
            </span>
            <p style={{
              fontSize: 17, fontWeight: 900, color: '#fff',
              margin: '0 0 5px', letterSpacing: '-0.02em',
              fontFamily: 'system-ui', lineHeight: 1.2,
            }}>
              {title}
            </p>
            <p style={{
              fontSize: 13, color: 'rgba(255,255,255,0.4)',
              margin: 0, fontFamily: 'system-ui', lineHeight: 1.4,
            }}>
              {subtitle}
            </p>
          </div>
        </div>

        {/* CTA button */}
        <div style={{
          marginTop: 20,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: hovered ? accent : `${accent}22`,
          borderRadius: 14, padding: '13px 0',
          transition: 'background 0.22s',
        }}>
          <span style={{
            fontSize: 14, fontWeight: 800, color: '#fff',
            fontFamily: 'system-ui', letterSpacing: '-0.01em',
          }}>
            {cta}
          </span>
        </div>
      </div>
    </Link>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function PresentePage() {
  const { id } = useParams<{ id: string }>();
  const [gift, setGift]       = useState<StoredGift | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setGift(loadGift(id));
    setLoading(false);
  }, [id]);

  if (loading) {
    return (
      <div style={{ minHeight: '100dvh', background: '#0A0A0A', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: 36, height: 36, borderRadius: '50%', border: '3px solid rgba(255,255,255,0.1)', borderTopColor: '#E11D48', animation: 'spin 0.8s linear infinite' }} />
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      </div>
    );
  }

  if (!gift) {
    return (
      <div style={{ minHeight: '100dvh', background: '#0A0A0A', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0 24px', fontFamily: 'system-ui' }}>
        <p style={{ fontSize: 48, margin: '0 0 16px' }}>💔</p>
        <p style={{ fontSize: 22, fontWeight: 800, color: '#fff', margin: '0 0 8px', textAlign: 'center' }}>Presente não encontrado</p>
        <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.4)', margin: '0 0 32px', textAlign: 'center' }}>
          Este link pode ter expirado ou foi aberto em outro dispositivo.
        </p>
        <Link href="/" style={{ background: '#E11D48', color: '#fff', textDecoration: 'none', padding: '14px 28px', borderRadius: 14, fontWeight: 700, fontSize: 15 }}>
          Criar meu presente
        </Link>
      </div>
    );
  }

  const { funnel } = gift;
  const hasWordle   = funnel.extras.includes('wordle')   && funnel.wordle.word.length   >= 3;
  const hasRoulette = funnel.extras.includes('roulette') && funnel.roulette.options.length >= 2;

  return (
    <div style={{ minHeight: '100dvh', background: '#0A0A0A' }}>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>

      {/* SpotifyPlayer */}
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <div style={{ width: '100%', maxWidth: 390 }}>
          <SpotifyPlayer spotify={funnel.spotify} base={funnel.base} />
        </div>
      </div>

      {/* Mini-game widgets */}
      {(hasWordle || hasRoulette) && (
        <div style={{ padding: '56px 20px 80px', maxWidth: 430, margin: '0 auto', boxSizing: 'border-box' }}>

          {/* Section header */}
          <div style={{ textAlign: 'center', marginBottom: 28 }}>
            <p style={{
              fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.2)',
              textTransform: 'uppercase', letterSpacing: '0.16em',
              margin: '0 0 8px', fontFamily: 'system-ui',
            }}>
              Tem mais surpresas
            </p>
            <p style={{
              fontSize: 20, fontWeight: 900, color: '#fff',
              margin: 0, letterSpacing: '-0.02em', fontFamily: 'system-ui',
            }}>
              Mini-jogos pra vocês ❤️
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {hasWordle && (
              <GameWidget
                href={`/presente/${id}/wordle`}
                accent="#22C55E"
                glow="rgba(34,197,94,0.15)"
                preview={<WordlePreview />}
                badge="Palavra secreta"
                title="Wordle do Amor"
                subtitle={`Adivinhe a palavra de ${funnel.wordle.word.length} letras escolhida pra você`}
                cta="Jogar agora →"
              />
            )}
            {hasRoulette && (
              <GameWidget
                href={`/presente/${id}/roleta`}
                accent="#E11D48"
                glow="rgba(225,29,72,0.15)"
                preview={<MiniWheel n={funnel.roulette.options.length} />}
                badge="Roleta"
                title={funnel.roulette.title || 'Roleta Surpresa'}
                subtitle={`${funnel.roulette.options.length} opções surpresa te esperam`}
                cta="Girar a roleta →"
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}
