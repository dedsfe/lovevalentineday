'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'next/navigation';
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
  Map,
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Shuffle,
  Repeat,
  ChevronDown,
  MoreHorizontal,
  Check
} from 'lucide-react';
import { 
  StoriesView, 
  CardsView, 
  StarMapMock, 
  WorldMapVisualizer, 
  WordleGame, 
  RouletteWheel 
} from '@/components/InteractiveSections';
import { SpotifyProduct, WrappedProduct } from '@/components/products';

// Helper to extract Spotify track ID
function getSpotifyTrackId(url: string): string | null {
  if (!url) return null;
  const match = url.match(/track\/([a-zA-Z0-9]+)/) || url.match(/spotify:track:([a-zA-Z0-9]+)/);
  return match ? match[1] : null;
}

// Trilha sonora romântica de fundo padrão
const DEFAULT_ROMANTIC_TRACK = 'https://assets.mixkit.co/music/preview/mixkit-romantic-ambience-1033.mp3';

interface TimelineEvent {
  date: string;
  title: string;
  description: string;
  photo?: string;
  caption?: string;
}

interface GalleryImage {
  photo: string;
  title?: string;
  caption?: string;
}

interface MeetCard {
  title: string;
  photo: string;
  description: string;
}

interface WorldMapLocation {
  placeName: string;
  date: string;
  photo: string;
  polaroidText: string;
  locationNickname: string;
  description: string;
}

interface GiftData {
  giverName: string;
  receiverName: string;
  date: string;
  time?: string;
  musicTitle?: string;
  musicArtist?: string;
  musicUrl?: string;
  bgPhoto?: string;
  romanticMessage: string;
  counterTopText?: string;
  counterBottomText?: string;
  counterLayout?: 'default' | 'spotify';
  meetCouple?: boolean;
  meetCards?: MeetCard[];
  sections: {
    timeline: boolean;
    imageGallery: boolean;
    starMap: boolean;
    worldMap: boolean;
    wordleGame: boolean;
    roulette: boolean;
  };
  timelineEvents?: TimelineEvent[];
  galleryImages?: GalleryImage[];
  galleryLayout?: 'cards' | 'stories';
  starMapCity?: string;
  worldMapTitle?: string;
  worldMapSubtitle?: string;
  worldMapLocations?: WorldMapLocation[];
  wordleWord?: string;
  wordleClue?: string;
  wordleWinMessage?: string;
  rouletteTitle?: string;
  rouletteOptions?: string[];
}

