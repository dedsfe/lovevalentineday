"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Shuffle,
  Repeat,
  ChevronDown,
  MoreHorizontal,
  Check,
  Music,
  Heart,
  Calendar,
  MapPin,
} from "lucide-react";
import { SpotifyProductProps, LovePlayerImage } from "./SpotifyProduct.types";

const DEFAULT_COVER =
  "https://images.unsplash.com/photo-1518199266791-5375a83164ba?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80";

function pad(n: number) {
  return String(n).padStart(2, "0");
}

/* ── Collage Grid Helper ────────────────────────────────────────────────── */
function ImageCollage({ images }: { images: LovePlayerImage[] }) {
  const len = images.length;
  if (len === 0) {
    return (
      <div className="w-full h-full bg-rose-950/20 flex items-center justify-center">
        <Heart className="h-12 w-12 text-rose-500/40 animate-pulse" />
      </div>
    );
  }

  if (len === 1) {
    return (
      <img
        src={images[0].url}
        alt={images[0].alt || "Foto do casal"}
        className="w-full h-full object-cover transition-all duration-500 hover:scale-105"
      />
    );
  }

  if (len === 2) {
    return (
      <div className="flex w-full h-full gap-0.5">
        <img src={images[0].url} alt={images[0].alt} className="w-1/2 h-full object-cover" />
        <img src={images[1].url} alt={images[1].alt} className="w-1/2 h-full object-cover" />
      </div>
    );
  }

  if (len === 3) {
    return (
      <div className="flex w-full h-full gap-0.5">
        <img src={images[0].url} alt={images[0].alt} className="w-1/2 h-full object-cover" />
        <div className="flex flex-col w-1/2 h-full gap-0.5">
          <img src={images[1].url} alt={images[1].alt} className="h-1/2 w-full object-cover" />
          <img src={images[2].url} alt={images[2].alt} className="h-1/2 w-full object-cover" />
        </div>
      </div>
    );
  }

  if (len === 4) {
    return (
      <div className="grid grid-cols-2 grid-rows-2 w-full h-full gap-0.5">
        <img src={images[0].url} alt={images[0].alt} className="w-full h-full object-cover" />
        <img src={images[1].url} alt={images[1].alt} className="w-full h-full object-cover" />
        <img src={images[2].url} alt={images[2].alt} className="w-full h-full object-cover" />
        <img src={images[3].url} alt={images[3].alt} className="w-full h-full object-cover" />
      </div>
    );
  }

  if (len === 5) {
    return (
      <div className="flex w-full h-full gap-0.5">
        <img src={images[0].url} alt={images[0].alt} className="w-[60%] h-full object-cover" />
        <div className="grid grid-cols-2 grid-rows-2 w-[40%] h-full gap-0.5">
          <img src={images[1].url} alt={images[1].alt} className="w-full h-full object-cover" />
          <img src={images[2].url} alt={images[2].alt} className="w-full h-full object-cover" />
          <img src={images[3].url} alt={images[3].alt} className="w-full h-full object-cover" />
          <img src={images[4].url} alt={images[4].alt} className="w-full h-full object-cover" />
        </div>
      </div>
    );
  }

  // 6 or more images (mosaic)
  return (
    <div className="grid grid-cols-3 grid-rows-2 w-full h-full gap-0.5">
      {images.slice(0, 6).map((img, i) => (
        <img
          key={img.id || i}
          src={img.url}
          alt={img.alt || `Capa ${i + 1}`}
          className="w-full h-full object-cover"
        />
      ))}
    </div>
  );
}

