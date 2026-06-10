'use client';

import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { loadGift } from '@/lib/gift-store';
import { MiniPlayer } from '../MiniPlayer';

// ─── Types ────────────────────────────────────────────────────────────────────

type LetterState = 'correct' | 'present' | 'absent';
type GameState   = 'playing' | 'won' | 'lost';

// ─── Logic ────────────────────────────────────────────────────────────────────

function evaluate(guess: string, secret: string): LetterState[] {
  const n      = secret.length;
  const result = Array<LetterState>(n).fill('absent');
  const sec    = [...secret];
  const gue    = [...guess];

  for (let i = 0; i < n; i++) {
    if (gue[i] === sec[i]) { result[i] = 'correct'; sec[i] = ''; gue[i] = ''; }
  }
  for (let i = 0; i < n; i++) {
    if (!gue[i]) continue;
    const j = sec.indexOf(gue[i]);
    if (j !== -1) { result[i] = 'present'; sec[j] = ''; }
  }
  return result;
}

// ─── Keyboard ─────────────────────────────────────────────────────────────────

const ROWS = [
  ['Q','W','E','R','T','Y','U','I','O','P'],
  ['A','S','D','F','G','H','J','K','L'],
  ['ENTER','Z','X','C','V','B','N','M','⌫'],
];

const TILE_BG: Record<LetterState | 'empty' | 'active', string> = {
  correct: '#22C55E',
  present: '#EAB308',
  absent:  '#374151',
  empty:   'transparent',
  active:  'transparent',
};

