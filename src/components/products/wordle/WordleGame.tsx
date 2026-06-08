'use client';

import { useState, useEffect, useCallback } from 'react';
import type { WordleData } from '@/lib/types';

// ─── Evaluation ───────────────────────────────────────────────────────────────

type Result = 'correct' | 'present' | 'absent';

function evaluate(guess: string, word: string): Result[] {
  const result: Result[] = Array(word.length).fill('absent');
  const pool = word.split('');

  // First pass: correct positions
  guess.split('').forEach((l, i) => {
    if (l === pool[i]) { result[i] = 'correct'; pool[i] = '#'; }
  });

  // Second pass: present elsewhere
  guess.split('').forEach((l, i) => {
    if (result[i] === 'correct') return;
    const j = pool.indexOf(l);
    if (j !== -1) { result[i] = 'present'; pool[j] = '#'; }
  });

  return result;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const MAX_ATTEMPTS = 6;

const ROWS = [
  ['Q','W','E','R','T','Y','U','I','O','P'],
  ['A','S','D','F','G','H','J','K','L'],
  ['ENTER','Z','X','C','V','B','N','M','⌫'],
];

const C = {
  correct: '#16A34A',
  present: '#CA8A04',
  absent:  '#334155',
  empty:   '#1E293B',
  bg:      '#0F172A',
  key:     '#334155',
  text:    '#FFFFFF',
};

// ─── Component ───────────────────────────────────────────────────────────────

interface Props { data: WordleData }

export function WordleGame({ data }: Props) {
  const word    = data.word.toUpperCase().replace(/[^A-Z]/g, '');
  const wordLen = word.length;

  const [guesses,   setGuesses]   = useState<string[]>([]);
  const [current,   setCurrent]   = useState('');
  const [shakeRow,  setShakeRow]  = useState(-1);
  const [gameState, setGameState] = useState<'playing' | 'won' | 'lost'>('playing');

  // Reset when word changes (config preview)
  useEffect(() => {
    setGuesses([]);
    setCurrent('');
    setGameState('playing');
  }, [word]);

  // Key colour map (best result per letter)
  const keyColors = new Map<string, Result>();
  guesses.forEach(g => {
    evaluate(g, word).forEach((res, i) => {
      const prev = keyColors.get(g[i]);
      if (!prev || res === 'correct' || (res === 'present' && prev === 'absent'))
        keyColors.set(g[i], res);
    });
  });

  // Cell sizing — scale down for long words
  const cellSize = Math.min(62, Math.floor(330 / wordLen) - 5);
  const fontSize  = Math.max(13, Math.round(cellSize * 0.42));

  const handleKey = useCallback((key: string) => {
    if (gameState !== 'playing') return;

    if (key === 'ENTER') {
      if (current.length < wordLen) {
        const row = guesses.length;
        setShakeRow(row);
        setTimeout(() => setShakeRow(r => r === row ? -1 : r), 500);
        return;
      }
      const next = [...guesses, current];
      setGuesses(next);
      setCurrent('');
      if (current === word)        setGameState('won');
      else if (next.length >= MAX_ATTEMPTS) setGameState('lost');

    } else if (key === '⌫' || key === 'BACKSPACE') {
      setCurrent(c => c.slice(0, -1));

    } else if (/^[A-Z]$/.test(key) && current.length < wordLen) {
      setCurrent(c => c + key);
    }
  }, [gameState, current, guesses, word, wordLen]);

  // Physical keyboard
  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.altKey || e.metaKey) return;
      if (e.key === 'Enter')          handleKey('ENTER');
      else if (e.key === 'Backspace') handleKey('BACKSPACE');
      else if (/^[a-zA-Z]$/.test(e.key)) handleKey(e.key.toUpperCase());
    };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [handleKey]);

  // ── Grid ──────────────────────────────────────────────────────────────────
  const grid = Array.from({ length: MAX_ATTEMPTS }, (_, row) => {
    if (row < guesses.length) {
      const g = guesses[row];
      const r = evaluate(g, word);
      return Array.from({ length: wordLen }, (_, col) => ({ letter: g[col] ?? '', result: r[col] }));
    }
    if (row === guesses.length && gameState === 'playing')
      return Array.from({ length: wordLen }, (_, col) => ({ letter: current[col] ?? '', result: null }));
    return Array.from({ length: wordLen }, () => ({ letter: '', result: null }));
  });

  const tileBg = (result: Result | null, letter: string) => {
    if (!result) return C.empty;
    return C[result];
  };

  const tileBorder = (result: Result | null, letter: string) => {
    if (result) return '2px solid transparent';
    return letter ? '2px solid rgba(255,255,255,0.35)' : '2px solid rgba(255,255,255,0.1)';
  };

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div style={{
      width: '100%', maxWidth: 390,
      background: C.bg, borderRadius: 24, overflow: 'hidden',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      userSelect: 'none',
    }}>
      {/* Header */}
      <div style={{ padding: '24px 20px 18px', borderBottom: '1px solid rgba(255,255,255,0.07)', textAlign: 'center' }}>
        <p style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '0.14em', margin: '0 0 8px' }}>
          Adivinhe a palavra
        </p>
        <p style={{ fontSize: 16, fontWeight: 600, color: 'rgba(255,255,255,0.8)', margin: 0, lineHeight: 1.4, wordBreak: 'break-word' }}>
          💡 {data.clue || '…'}
        </p>
      </div>

      {/* Grid */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5, padding: '20px 16px 16px' }}>
        {grid.map((row, rowIdx) => (
          <div
            key={rowIdx}
            data-shake={shakeRow === rowIdx ? 'true' : 'false'}
            style={{ display: 'flex', gap: 5 }}
          >
            {row.map((tile, colIdx) => (
              <div
                key={colIdx}
                style={{
                  width: cellSize, height: cellSize,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: tileBg(tile.result, tile.letter),
                  border: tileBorder(tile.result, tile.letter),
                  borderRadius: 8,
                  fontSize, fontWeight: 800,
                  color: C.text,
                  transition: 'background 0.25s, border 0.25s',
                  letterSpacing: '0.02em',
                }}
              >
                {tile.letter}
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* Won */}
      {gameState === 'won' && (
        <div style={{ padding: '0 16px 20px' }}>
          <div style={{ background: '#14532D', borderRadius: 16, padding: '22px 18px', textAlign: 'center' }}>
            <p style={{ fontSize: 32, margin: '0 0 10px' }}>🎉</p>
            <p style={{ fontSize: 12, fontWeight: 700, color: '#4ADE80', textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 10px' }}>
              Você acertou!
            </p>
            <p style={{ fontSize: 17, fontWeight: 700, color: C.text, margin: 0, lineHeight: 1.5, wordBreak: 'break-word' }}>
              {data.winMessage || '❤️'}
            </p>
          </div>
        </div>
      )}

      {/* Lost */}
      {gameState === 'lost' && (
        <div style={{ padding: '0 16px 20px' }}>
          <div style={{ background: '#1C1917', borderRadius: 16, padding: '22px 18px', textAlign: 'center' }}>
            <p style={{ fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 10px' }}>
              A palavra era
            </p>
            <p style={{ fontSize: 28, fontWeight: 900, color: C.text, letterSpacing: '0.18em', margin: 0 }}>
              {word}
            </p>
          </div>
        </div>
      )}

      {/* Keyboard */}
      {gameState === 'playing' && (
        <div style={{ padding: '4px 8px 24px', display: 'flex', flexDirection: 'column', gap: 6 }}>
          {ROWS.map((row, ri) => (
            <div key={ri} style={{ display: 'flex', justifyContent: 'center', gap: 5 }}>
              {row.map(key => {
                const res = key.length === 1 ? keyColors.get(key) : undefined;
                const bg  = res ? C[res] : C.key;
                return (
                  <button
                    key={key}
                    onClick={() => handleKey(key === '⌫' ? 'BACKSPACE' : key)}
                    style={{
                      height: 48,
                      minWidth: key.length > 1 ? 54 : 33,
                      padding: '0 3px',
                      background: bg,
                      border: 'none', borderRadius: 6,
                      color: C.text,
                      fontSize: key.length > 1 ? 10 : 15,
                      fontWeight: 700,
                      cursor: 'pointer',
                      transition: 'background 0.2s',
                      flexShrink: 0,
                    }}
                  >
                    {key}
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      )}

      {/* Shake animation */}
      <style>{`
        [data-shake="true"] {
          animation: wordle-shake 0.45s ease;
        }
        @keyframes wordle-shake {
          0%,100% { transform: translateX(0); }
          20%      { transform: translateX(-8px); }
          40%      { transform: translateX(8px); }
          60%      { transform: translateX(-5px); }
          80%      { transform: translateX(5px); }
        }
      `}</style>
    </div>
  );
}