/* ── Primary Component ──────────────────────────────────────────────────── */
export function SpotifyProduct({ data, compact = false }: SpotifyProductProps) {
  const {
    partnerOneName,
    partnerTwoName,
    relationshipDate,
    city,
    giftTitle,
    selectedMusic,
    coverImages = [],
    specialMessage,
    memoryImage,
  } = data;

  const startDate = useMemo(() => {
    const d = new Date(relationshipDate);
    if (isNaN(d.getTime())) {
      const parts = relationshipDate.split("-");
      if (parts.length === 3) {
        return new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
      }
    }
    return d;
  }, [relationshipDate]);

  // Player controls
  const [isPlaying, setIsPlaying] = useState(true);
  const [isLiked, setIsLiked] = useState(true);
  const [elapsedOffset, setElapsedOffset] = useState(0);
  const [timerBase, setTimerBase] = useState(() => Date.now());

  // Accumulate elapsed time only when active
  useEffect(() => {
    if (!isPlaying) {
      // Frozen: Save offset
      return;
    }
    const interval = setInterval(() => {
      setElapsedOffset((prev) => prev + 1000);
    }, 1000);
    return () => clearInterval(interval);
  }, [isPlaying]);

  const totalElapsedMs = useMemo(() => {
    const staticDiff = Date.now() - startDate.getTime();
    // If we've paused, it freezes the time delta.
    return staticDiff > 0 ? staticDiff : 0;
  }, [startDate, elapsedOffset]); // elapsedOffset is tracked to trigger recalculation

  // Calculate standard time fields
  const totalSeconds = Math.floor(totalElapsedMs / 1000);
  const years = Math.floor(totalSeconds / (365.25 * 24 * 3600));
  const months = Math.floor((totalSeconds % (365.25 * 24 * 3600)) / (30.44 * 24 * 3600));
  const days = Math.floor(
    ((totalSeconds % (365.25 * 24 * 3600)) % (30.44 * 24 * 3600)) / (24 * 3600)
  );
  const hours = Math.floor((totalSeconds % (24 * 3600)) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  // Synced lyrics highlight cycle (changes every 5 seconds)
  const lyrics = [
    "Desde o primeiro olhar, eu já sabia.",
    "Seu sorriso é a minha melodia favorita.",
    "Construindo uma linda história dia após dia.",
    "E cada segundo ao seu lado vale a pena.",
    "Prometo te amar, hoje, amanhã e sempre."
  ];

  const lyricIndex = useMemo(() => {
    return Math.floor(totalSeconds / 5) % lyrics.length;
  }, [totalSeconds]);

  // Seekbar progress bar cycling 60 seconds
  const progressPercent = (seconds / 60) * 100;

  return (
    <div
      className={`relative w-full flex flex-col items-center bg-[#0d0d0d] text-white select-none transition-all duration-500 ${
        compact
          ? "rounded-[3rem] border-[10px] border-[#1f1f1f] p-4 text-[10px] w-[320px] h-[660px] overflow-y-auto scrollbar-hide shadow-2xl"
          : "min-h-screen py-12 px-4"
      }`}
    >
      {/* ── Background Burgundy-to-Black Theme Gradient ── */}
      <div
        className="absolute inset-0 z-0 pointer-events-none"
        style={{
          background: "linear-gradient(180deg, rgba(74,4,4,0.45) 0%, rgba(13,13,13,1) 50%)",
        }}
      />

      <div className={`relative z-10 w-full flex flex-col ${compact ? "gap-4" : "max-w-md gap-7"}`}>
        {/* ── Top Bar ── */}
        <div className="flex items-center justify-between w-full text-white/50 px-1">
          <ChevronDown className={compact ? "h-4 w-4" : "h-5 w-5"} />
          <span className={`font-black uppercase tracking-widest text-center ${compact ? "text-[8px]" : "text-[10px]"}`}>
            {partnerOneName} & {partnerTwoName}
          </span>
          <MoreHorizontal className={compact ? "h-4 w-4" : "h-5 w-5"} />
        </div>

        {/* ── Cover Photo Collage ── */}
        <div className="flex justify-center w-full">
          <div
            className={`aspect-square w-full rounded-[2.5rem] border-2 border-white/5 overflow-hidden shadow-[0_20px_40px_rgba(0,0,0,0.8)] relative bg-zinc-900 ${
              compact ? "max-w-[220px]" : "max-w-[340px]"
            }`}
          >
            <ImageCollage images={coverImages} />
          </div>
        </div>

        {/* ── Song metadata & Love title ── */}
        <div className="flex items-start justify-between w-full px-2">
          <div className="min-w-0 flex-1 pr-4">
            <h2 className={`font-black truncate text-white tracking-tight leading-tight ${compact ? "text-sm" : "text-xl"}`}>
              {giftTitle || "O som da nossa história"}
            </h2>
            <div className="flex items-center gap-1.5 mt-1">
              <span className="flex h-4 w-4 items-center justify-center rounded-full bg-[#E0A96D] text-black">
                <Check className="h-2.5 w-2.5 text-black" strokeWidth={4} />
              </span>
              <span className="truncate text-white/60 font-bold uppercase tracking-wider text-[9px] sm:text-[11px]">
                {selectedMusic.title} • {selectedMusic.artist}
              </span>
            </div>
          </div>
          <button
            onClick={() => setIsLiked(!isLiked)}
            className="flex-shrink-0 cursor-pointer transition-transform active:scale-90 mt-1"
          >
            <Heart
              className={`${compact ? "h-5 w-5" : "h-6 w-6"} ${
                isLiked ? "text-[#E0A96D] fill-current" : "text-white/40"
              }`}
            />
          </button>
        </div>

        {/* ── Seekbar ── */}
        <div className="w-full px-2">
          <div className={`w-full bg-white/10 rounded-full overflow-hidden ${compact ? "h-[3px]" : "h-1"}`}>
            <div
              className="h-full bg-white rounded-full transition-all duration-1000 ease-linear"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <div className="flex justify-between mt-1 text-[8px] sm:text-[10px] font-bold text-white/40">
            <span>0:{pad(seconds)}</span>
            <span>-0:{pad(60 - seconds)}</span>
          </div>
        </div>

        {/* ── Controls ── */}
        <div className="flex items-center justify-between w-full px-4">
          <Shuffle className={`text-white/30 cursor-pointer hover:text-white ${compact ? "h-4 w-4" : "h-5 w-5"}`} />
          <SkipBack className={`text-white cursor-pointer hover:scale-105 ${compact ? "h-5 w-5" : "h-7 w-7"}`} fill="currentColor" />
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className={`flex items-center justify-center rounded-full bg-white text-black shadow-lg transition-transform active:scale-95 cursor-pointer ${
              compact ? "h-10 w-10" : "h-14 w-14"
            }`}
          >
            {isPlaying ? (
              <Pause className={compact ? "h-4 w-4" : "h-6 w-6"} fill="black" />
            ) : (
              <Play className={`ml-0.5 ${compact ? "h-4 w-4" : "h-6 w-6"}`} fill="black" />
            )}
          </button>
          <SkipForward className={`text-white cursor-pointer hover:scale-105 ${compact ? "h-5 w-5" : "h-7 w-7"}`} fill="currentColor" />
          <Repeat className={`text-white/30 cursor-pointer hover:text-white ${compact ? "h-4 w-4" : "h-5 w-5"}`} />
        </div>

        {/* ── Lyrics/timer card ── */}
        <div className="w-full rounded-3xl border border-white/[0.03] bg-white/[0.03] backdrop-blur-md p-5 shadow-inner relative overflow-hidden">
          <div className="absolute top-2.5 right-4 text-white/[0.02] font-serif text-6xl select-none font-bold leading-none">
            ,,
          </div>
          <div className="flex items-center gap-1.5 mb-3">
            <Music className="h-4.5 w-4.5 text-[#E0A96D]" />
            <span className="font-black uppercase tracking-wider text-[8px] sm:text-[10px] text-[#E0A96D]">
              Letra da nossa jornada
            </span>
          </div>
          <div className={`space-y-1.5 font-bold tracking-tight leading-snug ${compact ? "text-[9px]" : "text-[13px]"}`}>
            {lyrics.map((line, idx) => {
              const isActive = idx === lyricIndex;
              const isPast = idx < lyricIndex;
              return (
                <p
                  key={idx}
                  className={`transition-all duration-500 ${
                    isActive
                      ? "text-white scale-100 font-extrabold translate-x-1"
                      : isPast
                      ? "text-white/45 scale-95 origin-left"
                      : "text-white/20 scale-90 origin-left"
                  }`}
                >
                  {line}
                </p>
              );
            })}
          </div>
        </div>

        {/* ── "Sobre o Casal" Info Box ── */}
        <div className="w-full rounded-3xl border border-white/[0.03] bg-white/[0.02] backdrop-blur-md p-5 shadow-lg flex flex-col items-center">
          <span className="text-[8px] sm:text-[10px] font-black tracking-widest text-white/30 uppercase mb-4">
            Sobre o casal
          </span>
          <div className="w-full rounded-2xl overflow-hidden border border-white/5 mb-4 aspect-[4/3] bg-zinc-950 relative shadow-inner">
            <ImageCollage images={coverImages} />
          </div>
          <h3 className={`font-black text-center text-white ${compact ? "text-xs" : "text-base"}`}>
            {partnerOneName} & {partnerTwoName}
          </h3>
          <p className="text-[9px] font-bold text-white/40 flex items-center gap-1 mt-1.5 mb-5 uppercase tracking-wider">
            <MapPin className="h-3.5 w-3.5 text-[#E0A96D]" />
            {city} • Juntos desde {new Date(relationshipDate).getFullYear()}
          </p>

          <span className="text-[9px] font-black tracking-widest text-[#E0A96D] uppercase mb-2">
            Juntos há
          </span>
          <h4 className={`font-black text-center text-white leading-none ${compact ? "text-xs" : "text-lg"}`}>
            {years} anos • {months} meses • {days} dias
          </h4>
          <p className="text-[10px] font-bold text-white/50 mt-1.5 tracking-widest tabular-nums">
            {pad(hours)}h : {pad(minutes)}m : {pad(seconds)}s
          </p>
        </div>

        {/* ── Special Message Card ── */}
        {specialMessage && (
          <div className="w-full rounded-3xl p-6 border border-white/[0.05] shadow-2xl text-left relative bg-gradient-to-br from-[#800a0a] to-[#450a0a]">
            <div className="absolute top-3 right-5 text-white/5 font-serif text-7xl select-none leading-none">
              “
            </div>
            <span className="block text-[8px] sm:text-[10px] font-black text-white/50 tracking-wider uppercase mb-2">
              Mensagem especial
            </span>
            <p className={`font-bold leading-relaxed whitespace-pre-line text-white ${compact ? "text-[10px]" : "text-sm"}`}>
              {specialMessage}
            </p>
          </div>
        )}

        {/* ── Memory Image Block ── */}
        {memoryImage?.url && (
          <div className="w-full rounded-3xl border border-white/[0.03] bg-white/[0.02] p-5 shadow-lg flex flex-col items-center">
            <span className="text-[8px] sm:text-[10px] font-black tracking-widest text-white/30 uppercase mb-3.5">
              Uma memória nossa
            </span>
            <div className="w-full rounded-2xl overflow-hidden border border-white/5 bg-zinc-950 shadow-inner mb-3.5">
              <img
                src={memoryImage.url}
                alt={memoryImage.alt || "Nossa memória"}
                className="w-full h-auto object-cover max-h-72"
              />
            </div>
            {memoryImage.alt && (
              <p className="text-[10px] font-bold text-white/60 italic text-center">
                &ldquo;{memoryImage.alt}&rdquo;
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
