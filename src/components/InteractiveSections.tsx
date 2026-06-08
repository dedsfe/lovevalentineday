'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  Heart, 
  Volume2, 
  VolumeX, 
  Music, 
  Calendar, 
  Sparkles, 
  ChevronLeft, 
  ChevronRight, 
  HelpCircle, 
  RotateCcw,
  ArrowRight,
  Gift,
  MapPin,
  Map
} from 'lucide-react';

interface GalleryImage {
  photo: string;
  title?: string;
  caption?: string;
}

interface WorldMapLocation {
  placeName: string;
  date: string;
  photo: string;
  polaroidText: string;
  locationNickname: string;
  description: string;
}

/* =========================================================================
   GALERIA: Stories Layout View Component
   ========================================================================= */
export function StoriesView({ images }: { images: GalleryImage[] }) {
  const [index, setIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (images.length === 0) return;
    if (isPaused) return;

    const timer = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          setIndex(idx => (idx + 1) % images.length);
          return 0;
        }
        return prev + 1;
      });
    }, 45); // ~4.5 seconds per story

    return () => clearInterval(timer);
  }, [isPaused, index, images.length]);

  if (images.length === 0) {
    return (
      <div className="rounded-[2.5rem] border-2 border-black bg-slate-900 p-8 text-center text-white/50 text-xs">
        Nenhuma foto adicionada ainda.
      </div>
    );
  }

  const handleNext = () => {
    setProgress(0);
    setIndex(idx => (idx + 1) % images.length);
  };

  const handlePrev = () => {
    setProgress(0);
    setIndex(idx => (idx - 1 + images.length) % images.length);
  };

  const currentImg = images[index];

  return (
    <div className="rounded-[2.5rem] border-2 border-black bg-slate-900 p-3 sm:p-4 shadow-xl select-none h-[420px] sm:h-[550px] flex flex-col justify-between relative overflow-hidden">
      
      {/* Progress Bars */}
      <div className="absolute top-4 inset-x-4 z-20 flex gap-1.5">
        {images.map((_, i) => (
          <div key={i} className="h-1 flex-1 rounded bg-white/20 overflow-hidden">
            <div 
              className="h-full bg-white transition-all duration-75"
              style={{ 
                width: i < index ? '100%' : i === index ? `${progress}%` : '0%',
                transitionTimingFunction: 'linear'
              }}
            />
          </div>
        ))}
      </div>

      {/* Image container */}
      <div 
        className="w-full h-full relative border-2 border-black rounded-[1.8rem] overflow-hidden bg-slate-950 mt-4 cursor-pointer"
        onMouseDown={() => setIsPaused(true)}
        onMouseUp={() => setIsPaused(false)}
        onTouchStart={() => setIsPaused(true)}
        onTouchEnd={() => setIsPaused(false)}
      >
        {currentImg.photo ? (
          <img src={currentImg.photo} alt={currentImg.title || 'Foto'} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-zinc-800 text-white/20">
            <MapPin className="h-12 w-12" />
          </div>
        )}
        
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent z-10" />

        {/* Navigation Overlays */}
        <div className="absolute inset-y-0 left-0 w-1/4 z-20" onClick={handlePrev} />
        <div className="absolute inset-y-0 right-0 w-1/4 z-20" onClick={handleNext} />

        {/* Text descriptions */}
        <div className="absolute bottom-6 inset-x-6 z-20 text-white">
          {currentImg.title && (
            <h3 className="text-sm font-bold mb-1">{currentImg.title}</h3>
          )}
          {currentImg.caption && (
            <p className="text-[10px] sm:text-xs text-slate-200 leading-relaxed font-medium">{currentImg.caption}</p>
          )}
        </div>
      </div>
    </div>
  );
}

/* =========================================================================
   GALERIA: Cards Layout View Component
   ========================================================================= */