const KEY_BG: Record<LetterState | 'unused', string> = {
  correct: '#22C55E',
  present: '#EAB308',
  absent:  '#374151',
  unused:  'rgba(255,255,255,0.1)',
};

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function WordlePage() {
  const { id } = useParams<{ id: string }>();

  const [secret,      setSecret]     = useState('');
  const [clue,        setClue]       = useState('');
  const [winMessage,  setWinMessage] = useState('');
  const [notFound,    setNotFound]   = useState(false);
  const [hasRoulette, setHasRoulette] = useState(false);

  const [guesses,  setGuesses]  = useState<string[]>([]);
  const [states,   setStates]   = useState<LetterState[][]>([]);
  const [current,  setCurrent]  = useState('');
  const [game,     setGame]     = useState<GameState>('playing');
  const [shake,    setShake]    = useState(false);
  const [reveal,   setReveal]   = useState(false);

  const MAX_TRIES = 6;

  useEffect(() => {
    const gift = loadGift(id);
    if (!gift || !gift.funnel.wordle.word) { setNotFound(true); return; }
    setSecret(gift.funnel.wordle.word.toUpperCase());
    setClue(gift.funnel.wordle.clue);
    setWinMessage(gift.funnel.wordle.winMessage);
    setHasRoulette(
      gift.funnel.extras.includes('roulette') &&
      gift.funnel.roulette.options.length >= 2
    );
  }, [id]);

  // Build per-letter keyboard state from completed guesses
  const letterStates = new Map<string, LetterState>();
  states.forEach((row, gi) => {
    row.forEach((s, ci) => {
      const letter = guesses[gi][ci];
      const prev   = letterStates.get(letter);
      if (!prev || prev === 'absent' || (prev === 'present' && s === 'correct'))
        letterStates.set(letter, s);
    });
  });

  const submit = useCallback(() => {
    if (!secret || current.length !== secret.length || game !== 'playing') return;

    const result = evaluate(current, secret);
    const newGuesses = [...guesses, current];
    const newStates  = [...states, result];
    setGuesses(newGuesses);
    setStates(newStates);
    setCurrent('');

    if (current === secret) {
      setGame('won');
    } else if (newGuesses.length >= MAX_TRIES) {
      setGame('lost');
    }
  }, [secret, current, game, guesses, states]);

  const press = useCallback((key: string) => {
    if (game !== 'playing' || !secret) return;

    if (key === '⌫' || key === 'BACKSPACE') {
      setCurrent(p => p.slice(0, -1));
    } else if (key === 'ENTER') {
      if (current.length < secret.length) {
        setShake(true);
        setTimeout(() => setShake(false), 500);
      } else {
        submit();
      }
    } else if (/^[A-Z]$/.test(key) && current.length < secret.length) {
      setCurrent(p => p + key);
    }
  }, [game, secret, current, submit]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => press(e.key.toUpperCase());
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [press]);

  if (notFound) {
    return (
      <div style={{ minHeight: '100dvh', background: '#0A0A0A', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontFamily: 'system-ui', padding: '0 24px' }}>
        <p style={{ fontSize: 48, margin: '0 0 12px' }}>🤔</p>
        <p style={{ fontSize: 18, fontWeight: 700, color: '#fff', margin: '0 0 24px', textAlign: 'center' }}>Wordle não encontrado</p>
        <Link href={`/presente/${id}`} style={{ color: '#22C55E', fontWeight: 700, fontSize: 14 }}>← Voltar ao presente</Link>
      </div>
    );
  }

  if (!secret) {
    return (
      <div style={{ minHeight: '100dvh', background: '#0A0A0A', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: 32, height: 32, borderRadius: '50%', border: '3px solid rgba(255,255,255,0.1)', borderTopColor: '#22C55E', animation: 'spin 0.8s linear infinite' }} />
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      </div>
    );
  }

  const wordLen = secret.length;

  const otherProducts = hasRoulette
    ? [{ href: `/presente/${id}/roleta`, label: 'Roleta Surpresa', icon: '🎡' }]
    : [];

  return (
    <div style={{ minHeight: '100dvh', background: '#0A0A0A', fontFamily: 'system-ui', display: 'flex', flexDirection: 'column', alignItems: 'center', paddingBottom: 80 }}>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes shake { 0%,100%{transform:translateX(0)} 20%,60%{transform:translateX(-6px)} 40%,80%{transform:translateX(6px)} }
        @keyframes pop   { 0%{transform:scale(0.9)} 50%{transform:scale(1.08)} 100%{transform:scale(1)} }
      `}</style>

      {/* Header */}
      <div style={{ width: '100%', maxWidth: 500, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 24px 0', boxSizing: 'border-box' }}>
        <Link href={`/presente/${id}`} style={{ fontSize: 13, fontWeight: 700, color: 'rgba(255,255,255,0.4)', textDecoration: 'none' }}>
          ← Presente
        </Link>
        <span style={{ fontSize: 15, fontWeight: 900, color: '#fff', letterSpacing: '-0.01em' }}>
          Wordle <span style={{ color: '#E11D48' }}>do Amor</span>
        </span>
        <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.25)', fontWeight: 600 }}>
          {guesses.length}/{MAX_TRIES}
        </span>
      </div>

      {/* Clue */}
      {clue && (
        <div style={{ marginTop: 20, padding: '12px 20px', background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.2)', borderRadius: 14, maxWidth: 460, width: 'calc(100% - 48px)', boxSizing: 'border-box' }}>
          <p style={{ fontSize: 13, fontWeight: 700, color: '#4ADE80', margin: 0, textAlign: 'center' }}>
            💡 {clue}
          </p>
        </div>
      )}

      {/* Grid */}
      <div style={{ marginTop: 28, display: 'flex', flexDirection: 'column', gap: 6, animation: shake ? 'shake 0.5s ease' : 'none' }}>
        {Array.from({ length: MAX_TRIES }, (_, row) => {
          const isDone    = row < guesses.length;
          const isCurrent = row === guesses.length && game === 'playing';
          const letters   = isDone ? guesses[row] : isCurrent ? current : '';
          const rowStates = isDone ? states[row] : null;

          return (
            <div key={row} style={{ display: 'flex', gap: 6 }}>
              {Array.from({ length: wordLen }, (_, col) => {
                const letter = letters[col] ?? '';
                const state  = rowStates?.[col];
                const bg     = state ? TILE_BG[state] : letter ? 'rgba(255,255,255,0.08)' : TILE_BG.empty;
                const border = state
                  ? 'transparent'
                  : letter
                    ? '2px solid rgba(255,255,255,0.35)'
                    : '2px solid rgba(255,255,255,0.12)';

                return (
                  <div key={col} style={{
                    width: Math.min(56, Math.floor((Math.min(window.innerWidth, 360) - (wordLen + 1) * 6) / wordLen)),
                    height: Math.min(56, Math.floor((Math.min(window.innerWidth, 360) - (wordLen + 1) * 6) / wordLen)),
                    background: bg,
                    border,
                    borderRadius: 10,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 22, fontWeight: 800, color: '#fff',
                    animation: letter && !state ? 'pop 0.1s ease' : 'none',
                    transition: 'background 0.25s, border 0.25s',
                  }}>
                    {letter}
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>

      {/* Win / Lose banner */}
      {game !== 'playing' && (
        <div style={{
          marginTop: 28, padding: '20px 24px', borderRadius: 18,
          background: game === 'won' ? 'rgba(34,197,94,0.12)' : 'rgba(239,68,68,0.12)',
          border: `1.5px solid ${game === 'won' ? 'rgba(34,197,94,0.3)' : 'rgba(239,68,68,0.3)'}`,
          maxWidth: 420, width: 'calc(100% - 48px)', boxSizing: 'border-box', textAlign: 'center',
        }}>
          {game === 'won' ? (
            <>
              <p style={{ fontSize: 26, margin: '0 0 6px' }}>🎉</p>
              <p style={{ fontSize: 17, fontWeight: 800, color: '#4ADE80', margin: '0 0 6px' }}>Acertou!</p>
              {winMessage && <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.7)', margin: 0, lineHeight: 1.4 }}>{winMessage}</p>}
            </>
          ) : (
            <>
              <p style={{ fontSize: 26, margin: '0 0 6px' }}>😔</p>
              <p style={{ fontSize: 17, fontWeight: 800, color: '#F87171', margin: '0 0 6px' }}>Era: {secret}</p>
              <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)', margin: 0 }}>Não desanima — tente de novo!</p>
            </>
          )}
        </div>
      )}

      <MiniPlayer
        presenteHref={`/presente/${id}`}
        otherProducts={otherProducts}
      />

      {/* Keyboard */}
      <div style={{ marginTop: 'auto', paddingTop: 24, paddingBottom: 32, display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'center' }}>
        {ROWS.map((row, ri) => (
          <div key={ri} style={{ display: 'flex', gap: 6 }}>
            {row.map(key => {
              const state = letterStates.get(key);
              const isWide = key === 'ENTER' || key === '⌫';
              return (
                <button
                  key={key}
                  onClick={() => press(key)}
                  style={{
                    minWidth: isWide ? 56 : 34, height: 48,
                    padding: isWide ? '0 10px' : 0,
                    borderRadius: 8, border: 'none', cursor: 'pointer',
                    background: state ? KEY_BG[state] : KEY_BG.unused,
                    color: '#fff', fontWeight: 800, fontSize: isWide ? 11 : 15,
                    fontFamily: 'system-ui',
                    transition: 'background 0.2s',
                  }}
                >
                  {key}
                </button>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