export default function PresenteVisualizer() {
  const params = useParams();
  const id = params.id as string;
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [gift, setGift] = useState<GiftData | null>(null);
  
  const [hasOpened, setHasOpened] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  
  // Audio ref
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  // Timer state
  const [timeTogether, setTimeTogether] = useState({
    years: 0,
    months: 0,
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  // Carregar dados do presente
  useEffect(() => {
    if (!id) return;
    
    fetch(`/api/gifts?id=${id}`)
      .then(res => {
        if (!res.ok) throw new Error('Presente não encontrado');
        return res.json();
      })
      .then((data: GiftData) => {
        setGift(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setError(true);
        setLoading(false);
      });
  }, [id]);

  // Atualizar contador de tempo juntos
  useEffect(() => {
    if (!gift) return;

    const startDateStr = gift.date;
    const startTimeStr = gift.time || '00:00';
    
    const calculateTime = () => {
      const now = new Date();
      const start = new Date(`${startDateStr}T${startTimeStr}:00`);
      
      if (isNaN(start.getTime())) return;
      
      let diffMs = now.getTime() - start.getTime();
      if (diffMs < 0) diffMs = 0;
      
      const diffSecs = Math.floor(diffMs / 1000);
      const diffMins = Math.floor(diffSecs / 60);
      const diffHours = Math.floor(diffMins / 60);
      
      // Cálculo simplificado de anos, meses, dias
      const years = Math.floor(diffHours / (24 * 365.25));
      const remainingHoursAfterYears = diffHours % (24 * 365.25);
      
      const months = Math.floor(remainingHoursAfterYears / (24 * 30.4375));
      const remainingHoursAfterMonths = remainingHoursAfterYears % (24 * 30.4375);
      
      const days = Math.floor(remainingHoursAfterMonths / 24);
      const hours = Math.floor(remainingHoursAfterMonths % 24);
      const minutes = diffMins % 60;
      const seconds = diffSecs % 60;
      
      setTimeTogether({ years, months, days, hours, minutes, seconds });
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, [gift]);

  const handleOpenPresent = () => {
    setHasOpened(true);
    setIsPlaying(true);
    if (audioRef.current) {
      audioRef.current.play().catch(err => {
        console.log('Autoplay impedido pelo navegador:', err);
        setIsPlaying(false);
      });
    }
  };

  const togglePlayMusic = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().catch(() => {});
      setIsPlaying(true);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-rose-50 px-4 text-center">
        <div className="relative mb-6 flex h-40 w-40 items-center justify-center">
          <img src="/bear/urso-sf.png" alt="Carregando..." className="h-full w-full object-contain animate-bounce" />
        </div>
        <div className="flex items-center gap-2 text-rose-600 font-bold text-xl">
          <Heart className="h-6 w-6 animate-pulse fill-current" />
          Preparando sua surpresa...
        </div>
      </div>
    );
  }

  if (error || !gift) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-rose-50 px-4 text-center">
        <div className="mb-6 h-40 w-40">
          <img src="/bear/urso3-sf.png" alt="Erro" className="h-full w-full object-contain" />
        </div>
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Ops! Presente não encontrado</h2>
        <p className="text-slate-600 max-w-md mb-6">Parece que este link expirou ou o presente digital não existe mais.</p>
        <a href="/" className="rounded-2xl border-2 border-b-[4px] border-black bg-rose-600 px-6 py-3 font-bold text-white transition-all hover:bg-rose-700 active:scale-95">
          Voltar para o Início
        </a>
      </div>
    );
  }

  return (
    <main className={`min-h-screen pb-24 selection:bg-rose-200 transition-all duration-300 ${
      gift.counterLayout === 'spotify' ? 'bg-[#0f0f0f] text-zinc-200' : 'bg-rose-50/50 text-slate-800'
    }`}>
      {/* Audio Element */}
      {!gift.musicUrl?.includes('spotify.com') && (
        <audio 
          ref={audioRef} 
          src={gift.musicUrl || DEFAULT_ROMANTIC_TRACK} 
          loop 
          preload="auto" 
        />
      )}

      {/* 1. Tela de Abertura Overlay */}
      {!hasOpened && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-rose-600 px-4 text-center text-white">
          {/* Corações Flutuantes no Fundo */}
          <div className="absolute top-[20%] left-[10%] h-12 w-12 opacity-30 animate-pulse"><Heart className="h-full w-full fill-current" /></div>
          <div className="absolute bottom-[20%] right-[10%] h-16 w-16 opacity-30 animate-pulse" style={{ animationDelay: '1s' }}><Heart className="h-full w-full fill-current" /></div>
          
          <div className="relative z-10 max-w-md flex flex-col items-center">
            {/* Mascot Bear refinement */}
            <div className="mb-8 h-48 w-48 rounded-2xl bg-white/10 p-4 backdrop-blur-sm shadow-xl border border-white/20">
              <img src="/bear/urso2-sf.png" alt="Ursinho do Amor" className="h-full w-full object-contain animate-wiggle" />
            </div>

            <span className="text-sm font-bold tracking-widest uppercase bg-white/20 px-4 py-1.5 rounded-full border border-white/30 mb-4 shadow-sm">
              Você recebeu um presente! 🎁
            </span>

            <h1 className="mb-6 text-3xl font-extrabold sm:text-4xl leading-tight">
              {gift.giverName} preparou uma surpresa linda para {gift.receiverName}!
            </h1>

            <p className="mb-8 text-rose-100 font-medium leading-relaxed">
              Aumente o volume, clique no botão abaixo e aproveite este momento especial. 💘
            </p>

            <button
              onClick={handleOpenPresent}
              className="flex items-center gap-3 rounded-2xl border-2 border-b-[6px] border-black bg-white px-8 py-5 text-xl font-bold text-rose-600 transition-all hover:bg-rose-50 active:scale-95 shadow-2xl"
            >
              <Heart className="h-6 w-6 fill-current text-rose-600 animate-pulse" />
              Abrir Surpresa
            </button>
          </div>
        </div>
      )}

      {/* Floating Audio Control Button */}
      {hasOpened && !gift.musicUrl?.includes('spotify.com') && (
        <button
          onClick={togglePlayMusic}
          className="fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full border-2 border-b-[4px] border-black bg-white shadow-xl transition-all hover:bg-rose-100 active:scale-90"
        >
          {isPlaying ? (
            <Volume2 className="h-6 w-6 text-rose-600 animate-bounce" />
          ) : (
            <VolumeX className="h-6 w-6 text-slate-500" />
          )}
        </button>
      )}

      {/* Content Container (Reveals after opening) */}
      {hasOpened && (
        <div className="w-full animate-fade-in">
          {/* Header Branding (if not Spotify theme) */}
          {gift.counterLayout !== 'spotify' && (
            <div className="flex flex-col items-center text-center pt-12 mb-12">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl border-2 border-black bg-white shadow-md">
                <img src="/bear/logo-transparent.png" alt="Love Valentine" className="h-8 w-8 object-contain" />
              </div>
              <h2 className="mt-3 text-sm font-black tracking-widest text-rose-600 uppercase">
                Love Valentine
              </h2>
            </div>
          )}

          {/* 2. Seção do Contador Principal */}
          {gift.counterLayout === 'spotify' ? (
            <SpotifyProduct
              data={{
                partnerOneName: gift.giverName,
                partnerTwoName: gift.receiverName,
                relationshipDate: gift.date,
                city: gift.starMapCity || "São Paulo",
                giftTitle: gift.counterTopText || "O som da nossa história",
                selectedMusic: {
                  id: "spotify-track",
                  title: gift.musicTitle || "Nossa Música",
                  artist: gift.musicArtist || "Playlist do Amor",
                  spotifyUrl: gift.musicUrl,
                },
                coverImages: gift.bgPhoto ? [{ id: "cov-1", url: gift.bgPhoto }] : [],
                specialMessage: gift.romanticMessage,
              }}
              compact={false}
            />
          ) : (
            <div className="mx-auto max-w-3xl px-4">
              <section className="mb-16 rounded-[2.5rem] border-2 border-b-[6px] border-black bg-white p-6 sm:p-10 shadow-xl overflow-hidden">
                {/* Foto de Capa (se houver, senão usa padrão romântico) */}
                <div 
                  className="relative mb-8 h-64 sm:h-80 w-full overflow-hidden rounded-[2rem] border-2 border-black bg-cover bg-center shadow-md"
                  style={{ backgroundImage: `url(${gift.bgPhoto || 'https://images.unsplash.com/photo-1518199266791-5375a83164ba?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80'})` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <div className="absolute bottom-6 left-6 text-white">
                    <span className="inline-block rounded-full bg-rose-600 px-3 py-1 text-xs font-black uppercase tracking-wider mb-2 border border-black/20">
                      {gift.counterTopText || 'Sobre o casal'}
                    </span>
                    <h2 className="text-2xl font-bold sm:text-3xl leading-tight">
                      {gift.giverName} & {gift.receiverName}
                    </h2>
                    <p className="flex items-center gap-1.5 text-xs text-rose-200 mt-1 font-semibold">
                      <Calendar className="h-4 w-4" />
                      {gift.counterBottomText || 'Juntos desde'} {new Date(gift.date).toLocaleDateString('pt-BR')} {gift.time ? `às ${gift.time}` : ''}
                    </p>
                  </div>
                </div>

                {/* Música ativa info / Spotify Embed */}
                {gift.musicUrl && gift.musicUrl.includes('spotify.com') ? (
                  (() => {
                    const trackId = getSpotifyTrackId(gift.musicUrl);
                    if (!trackId) return null;
                    return (
                      <div className="mb-8 rounded-2xl overflow-hidden border-2 border-black bg-black">
                        <iframe 
                          src={`https://open.spotify.com/embed/track/${trackId}?utm_source=generator`} 
                          width="100%" 
                          height="80" 
                          frameBorder="0" 
                          allowFullScreen={false} 
                          allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" 
                          loading="lazy"
                          className="rounded-2xl"
                        />
                      </div>
                    );
                  })()
                ) : (gift.musicTitle || gift.musicArtist) ? (
                  <div className="mb-8 flex items-center gap-3 rounded-2xl border-2 border-black bg-rose-50 px-4 py-3 text-slate-700">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-600 text-white shadow">
                      <Music className="h-5 w-5 animate-spin-slow" />
                    </div>
                    <div>
                      <div className="text-xs text-rose-500 font-bold uppercase tracking-wider">Tocando Agora</div>
                      <div className="text-sm font-extrabold">{gift.musicTitle || 'Música do Casal'}</div>
                      <div className="text-xs font-semibold text-slate-500">{gift.musicArtist || 'Artista'}</div>
                    </div>
                  </div>
                ) : null}

                {/* Contador de Tempo Juntos */}
                <div className="mb-8">
                  <h3 className="text-center text-xs font-black tracking-widest text-slate-400 uppercase mb-4">
                    TEMPO DE RELACIONAMENTO
                  </h3>
                  
                  <div className="grid grid-cols-3 gap-3 sm:gap-4 text-center">
                    <div className="rounded-2xl border-2 border-b-[4px] border-black bg-rose-50 p-3 shadow-md">
                      <div className="text-2xl sm:text-3xl font-extrabold text-rose-600">{timeTogether.years}</div>
                      <div className="text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-wide">Anos</div>
                    </div>
                    <div className="rounded-2xl border-2 border-b-[4px] border-black bg-rose-50 p-3 shadow-md">
                      <div className="text-2xl sm:text-3xl font-extrabold text-rose-600">{timeTogether.months}</div>
                      <div className="text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-wide">Meses</div>
                    </div>
                    <div className="rounded-2xl border-2 border-b-[4px] border-black bg-rose-50 p-3 shadow-md">
                      <div className="text-2xl sm:text-3xl font-extrabold text-rose-600">{timeTogether.days}</div>
                      <div className="text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-wide">Dias</div>
                    </div>
                    <div className="rounded-2xl border-2 border-b-[4px] border-black bg-rose-50 p-3 shadow-md">
                      <div className="text-2xl sm:text-3xl font-extrabold text-rose-600">{String(timeTogether.hours).padStart(2, '0')}</div>
                      <div className="text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-wide">Horas</div>
                    </div>
                    <div className="rounded-2xl border-2 border-b-[4px] border-black bg-rose-50 p-3 shadow-md">
                      <div className="text-2xl sm:text-3xl font-extrabold text-rose-600">{String(timeTogether.minutes).padStart(2, '0')}</div>
                      <div className="text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-wide">Minutos</div>
                    </div>
                    <div className="rounded-2xl border-2 border-b-[4px] border-black bg-rose-50 p-3 shadow-md">
                      <div className="text-2xl sm:text-3xl font-extrabold text-rose-600">{String(timeTogether.seconds).padStart(2, '0')}</div>
                      <div className="text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-wide">Segundos</div>
                    </div>
                  </div>
                </div>

                {/* Mensagem Romântica */}
                <div className="rounded-3xl border-2 border-black bg-amber-50/50 p-6 sm:p-8 relative">
                  <div className="absolute top-4 right-4 text-amber-300 font-serif text-6xl select-none leading-none">“</div>
                  <span className="block text-xs font-black tracking-widest text-amber-500 uppercase mb-3">MENSAGEM DE AMOR</span>
                  <p className="text-slate-700 text-sm sm:text-base leading-relaxed whitespace-pre-line font-medium relative z-10">
                    {gift.romanticMessage}
                  </p>
                  <div className="mt-4 flex items-center justify-end gap-2 text-rose-600 text-xs font-bold">
                    <Heart className="h-4 w-4 fill-current" />
                    Com amor, {gift.giverName}
                  </div>
                </div>
              </section>
            </div>
          )}

          {/* 2.5 Wrapped Product (Seção Conheça o Casal + Linha do Tempo) */}
          {(gift.meetCouple || gift.sections.timeline) && (
            <WrappedProduct
              giverName={gift.giverName}
              receiverName={gift.receiverName}
              meetCouple={gift.meetCouple}
              meetCards={gift.meetCards}
              timelineEvents={gift.sections.timeline ? gift.timelineEvents : []}
              romanticMessage={undefined}
              compact={false}
            />
          )}

          {/* Remaining sections container */}
          <div className="mx-auto max-w-3xl px-4 pt-12">
            {/* 4. Galeria de Imagens */}
            {gift.sections.imageGallery && gift.galleryImages && gift.galleryImages.length > 0 && (
              <section className="mb-16">
                <div className="flex items-center gap-2 mb-8">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl border-2 border-black bg-rose-600 text-white shadow-md">
                    <Sparkles className="h-5 w-5" />
                  </div>
                  <h2 className={`text-xl sm:text-2xl font-black uppercase tracking-wider ${
                    gift.counterLayout === 'spotify' ? 'text-white' : 'text-slate-800'
                  }`}>
                    Nossos Melhores Momentos
                  </h2>
                </div>

                {gift.galleryLayout === 'stories' ? (
                  /* Stories Layout: Instagram view style */
                  <StoriesView images={gift.galleryImages} />
                ) : (
                  /* Cards Layout: swipable stack of cards */
                  <CardsView images={gift.galleryImages} />
                )}
              </section>
            )}

            {/* 5. Mapa das Estrelas */}
            {gift.sections.starMap && gift.starMapCity && (
              <section className="mb-16">
                <div className="flex items-center gap-2 mb-8">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl border-2 border-black bg-rose-600 text-white shadow-md">
                    <Sparkles className="h-5 w-5" />
                  </div>
                  <h2 className={`text-xl sm:text-2xl font-black uppercase tracking-wider ${
                    gift.counterLayout === 'spotify' ? 'text-white' : 'text-slate-800'
                  }`}>
                    Mapa das Estrelas
                  </h2>
                </div>

                <div className={`rounded-[2.5rem] border-2 border-b-[6px] border-black p-6 sm:p-10 shadow-xl text-center ${
                  gift.counterLayout === 'spotify' ? 'bg-zinc-900 text-white' : 'bg-white text-slate-800'
                }`}>
                  <h3 className={`text-lg font-bold mb-6 uppercase tracking-wider ${
                    gift.counterLayout === 'spotify' ? 'text-white' : 'text-slate-800'
                  }`}>
                    O céu sobre {gift.starMapCity}
                  </h3>

                  <StarMapMock date={gift.date} city={gift.starMapCity} />

                  <div className="mt-8 max-w-sm mx-auto text-center border-t border-slate-100 pt-6">
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      CONSTELAÇÕES & ASTROS EM
                    </p>
                    <p className="text-base font-bold text-slate-800 mt-1">
                      {gift.starMapCity}
                    </p>
                    <p className="text-xs font-medium text-slate-400">
                      {new Date(gift.date).toLocaleDateString('pt-BR', { dateStyle: 'long' })}
                    </p>
                  </div>
                </div>
              </section>
            )}

            {/* 5.5 Mapa de Viagens (Nossa Jornada) */}
            {gift.sections.worldMap && gift.worldMapLocations && gift.worldMapLocations.length > 0 && (
              <section className="mb-16">
                <div className="flex items-center gap-2 mb-8">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl border-2 border-black bg-rose-600 text-white shadow-md">
                    <Map className="h-5 w-5" />
                  </div>
                  <h2 className={`text-xl sm:text-2xl font-black uppercase tracking-wider ${
                    gift.counterLayout === 'spotify' ? 'text-white' : 'text-slate-800'
                  }`}>
                    {gift.worldMapTitle || 'Nossa Jornada no Mapa'}
                  </h2>
                </div>

                <WorldMapVisualizer 
                  title={gift.worldMapTitle || 'Nossa Jornada no Mapa'}
                  subtitle={gift.worldMapSubtitle || 'Lugares que marcaram nossa história'}
                  locations={gift.worldMapLocations} 
                />
              </section>
            )}

            {/* 6. Jogo Wordle */}
            {gift.sections.wordleGame && gift.wordleWord && (
              <section className="mb-16">
                <div className="flex items-center gap-2 mb-8">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl border-2 border-black bg-rose-600 text-white shadow-md">
                    <Sparkles className="h-5 w-5" />
                  </div>
                  <h2 className={`text-xl sm:text-2xl font-black uppercase tracking-wider ${
                    gift.counterLayout === 'spotify' ? 'text-white' : 'text-slate-800'
                  }`}>
                    Desafio Secreto
                  </h2>
                </div>

                <WordleGame 
                  word={gift.wordleWord} 
                  clue={gift.wordleClue || 'Uma palavra especial para nós...'} 
                  winMessage={gift.wordleWinMessage || 'Você acertou! Te amo muito.'}
                  giverName={gift.giverName}
                />
              </section>
            )}

            {/* 7. Roleta Surpresa */}
            {gift.sections.roulette && gift.rouletteOptions && gift.rouletteOptions.length > 1 && (
              <section className="mb-16">
                <div className="flex items-center gap-2 mb-8">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl border-2 border-black bg-rose-600 text-white shadow-md">
                    <Sparkles className="h-5 w-5" />
                  </div>
                  <h2 className={`text-xl sm:text-2xl font-black uppercase tracking-wider ${
                    gift.counterLayout === 'spotify' ? 'text-white' : 'text-slate-800'
                  }`}>
                    Roleta do Destino
                  </h2>
                </div>

                <RouletteWheel 
                  title={gift.rouletteTitle || 'O que vamos fazer hoje?'} 
                  options={gift.rouletteOptions} 
                />
              </section>
            )}

            {/* Recreate CTA footer */}
            <div className="mt-20 border-t-2 border-black/10 pt-12 flex flex-col items-center text-center">
              <div className="mb-4 h-16 w-16 rounded-2xl border-2 border-black bg-white p-2.5 shadow-md">
                <img src="/bear/logo-transparent.png" alt="Love Valentine" className="h-full w-full object-contain" />
              </div>
              <h3 className={`text-xl font-black ${
                gift.counterLayout === 'spotify' ? 'text-white' : 'text-slate-800'
              }`}>
                Gostou dessa surpresa?
              </h3>
              <p className={`text-sm max-w-sm mt-1 mb-6 ${
                gift.counterLayout === 'spotify' ? 'text-zinc-400' : 'text-slate-500'
              }`}>
                Crie também um presente digital personalizado para quem você ama em 5 minutos!
              </p>
              <a
                href="/criar"
                className="flex items-center gap-2 rounded-2xl border-2 border-b-[4px] border-[#BE123C] bg-[#E11D48] px-6 py-3 font-bold text-white shadow-lg transition-all hover:bg-[#BE123C] active:scale-95"
              >
                Criar Meu Presente ↗
              </a>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