export function CardsView({ images }: { images: GalleryImage[] }) {
  const [index, setIndex] = useState(0);

  if (images.length === 0) {
    return (
      <div className="rounded-[2.5rem] border-2 border-black bg-white p-8 text-center text-slate-400 text-xs">
        Nenhuma foto adicionada ainda.
      </div>
    );
  }

  const handleNext = () => {
    setIndex(idx => (idx + 1) % images.length);
  };

  const handlePrev = () => {
    setIndex(idx => (idx - 1 + images.length) % images.length);
  };

  const currentImg = images[index];

  return (
    <div className="rounded-[2.5rem] border-2 border-black bg-white p-4 shadow-xl relative select-none">
      
      {/* Cards stack visualization */}
      <div className="relative h-60 sm:h-80 w-full rounded-2xl border-2 border-black overflow-hidden bg-slate-50 shadow-inner">
        {currentImg.photo ? (
          <img src={currentImg.photo} alt={currentImg.title || 'Foto'} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-zinc-100 text-slate-300">
            <MapPin className="h-12 w-12" />
          </div>
        )}
        
        {/* Navigation arrows inside card */}
        <button 
          onClick={handlePrev}
          className="absolute left-3 top-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-full border-2 border-black bg-white/80 hover:bg-white active:scale-90 shadow"
        >
          <ChevronLeft className="h-4 w-4 text-black" />
        </button>
        <button 
          onClick={handleNext}
          className="absolute right-3 top-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-full border-2 border-black bg-white/80 hover:bg-white active:scale-90 shadow"
        >
          <ChevronRight className="h-4 w-4 text-black" />
        </button>

        {/* Image Counter Badge */}
        <div className="absolute bottom-3 right-3 rounded-full bg-black/60 px-2 py-0.5 text-[9px] font-bold text-white">
          {index + 1} de {images.length}
        </div>
      </div>

      {/* Card Info Details */}
      {(currentImg.title || currentImg.caption) && (
        <div className="mt-4 border-t border-slate-100 pt-3 text-center">
          {currentImg.title && (
            <h3 className="text-xs font-bold text-slate-800">{currentImg.title}</h3>
          )}
          {currentImg.caption && (
            <p className="mt-0.5 text-[10px] text-slate-500 font-medium">{currentImg.caption}</p>
          )}
        </div>
      )}
    </div>
  );
}

/* =========================================================================
   MAPA ESTELAR: Mock Celestial Sphere SVG
   ========================================================================= */
export function StarMapMock({ date, city }: { date: string; city: string }) {
  const seed = (date + city).split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const random = (s: number) => {
    const x = Math.sin(s) * 10000;
    return x - Math.floor(x);
  };

  const stars = Array.from({ length: 60 }).map((_, i) => ({
    x: 100 + Math.cos(i) * 80 * random(seed + i),
    y: 100 + Math.sin(i) * 80 * random(seed * i),
    r: 0.5 + random(seed + i * 2) * 1.5
  }));

  const lines = Array.from({ length: 5 }).map((_, i) => {
    const s1 = stars[Math.floor(random(seed + i) * stars.length)];
    const s2 = stars[Math.floor(random(seed + i + 10) * stars.length)];
    return { x1: s1.x, y1: s1.y, x2: s2.x, y2: s2.y };
  });

  return (
    <div className="mx-auto h-56 w-56 sm:h-64 sm:w-64 rounded-full border-4 border-black bg-gradient-to-b from-[#0F172A] to-[#1E293B] shadow-2xl relative overflow-hidden flex items-center justify-center">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(244,63,94,0.15)_0%,transparent_60%)] animate-pulse" />
      
      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 200 200">
        <circle cx="100" cy="100" r="90" stroke="rgba(255,255,255,0.06)" strokeWidth="1" fill="none" />
        <circle cx="100" cy="100" r="70" stroke="rgba(255,255,255,0.04)" strokeWidth="1" fill="none" strokeDasharray="3 3" />
        <circle cx="100" cy="100" r="50" stroke="rgba(255,255,255,0.05)" strokeWidth="1" fill="none" />

        {lines.map((line, idx) => (
          <line 
            key={idx} 
            x1={line.x1} 
            y1={line.y1} 
            x2={line.x2} 
            y2={line.y2} 
            stroke="rgba(255,255,255,0.2)" 
            strokeWidth="0.5" 
            strokeDasharray="2 2" 
          />
        ))}

        {stars.map((star, idx) => (
          <circle 
            key={idx} 
            cx={star.x} 
            cy={star.y} 
            r={star.r} 
            fill="#fff" 
            opacity={0.4 + random(seed + idx) * 0.6}
            className="animate-pulse"
          />
        ))}

        {/* Moon */}
        <path 
          d="M140,60 A10,10 0 1,0 150,70 A8,8 0 1,1 140,60 Z" 
          fill="#FFFBEB" 
          opacity="0.85" 
        />
      </svg>
      
      <div className="absolute top-1.5 text-[7px] font-black text-white/30 tracking-widest">N</div>
      <div className="absolute bottom-1.5 text-[7px] font-black text-white/30 tracking-widest">S</div>
      <div className="absolute left-1.5 text-[7px] font-black text-white/30 tracking-widest">W</div>
      <div className="absolute right-1.5 text-[7px] font-black text-white/30 tracking-widest">E</div>
    </div>
  );
}

/* =========================================================================
   MAPA DE VIAGENS (Nossa Jornada) Component
   ========================================================================= */
interface WorldMapVisualizerProps {
  title: string;
  subtitle: string;
  locations: WorldMapLocation[];
}

export function WorldMapVisualizer({ title, subtitle, locations }: WorldMapVisualizerProps) {
  const [selectedIdx, setSelectedIdx] = useState(0);

  const getCoordinates = (placeName: string, index: number) => {
    const seed = placeName.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) + index;
    const x = 15 + (seed % 65);
    const y = 20 + ((seed * 7) % 55);
    return { x, y };
  };

  if (locations.length === 0) {
    return (
      <div className="rounded-[2.5rem] border-2 border-black bg-white p-8 text-center text-slate-400 text-xs">
        Nenhum local de viagem configurado ainda.
      </div>
    );
  }

  const selectedLoc = locations[selectedIdx] || locations[0];

  return (
    <div className="rounded-[2.5rem] border-2 border-b-[6px] border-black bg-white p-4 shadow-xl select-none">
      
      <div className="text-center mb-4">
        <h3 className="font-extrabold text-sm text-slate-800">{title}</h3>
        <p className="text-[10px] text-slate-500 font-medium">{subtitle}</p>
      </div>

      <div className="relative h-36 w-full bg-rose-50 border-2 border-black rounded-2xl overflow-hidden shadow-inner mb-4">
        <div className="absolute inset-0 grid grid-cols-6 grid-rows-4 opacity-10 pointer-events-none">
          {Array.from({ length: 24 }).map((_, i) => (
            <div key={i} className="border border-dashed border-rose-950" />
          ))}
        </div>

        {locations.map((loc, idx) => {
          if (!loc.placeName) return null;
          const { x, y } = getCoordinates(loc.placeName, idx);
          const isSelected = idx === selectedIdx;
          
          return (
            <button
              key={idx}
              onClick={() => setSelectedIdx(idx)}
              style={{ left: `${x}%`, top: `${y}%` }}
              className={`absolute -translate-x-1/2 -translate-y-1/2 flex items-center justify-center p-1 rounded-full border border-black transition-all ${
                isSelected 
                  ? 'bg-rose-600 text-white scale-125 z-20 shadow' 
                  : 'bg-white text-rose-600 hover:scale-110 z-10'
              }`}
            >
              <MapPin className="h-3.5 w-3.5" />
            </button>
          );
        })}

        <div className="absolute bottom-2 left-2 bg-white/75 border border-black/10 rounded py-0.5 px-1.5 text-[8px] font-black text-slate-500">
          MAPA JORNADA
        </div>
      </div>

      {selectedLoc && (
        <div className="mx-auto max-w-[240px] bg-white border-2 border-black rounded-2xl p-2.5 shadow shadow-black flex flex-col items-center">
          <div className="w-full h-32 border border-black rounded-lg overflow-hidden bg-slate-100 relative">
            {selectedLoc.photo ? (
              <img src={selectedLoc.photo} alt={selectedLoc.placeName} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-rose-50 flex items-center justify-center">
                <Map className="h-8 w-8 text-rose-200" />
              </div>
            )}
            <span className="absolute bottom-2 left-2 bg-rose-600 text-white border border-black font-bold text-[8px] px-2 py-0.5 rounded shadow-sm">
              {new Date(selectedLoc.date || new Date()).toLocaleDateString('pt-BR')}
            </span>
          </div>

          <div className="w-full pt-2 text-center">
            <span className="text-[8px] font-black text-rose-600 tracking-widest uppercase">
              {selectedLoc.locationNickname || 'Nossa Viagem'}
            </span>
            <h4 className="font-extrabold text-xs text-slate-800 truncate mt-0.5">{selectedLoc.placeName}</h4>
            <p className="text-[9px] text-slate-600 mt-1 leading-relaxed italic truncate max-w-[200px]">
              "{selectedLoc.description || 'Um momento marcante...'}"
            </p>
          </div>
        </div>
      )}

      {/* Selectors */}
      <div className="mt-4 flex flex-wrap gap-1.5 justify-center border-t border-slate-100 pt-3">
        {locations.map((loc, idx) => {
          if (!loc.placeName) return null;
          return (
            <button
              key={idx}
              onClick={() => setSelectedIdx(idx)}
              className={`px-2 py-1 text-[9px] font-bold rounded-lg border transition-all ${
                idx === selectedIdx 
                  ? 'bg-rose-600 text-white border-black shadow' 
                  : 'bg-white text-slate-700 border-slate-200'
              }`}
            >
              {loc.placeName}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* =========================================================================
   WORDLE GAME: Mini Guess Wordle Game Component
   ========================================================================= */
interface WordleGameProps {
  word: string;
  clue: string;
  winMessage: string;
  giverName: string;
}

export function WordleGame({ word, clue, winMessage, giverName }: WordleGameProps) {
  const secret = (word || 'AMOR').trim().toUpperCase();
  const wordLength = secret.length;
  
  const [guesses, setGuesses] = useState<string[]>(Array(6).fill(''));
  const [currentGuess, setCurrentGuess] = useState('');
  const [activeRow, setActiveRow] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [isWin, setIsWin] = useState(false);
  const [shakeRow, setShakeRow] = useState<number | null>(null);

  const handleKeyPress = (char: string) => {
    if (gameOver) return;
    if (char === 'ENTER') {
      if (currentGuess.length < wordLength) {
        setShakeRow(activeRow);
        setTimeout(() => setShakeRow(null), 500);
        return;
      }
      
      const newGuesses = [...guesses];
      newGuesses[activeRow] = currentGuess;
      setGuesses(newGuesses);
      
      if (currentGuess === secret) {
        setIsWin(true);
        setGameOver(true);
      } else if (activeRow >= 5) {
        setGameOver(true);
      } else {
        setActiveRow(prev => prev + 1);
        setCurrentGuess('');
      }
      return;
    }

    if (char === 'BACKSPACE') {
      setCurrentGuess(prev => prev.slice(0, -1));
      return;
    }

    if (currentGuess.length < wordLength && /^[a-zA-ZÇç]$/.test(char)) {
      setCurrentGuess(prev => prev + char.toUpperCase());
    }
  };

  // Virtual keyboard
  const keyboardRows = [
    ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
    ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', 'Ç'],
    ['ENTER', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', 'BACKSPACE']
  ];

  const getLetterClass = (guess: string, index: number) => {
    const letter = guess[index];
    if (secret[index] === letter) {
      return 'bg-emerald-500 text-white border-emerald-600 scale-102';
    }
    if (secret.includes(letter)) {
      return 'bg-amber-400 text-white border-amber-500';
    }
    return 'bg-slate-400 text-white border-slate-500';
  };

  return (
    <div className="rounded-[2.5rem] border-2 border-b-[6px] border-black bg-white p-4 shadow-xl relative select-none">
      
      <div className="mb-4 rounded-xl bg-rose-50 border border-rose-100 p-3 text-center">
        <span className="text-[8px] font-black text-rose-500 tracking-wider uppercase">DICA</span>
        <h3 className="text-xs font-bold mt-0.5 text-slate-800 leading-snug">{clue}</h3>
      </div>

      {/* Grid of inputs */}
      <div className="grid gap-1.5 mb-4 justify-center mx-auto" style={{ maxWidth: '280px' }}>
        {guesses.map((guess, rIndex) => {
          const isCurrent = rIndex === activeRow;
          const displayStr = isCurrent ? currentGuess.padEnd(wordLength, ' ') : guess.padEnd(wordLength, ' ');
          const isShaking = shakeRow === rIndex;

          return (
            <div 
              key={rIndex} 
              className={`flex gap-1 justify-center ${isShaking ? 'animate-shake' : ''}`}
            >
              {Array.from({ length: wordLength }).map((_, cIndex) => {
                const char = displayStr[cIndex];
                const hasGuessed = rIndex < activeRow || (gameOver && rIndex === activeRow && guesses[rIndex]);
                
                return (
                  <div
                    key={cIndex}
                    className={`flex h-8 w-8 items-center justify-center rounded-lg border-2 font-black text-sm transition-all duration-300 ${
                      hasGuessed
                        ? getLetterClass(guesses[rIndex], cIndex)
                        : char && char !== ' '
                        ? 'border-black bg-white scale-105 shadow'
                        : 'border-slate-200 bg-white'
                    }`}
                  >
                    {char !== ' ' ? char : ''}
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>

      {/* Virtual Keyboard */}
      <div className="flex flex-col gap-1 items-center">
        {keyboardRows.map((row, rIdx) => (
          <div key={rIdx} className="flex gap-0.5 justify-center w-full">
            {row.map(key => {
              const isAction = key === 'ENTER' || key === 'BACKSPACE';
              return (
                <button
                  key={key}
                  onClick={() => handleKeyPress(key)}
                  className={`flex h-8 items-center justify-center rounded border border-slate-200 font-bold text-[9px] uppercase transition-all active:scale-95 shadow-sm ${
                    isAction 
                      ? 'px-1 bg-slate-100 hover:bg-slate-200 text-[8px]' 
                      : 'w-6 bg-white hover:bg-slate-50'
                  }`}
                >
                  {key === 'BACKSPACE' ? 'DEL' : key}
                </button>
              );
            })}
          </div>
        ))}
      </div>

      {gameOver && (
        <div className="absolute inset-0 z-30 flex flex-col items-center justify-center rounded-[2.5rem] bg-black/85 backdrop-blur-sm p-4 text-center text-white">
          {isWin ? (
            <div className="max-w-[220px] flex flex-col items-center">
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500 text-white shadow border border-white">
                <Sparkles className="h-5 w-5" />
              </div>
              <h3 className="text-xs font-black mb-2">Mensagem Desbloqueada! 🎉</h3>
              <p className="text-rose-100 font-medium text-[9px] mb-4 leading-normal bg-rose-600/30 border border-rose-500/30 rounded-xl p-3">
                "{winMessage}"
              </p>
              <button 
                onClick={() => setGameOver(false)}
                className="rounded-lg border border-black bg-emerald-500 px-4 py-1.5 font-bold text-[10px] text-white hover:bg-emerald-600"
              >
                Ler
              </button>
            </div>
          ) : (
            <div className="max-w-[220px] flex flex-col items-center">
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-rose-600 text-white shadow border border-white">
                <HelpCircle className="h-5 w-5" />
              </div>
              <h3 className="text-xs font-bold mb-1">Quase lá!</h3>
              <p className="text-rose-100 font-medium text-[9px] mb-4">A palavra era {secret}.</p>
              <button 
                onClick={() => {
                  setGuesses(Array(6).fill(''));
                  setCurrentGuess('');
                  setActiveRow(0);
                  setGameOver(false);
                  setIsWin(false);
                }}
                className="flex items-center gap-1 rounded-lg border border-black bg-rose-600 px-4 py-1.5 font-bold text-[10px] text-white hover:bg-rose-700"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                Recomeçar
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* =========================================================================
   ROLETA SURPRESA: Spin Wheel Component
   ========================================================================= */
export function RouletteWheel({ title, options }: { title: string; options: string[] }) {
  const [isSpinning, setIsSpinning] = useState(false);
  const [prize, setPrize] = useState<string | null>(null);
  const [rotation, setRotation] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const colors = [
    '#FFE4E6', // rose-100
    '#FECDD3', // rose-200
    '#FDA4AF', // rose-300
    '#F43F5E', // rose-500
    '#E11D48', // rose-600
    '#BE123C', // rose-700
  ];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const size = canvas.width;
    const center = size / 2;
    const radius = center - 6;
    const totalSegments = options.length;
    const arc = (2 * Math.PI) / totalSegments;

    ctx.clearRect(0, 0, size, size);

    options.forEach((opt, idx) => {
      const angle = idx * arc;
      ctx.beginPath();
      ctx.fillStyle = colors[idx % colors.length];
      ctx.moveTo(center, center);
      ctx.arc(center, center, radius, angle, angle + arc);
      ctx.lineTo(center, center);
      ctx.fill();

      ctx.save();
      ctx.fillStyle = idx % colors.length >= 3 ? '#ffffff' : '#2D2638';
      ctx.font = 'bold 9px sans-serif';
      ctx.translate(center, center);
      ctx.rotate(angle + arc / 2);
      
      const textX = radius / 2.2;
      ctx.fillText(opt.substring(0, 10), textX, 3);
      ctx.restore();
    });

    ctx.beginPath();
    ctx.arc(center, center, radius, 0, 2 * Math.PI);
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 3;
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(center, center, 10, 0, 2 * Math.PI);
    ctx.fillStyle = '#ffffff';
    ctx.fill();
    ctx.stroke();

  }, [options]);

  const spinWheel = () => {
    if (isSpinning) return;
    setIsSpinning(true);
    setPrize(null);

    const segmentsCount = options.length;
    const segmentArc = 360 / segmentsCount;
    const targetIdx = Math.floor(Math.random() * segmentsCount);
    
    const extraSpins = 5 + Math.floor(Math.random() * 3);
    const targetAngle = 270 - (targetIdx * segmentArc) - (segmentArc / 2);
    const finalRotation = (extraSpins * 360) + targetAngle;

    setRotation(finalRotation);

    setTimeout(() => {
      setIsSpinning(false);
      setPrize(options[targetIdx]);
    }, 4000);
  };

  return (
    <div className="rounded-[2.5rem] border-2 border-b-[6px] border-black bg-white p-4 shadow-xl text-center relative overflow-hidden select-none">
      <h3 className="text-xs font-bold text-slate-800 mb-4 uppercase tracking-wider">
        {title}
      </h3>

      <div className="relative mx-auto flex h-56 w-56 flex-col items-center justify-center">
        <div className="absolute top-0 z-20 h-0 w-0 border-l-[6px] border-r-[6px] border-t-[14px] border-l-transparent border-r-transparent border-t-black" />

        <div 
          style={{ 
            transform: `rotate(${rotation}deg)`,
            transition: isSpinning ? 'transform 4s cubic-bezier(0.2, 0.8, 0.2, 1)' : 'none'
          }}
          className="h-full w-full"
        >
          <canvas ref={canvasRef} width="224" height="224" className="h-full w-full" />
        </div>

        <button
          onClick={spinWheel}
          disabled={isSpinning}
          className="absolute z-20 flex h-10 w-10 items-center justify-center rounded-full border border-black bg-rose-600 font-extrabold text-white text-[8px] uppercase shadow disabled:opacity-50"
        >
          GIRAR
        </button>
      </div>

      {prize && (
        <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-black/85 backdrop-blur-sm p-4 text-center text-white">
          <div className="max-w-[200px] flex flex-col items-center">
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-rose-600 text-white shadow border border-white">
              <Gift className="h-5 w-5" />
            </div>
            <span className="text-[8px] font-black text-rose-400 tracking-wider uppercase">RESULTADO</span>
            <h3 className="text-sm font-black mb-3">{prize}! 🎉</h3>
            <button 
              onClick={() => setPrize(null)}
              className="rounded-lg border border-black bg-rose-600 px-4 py-1.5 font-bold text-[10px] text-white hover:bg-rose-700"
            >
              Fechar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
