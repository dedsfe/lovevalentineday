'use client';

import React, { useState, useEffect } from 'react';
import {
  Heart,
  ArrowLeft,
  ArrowRight,
  Calendar,
  Music,
  Image as ImageIcon,
  Clock,
  Trash2,
  Plus,
  Check,
  Star,
  Upload,
  Info,
  CreditCard,
  QrCode,
  Sparkles,
  RefreshCw,
  MapPin,
  Map,
  Eye,
  X,
  Volume2,
  HelpCircle,
  Gift,
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Shuffle,
  Repeat,
  ChevronDown,
  MoreHorizontal,
  ChevronRight,
  Zap,
  Crown,
  Package
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

// ─── Helpers ────────────────────────────────────────────────────────────────
function getSpotifyTrackId(url: string): string | null {
  if (!url) return null;
  const match = url.match(/track\/([a-zA-Z0-9]+)/) || url.match(/spotify:track:([a-zA-Z0-9]+)/);
  return match ? match[1] : null;
}

// ─── Preset Data ────────────────────────────────────────────────────────────
const PRESET_BACKDROPS = [
  { name: 'Pôr do Sol na Praia', url: 'https://images.unsplash.com/photo-1518199266791-5375a83164ba?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80' },
  { name: 'Caminho de Mãos Dadas', url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80' },
  { name: 'Abraço Romântico', url: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80' },
  { name: 'Noite Sob as Estrelas', url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80' },
];

const PRESET_TRACKS = [
  { name: 'Violão Acústico Suave', artist: 'Mixkit Romance', url: 'https://assets.mixkit.co/music/preview/mixkit-romantic-ambience-1033.mp3' },
  { name: 'Melodia de Piano Solo', artist: 'SoundHelix', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3' },
  { name: 'Ukulele Alegre de Casal', artist: 'SoundHelix', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3' },
  { name: 'Orquestra Clássica e Violinos', artist: 'SoundHelix', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3' }
];

const PRESET_MESSAGES = [
  "Você chegou e, sem prometer nada, mudou tudo. Me mostrou que o amor verdadeiro não é feito de promessas, mas de presença. Cada olhar seu me ensina algo novo sobre o que é amar de verdade. Te ter por perto é viver com o coração em paz. 💗",
  "Não importa onde estejamos, desde que você esteja comigo. Porque é no som da sua risada e no calor do seu abraço que encontro o que muitos chamam de lar. Você é meu lugar favorito no mundo.",
  "Amar você é acordar todos os dias com vontade de ser melhor. É encontrar beleza nas rotinas mais simples e poesia nos silêncios compartilhados. Com você, a vida ganhou cor, propósito e direção. Te amo além do que qualquer verso poderia dizer. 🎶",
  "Tem dias que eu olho pra você e penso: como eu tive tanta sorte? Não é exagero. É só que, com você, tudo faz sentido. Até o caos do mundo parece mais leve quando estou do seu lado. Obrigado por existir e por ser tão você. ✨"
];

// ─── Types ──────────────────────────────────────────────────────────────────
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

interface GiftFormData {
  giverName: string;
  receiverName: string;
  date: string;
  time?: string;
  musicTitle: string;
  musicArtist: string;
  musicUrl: string;
  bgPhoto: string;
  romanticMessage: string;
  counterTopText: string;
  counterBottomText: string;
  counterLayout: 'default' | 'spotify';
  meetCouple: boolean;
  meetCards: MeetCard[];
  sections: {
    timeline: boolean;
    imageGallery: boolean;
    starMap: boolean;
    worldMap: boolean;
    wordleGame: boolean;
    roulette: boolean;
  };
  timelineEvents: TimelineEvent[];
  galleryImages: GalleryImage[];
  galleryLayout: 'cards' | 'stories';
  starMapCity: string;
  worldMapTitle: string;
  worldMapSubtitle: string;
  worldMapLocations: WorldMapLocation[];
  wordleWord: string;
  wordleClue: string;
  wordleWinMessage: string;
  rouletteTitle: string;
  rouletteOptions: string[];
}

// ─── Funnel Step Definitions ────────────────────────────────────────────────
const FUNNEL_STEPS = [
  { id: 'intro',     icon: Heart,      label: 'Início',           emoji: '💕', required: true },
  { id: 'spotify',   icon: Music,      label: 'Player Spotify',   emoji: '🎵', required: true },
  { id: 'wrapped',   icon: Sparkles,   label: 'Retrospectiva',    emoji: '📊', required: false },
  { id: 'gallery',   icon: ImageIcon,  label: 'Galeria de Fotos', emoji: '📸', required: false },
  { id: 'starmap',   icon: Star,       label: 'Mapa Estelar',     emoji: '⭐', required: false },
  { id: 'worldmap',  icon: MapPin,     label: 'Mapa de Viagens',  emoji: '🗺️', required: false },
  { id: 'wordle',    icon: HelpCircle, label: 'Jogo Wordle',      emoji: '🔤', required: false },
  { id: 'roulette',  icon: Gift,       label: 'Roleta Surpresa',  emoji: '🎡', required: false },
  { id: 'checkout',  icon: CreditCard, label: 'Finalizar',        emoji: '💰', required: true },
] as const;

// ═══════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════
export default function CriarPresenteFunil() {
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [generatedId, setGeneratedId] = useState<string | null>(null);
  const [mobilePreviewOpen, setMobilePreviewOpen] = useState(false);
  const [musicSource, setMusicSource] = useState<'preset' | 'spotify'>('preset');

  // Track which optional products are added
  const [addedProducts, setAddedProducts] = useState<Set<string>>(new Set(['spotify']));

  // Form State
  const [formData, setFormData] = useState<GiftFormData>({
    giverName: '',
    receiverName: '',
    date: new Date().toISOString().split('T')[0],
    time: '12:00',
    musicTitle: PRESET_TRACKS[0].name,
    musicArtist: PRESET_TRACKS[0].artist,
    musicUrl: PRESET_TRACKS[0].url,
    bgPhoto: PRESET_BACKDROPS[0].url,
    romanticMessage: PRESET_MESSAGES[0],
    counterTopText: 'Playlist do Amor',
    counterBottomText: 'Juntos desde',
    counterLayout: 'spotify',
    meetCouple: false,
    meetCards: [
      { title: 'Primeiro Encontro', photo: '', description: 'O dia em que nossos olhares se cruzaram pela primeira vez.' }
    ],
    sections: {
      timeline: true,
      imageGallery: true,
      starMap: true,
      worldMap: true,
      wordleGame: true,
      roulette: true,
    },
    timelineEvents: [
      { date: new Date().toISOString().split('T')[0], title: 'Nosso Primeiro Beijo', description: 'O dia em que nossas vidas mudaram de rumo e começamos nossa linda jornada...' }
    ],
    galleryImages: [],
    galleryLayout: 'stories',
    starMapCity: 'São Paulo',
    worldMapTitle: 'Nossa Jornada no Mapa',
    worldMapSubtitle: 'Lugares que marcaram nossa história',
    worldMapLocations: [
      { placeName: 'Rio de Janeiro', date: new Date().toISOString().split('T')[0], photo: '', polaroidText: 'Nossa primeira viagem', locationNickname: 'Copacabana', description: 'Um dia perfeito sob o sol carioca!' }
    ],
    wordleWord: 'AMOR',
    wordleClue: 'O que sinto por você mais do que tudo',
    wordleWinMessage: 'Parabéns meu amor! Você descobriu a palavra e o meu coração é todo seu.',
    rouletteTitle: 'Para onde vamos hoje?',
    rouletteOptions: ['Cinema & Pipoca', 'Jantar Italiano', 'Noite de Massagem', 'Beijinhos sem fim']
  });

  // Payment State
  const [paymentData, setPaymentData] = useState({
    name: '', cpf: '', email: '', phone: '',
    cardNumber: '', cardExpiry: '', cardCvv: '', cardName: '',
    paymentMethod: 'pix'
  });

  // ─── Navigation ──────────────────────────────────────────────────────────
  const currentStepDef = FUNNEL_STEPS[step];
  const totalSteps = FUNNEL_STEPS.length;

  const canAdvance = () => {
    if (step === 0) return formData.giverName.trim() !== '' && formData.receiverName.trim() !== '';
    return true;
  };

  const nextStep = () => {
    if (!canAdvance()) {
      alert('Por favor, preencha os campos obrigatórios antes de prosseguir.');
      return;
    }
    // When leaving a product step, mark it as added if it has content
    const stepId = FUNNEL_STEPS[step].id;
    if (!FUNNEL_STEPS[step].required) {
      setAddedProducts(prev => new Set(prev).add(stepId));
    }
    setStep(prev => Math.min(prev + 1, totalSteps - 1));
  };

  const prevStep = () => setStep(prev => Math.max(prev - 1, 0));

  const skipProduct = () => {
    const stepId = FUNNEL_STEPS[step].id;
    setAddedProducts(prev => {
      const next = new Set(prev);
      next.delete(stepId);
      return next;
    });
    // Also disable the section
    const sectionMap: Record<string, keyof typeof formData.sections> = {
      gallery: 'imageGallery',
      starmap: 'starMap',
      worldmap: 'worldMap',
      wordle: 'wordleGame',
      roulette: 'roulette',
    };
    if (sectionMap[stepId]) {
      setFormData(prev => ({
        ...prev,
        sections: { ...prev.sections, [sectionMap[stepId]]: false }
      }));
    }
    if (stepId === 'wrapped') {
      setFormData(prev => ({
        ...prev,
        meetCouple: false,
        sections: { ...prev.sections, timeline: false }
      }));
    }
    setStep(prev => Math.min(prev + 1, totalSteps - 1));
  };

  const addProduct = () => {
    const stepId = FUNNEL_STEPS[step].id;
    setAddedProducts(prev => new Set(prev).add(stepId));
    // Also enable the section
    const sectionMap: Record<string, keyof typeof formData.sections> = {
      gallery: 'imageGallery',
      starmap: 'starMap',
      worldmap: 'worldMap',
      wordle: 'wordleGame',
      roulette: 'roulette',
    };
    if (sectionMap[stepId]) {
      setFormData(prev => ({
        ...prev,
        sections: { ...prev.sections, [sectionMap[stepId]]: true }
      }));
    }
    if (stepId === 'wrapped') {
      setFormData(prev => ({
        ...prev,
        meetCouple: true,
        sections: { ...prev.sections, timeline: true }
      }));
    }
    nextStep();
  };

  // ─── Photo Upload Handler ────────────────────────────────────────────────
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>, callback: (base64: string) => void) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      alert('Por favor, selecione uma imagem menor que 2MB.');
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === 'string') callback(reader.result);
    };
    reader.readAsDataURL(file);
  };

  // ─── Checkout ────────────────────────────────────────────────────────────
  const handleCheckoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!paymentData.email || !paymentData.name || !paymentData.cpf) {
      alert('Preencha as informações obrigatórias.');
      return;
    }
    setLoading(true);
    try {
      const response = await fetch('/api/gifts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (!response.ok) throw new Error('Erro ao salvar');
      const result = await response.json();
      setGeneratedId(result.id);
      setStep(totalSteps); // Go to success screen
    } catch (error) {
      console.error(error);
      alert('Erro ao processar. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  // ─── Mascot Messages per Step ────────────────────────────────────────────
  const getMascotSpeech = () => {
    switch (FUNNEL_STEPS[step]?.id) {
      case 'intro': return 'Olá! Eu sou o Ursinho do Amor 🐻 Vamos criar um presente digital INCRÍVEL! Me conta os nomes e quando começou essa história de amor.';
      case 'spotify': return 'Agora vamos criar o Player de Música! Escolha a trilha sonora perfeita para a história de vocês. O timer vai contar cada segundo de amor! 🎵';
      case 'wrapped': return 'Hora da Retrospectiva! Escreva uma mensagem de amor e conte a história do casal com cards especiais. Vai emocionar demais! 📊';
      case 'gallery': return 'Monte a galeria com as melhores fotos de vocês! Escolha entre o estilo Stories (Instagram) ou Cards (Carrossel). 📸';
      case 'starmap': return 'Veja as estrelas como estavam no céu no dia em que tudo começou! Basta me dizer a cidade. ⭐';
      case 'worldmap': return 'Marque no mapa mundi as cidades e lugares que marcaram a história de vocês! 🗺️';
      case 'wordle': return 'Crie um desafio divertido! Escolha uma palavra secreta para seu amor adivinhar. 🔤';
      case 'roulette': return 'A roleta da sorte! Configure opções divertidas para decidir o próximo rolê do casal. 🎡';
      case 'checkout': return 'Seu presente ficou MARAVILHOSO! 🎉 Escolha um plano para ativar e enviar para a pessoa especial.';
      default: return 'Estou aqui para te ajudar!';
    }
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // SUCCESS SCREEN (after checkout)
  // ═══════════════════════════════════════════════════════════════════════════
  if (step >= totalSteps && generatedId) {
    return (
      <main className="min-h-screen bg-rose-50/50 py-10 px-4 text-slate-800 selection:bg-rose-200">
        <div className="mx-auto max-w-2xl">
          <div className="rounded-[2.5rem] border-2 border-b-[6px] border-black bg-white p-6 sm:p-10 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] text-center">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500 text-white shadow-lg border-2 border-black">
              <Check className="h-8 w-8 text-white stroke-[3px]" />
            </div>
            <h2 className="text-2xl font-black text-slate-800 uppercase tracking-wide">Presente Criado! 🎉</h2>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mt-2 leading-relaxed font-semibold">
              O presente digital de {formData.receiverName} está online e pronto para emocionar.
            </p>
            <div className="my-8 rounded-[2rem] border-2 border-black bg-rose-50 p-6 flex flex-col items-center max-w-md mx-auto shadow-inner">
              <div className="h-40 w-40 bg-white border-2 border-black p-2.5 rounded-[1.5rem] shadow mb-4 flex items-center justify-center overflow-hidden">
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(typeof window !== 'undefined' ? window.location.origin + '/presente/' + generatedId : '')}`}
                  alt="QR Code do presente"
                  className="h-full w-full object-contain"
                />
              </div>
              <span className="text-[10px] font-black text-rose-600 uppercase tracking-widest block mb-1">LINK EXCLUSIVO DO PRESENTE</span>
              <div className="w-full flex gap-2 items-center">
                <input type="text" readOnly value={typeof window !== 'undefined' ? `${window.location.origin}/presente/${generatedId}` : ''} className="w-full rounded-xl border border-black/30 p-2 text-xs font-semibold text-slate-600 bg-white select-all text-center" />
                <button onClick={() => { navigator.clipboard.writeText(`${window.location.origin}/presente/${generatedId}`); alert('Link copiado!'); }} className="rounded-xl border-2 border-b-[3px] border-black bg-white hover:bg-slate-50 px-4 py-2 font-bold text-xs transition-all">
                  Copiar
                </button>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href={`/presente/${generatedId}`} target="_blank" rel="noreferrer" className="flex-1 flex items-center justify-center gap-1.5 rounded-2xl border-2 border-b-[4px] border-black bg-rose-600 px-6 py-4 font-bold text-white shadow hover:bg-rose-700 transition-all text-sm">
                Visualizar Presente ↗
              </a>
              <a href="/" className="flex-1 flex items-center justify-center gap-1.5 rounded-2xl border-2 border-b-[4px] border-black bg-white hover:bg-slate-50 px-6 py-4 font-bold text-slate-700 transition-all text-sm">
                Voltar ao Início
              </a>
            </div>
          </div>
        </div>
      </main>
    );
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // MAIN RENDER
  // ═══════════════════════════════════════════════════════════════════════════
  return (
    <main className="min-h-screen bg-rose-50/50 py-6 px-4 text-slate-800 selection:bg-rose-200">

      {/* Brand Header */}
      <div className="mx-auto max-w-7xl flex flex-col items-center text-center mb-4">
        <a href="/" className="flex h-12 w-12 items-center justify-center rounded-2xl border-2 border-black bg-white shadow-md hover:-translate-y-0.5 transition-all">
          <img src="/bear/logo-transparent.png" alt="Love Valentine Logo" className="h-8 w-8 object-contain" />
        </a>
        <h1 className="mt-2 text-md font-black tracking-widest text-[#E11D48] uppercase">
          Love Valentine
        </h1>
      </div>

      {/* Funnel Progress Bar */}
      <div className="mx-auto max-w-7xl mb-6">
        <div className="rounded-2xl border-2 border-black bg-white p-3 shadow-sm">
          <div className="flex items-center justify-between gap-1 overflow-x-auto scrollbar-hide">
            {FUNNEL_STEPS.map((s, i) => {
              const StepIcon = s.icon;
              const isActive = i === step;
              const isPast = i < step;
              const isAdded = addedProducts.has(s.id);
              return (
                <button
                  key={s.id}
                  onClick={() => { if (isPast) setStep(i); }}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all flex-shrink-0 border ${
                    isActive
                      ? 'bg-rose-600 text-white border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
                      : isPast && isAdded
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-300 cursor-pointer hover:bg-emerald-100'
                        : isPast
                          ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-pointer hover:bg-slate-200'
                          : 'bg-slate-50 text-slate-300 border-slate-100'
                  }`}
                >
                  <StepIcon className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">{s.label}</span>
                  {isPast && isAdded && <Check className="h-3 w-3 text-emerald-600" />}
                </button>
              );
            })}
          </div>
          <div className="flex gap-0.5 h-1.5 mt-2 bg-slate-100 rounded-full overflow-hidden">
            {FUNNEL_STEPS.map((_, i) => (
              <div key={i} className={`h-full flex-1 rounded-full transition-all duration-500 ${
                i < step ? (addedProducts.has(FUNNEL_STEPS[i].id) ? 'bg-emerald-500' : 'bg-slate-300') : i === step ? 'bg-rose-600' : 'bg-slate-200'
              }`} />
            ))}
          </div>
        </div>
      </div>

      {/* Main Split Layout */}
      <div className="mx-auto max-w-7xl grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

        {/* ════════════════════════════════════════════════════════════════════
           LEFT PANEL: Product Step Content
           ════════════════════════════════════════════════════════════════════ */}
        <div className="lg:col-span-7 space-y-5">

          {/* Mascot */}
          <div className="rounded-3xl border-2 border-black bg-white p-5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] relative flex flex-col sm:flex-row gap-4 items-center">
            <div className="h-16 w-16 flex-shrink-0 bg-rose-50 border-2 border-black rounded-2xl p-1.5 shadow-sm">
              <img src="/bear/urso-sf.png" alt="Ursinho Guia" className="h-full w-full object-contain" />
            </div>
            <div className="relative bg-rose-50 border border-rose-200 rounded-2xl p-3 text-xs font-semibold text-slate-700 leading-relaxed w-full">
              <div className="absolute left-1/2 -top-2 -translate-x-1/2 sm:left-[-6px] sm:top-6 sm:translate-x-0 h-3 w-3 rotate-45 border-l border-t border-rose-200 bg-rose-50" />
              {getMascotSpeech()}
            </div>
          </div>

          {/* ───────────────────────────────────────────────────────────────
             STEP 0: INTRO
             ─────────────────────────────────────────────────────────────── */}
          {FUNNEL_STEPS[step]?.id === 'intro' && (
            <div className="rounded-[2rem] border-2 border-black bg-white p-6 sm:p-8 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
              <div className="flex items-center gap-2 mb-6">
                <Heart className="h-6 w-6 text-rose-600 fill-current" />
                <h2 className="text-xl font-black text-slate-800 uppercase tracking-wide">Protagonistas do Presente</h2>
              </div>

              <div className="space-y-5">
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-bold text-slate-700">Seu Nome (Quem está enviando)</label>
                  <input
                    type="text"
                    value={formData.giverName}
                    onChange={e => setFormData({ ...formData, giverName: e.target.value })}
                    placeholder="Ex: João"
                    className="rounded-xl border-2 border-black p-3 text-sm font-semibold focus:outline-none shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-bold text-slate-700">Nome do Parceiro(a) (Quem vai receber)</label>
                  <input
                    type="text"
                    value={formData.receiverName}
                    onChange={e => setFormData({ ...formData, receiverName: e.target.value })}
                    placeholder="Ex: Maria"
                    className="rounded-xl border-2 border-black p-3 text-sm font-semibold focus:outline-none shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-bold text-slate-700">Dia de início</label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-3.5 h-5 w-5 text-slate-400" />
                      <input
                        type="date"
                        value={formData.date}
                        onChange={e => setFormData({ ...formData, date: e.target.value })}
                        className="w-full rounded-xl border-2 border-black p-3 pl-10 text-sm font-semibold focus:outline-none shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all"
                      />
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-bold text-slate-700">Horário (opcional)</label>
                    <div className="relative">
                      <Clock className="absolute left-3 top-3.5 h-5 w-5 text-slate-400" />
                      <input
                        type="time"
                        value={formData.time}
                        onChange={e => setFormData({ ...formData, time: e.target.value })}
                        className="w-full rounded-xl border-2 border-black p-3 pl-10 text-sm font-semibold focus:outline-none shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all"
                      />
                    </div>
                  </div>
                </div>

                {/* Cover Photo */}
                <div className="space-y-3">
                  <h3 className="font-bold text-sm text-slate-700 flex items-center gap-1.5">
                    <ImageIcon className="h-5 w-5 text-rose-600" />
                    Foto de Capa do Casal
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    {PRESET_BACKDROPS.map((bd, i) => (
                      <div
                        key={i}
                        onClick={() => setFormData({ ...formData, bgPhoto: bd.url })}
                        className={`h-20 rounded-xl border-2 border-black overflow-hidden relative cursor-pointer transition-all ${
                          formData.bgPhoto === bd.url ? 'border-rose-600 ring-2 ring-rose-200' : 'opacity-80 hover:opacity-100'
                        }`}
                      >
                        <img src={bd.url} alt={bd.name} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center p-1.5">
                          <span className="text-[10px] text-white font-bold text-center leading-tight">{bd.name}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50/50 p-4 text-center">
                    <label className="flex flex-col items-center justify-center gap-2 cursor-pointer">
                      <Upload className="h-6 w-6 text-slate-400" />
                      <span className="text-xs font-extrabold text-slate-700">Upload sua foto de casal</span>
                      <span className="text-[10px] text-slate-400">(máx 2MB)</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={e => handlePhotoUpload(e, base64 => setFormData({ ...formData, bgPhoto: base64 }))}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>
              </div>

              <div className="mt-8 flex justify-end">
                <button onClick={nextStep} className="flex items-center gap-2 rounded-2xl border-2 border-b-[4px] border-black bg-rose-600 px-6 py-3 font-bold text-white shadow-md hover:bg-rose-700 transition-all active:scale-95">
                  Começar a Montar <ArrowRight className="h-5 w-5" />
                </button>
              </div>
            </div>
          )}

          {/* ───────────────────────────────────────────────────────────────
             STEP 1: SPOTIFY PLAYER
             ─────────────────────────────────────────────────────────────── */}
          {FUNNEL_STEPS[step]?.id === 'spotify' && (
            <ProductStepCard
              title="Player de Música Spotify"
              subtitle="Configure a trilha sonora oficial do seu relacionamento. O player exibe um contador de tempo poético em formato de letras de música."
              icon={<Music className="h-6 w-6 text-emerald-500" />}
              accentColor="emerald"
            >
              {/* Music Source Toggle */}
              <div className="space-y-4">
                <h3 className="font-bold text-sm text-slate-700 flex items-center gap-1.5">
                  <Music className="h-5 w-5 text-rose-600" />
                  Música de Fundo
                </h3>
                <div className="flex gap-2 p-1 bg-slate-100 rounded-xl border border-black/10">
                  <button
                    type="button"
                    onClick={() => {
                      setMusicSource('preset');
                      setFormData({ ...formData, musicTitle: PRESET_TRACKS[0].name, musicArtist: PRESET_TRACKS[0].artist, musicUrl: PRESET_TRACKS[0].url });
                    }}
                    className={`flex-1 py-2 px-3 text-xs font-black rounded-lg border transition-all ${
                      musicSource === 'preset' ? 'bg-rose-600 text-white border-black shadow-sm' : 'bg-transparent border-transparent hover:bg-white/50 text-slate-500'
                    }`}
                  >
                    Trilhas Românticas
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setMusicSource('spotify');
                      setFormData({ ...formData, musicTitle: 'Música do Spotify', musicArtist: 'Spotify Player', musicUrl: '' });
                    }}
                    className={`flex-1 py-2 px-3 text-xs font-black rounded-lg border transition-all ${
                      musicSource === 'spotify' ? 'bg-rose-600 text-white border-black shadow-sm' : 'bg-transparent border-transparent hover:bg-white/50 text-slate-500'
                    }`}
                  >
                    Link do Spotify
                  </button>
                </div>

                {musicSource === 'preset' ? (
                  <div className="grid grid-cols-1 gap-2.5">
                    {PRESET_TRACKS.map((track, i) => (
                      <div
                        key={i}
                        onClick={() => setFormData({ ...formData, musicTitle: track.name, musicArtist: track.artist, musicUrl: track.url })}
                        className={`p-3 rounded-xl border-2 border-black flex items-center justify-between cursor-pointer transition-all ${
                          formData.musicUrl === track.url ? 'bg-rose-50 border-rose-600' : 'bg-white hover:bg-slate-50'
                        }`}
                      >
                        <div>
                          <div className="text-xs font-bold">{track.name}</div>
                          <div className="text-[10px] text-slate-500 font-semibold">{track.artist}</div>
                        </div>
                        {formData.musicUrl === track.url && <Check className="h-5 w-5 text-rose-600" />}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-3 p-4 rounded-2xl border-2 border-black bg-slate-50">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-slate-700">Cole o link da música do Spotify:</label>
                      <input
                        type="text"
                        value={formData.musicUrl}
                        onChange={e => setFormData({ ...formData, musicUrl: e.target.value, musicTitle: 'Música do Spotify', musicArtist: 'Spotify Player' })}
                        placeholder="Ex: https://open.spotify.com/track/4PTG3Z6ehGkBFzI7Y1rqy"
                        className="rounded-xl border border-black/30 p-2.5 text-xs font-semibold focus:outline-none bg-white w-full"
                      />
                    </div>
                    <p className="text-[10px] text-slate-400 font-semibold leading-relaxed">
                      Abra o Spotify → Compartilhar → Copiar Link → Cole aqui.
                    </p>
                  </div>
                )}
              </div>

              {/* Counter Text Customization */}
              <div className="space-y-3 p-4 rounded-2xl border-2 border-black bg-slate-50 mt-5">
                <h3 className="font-bold text-sm text-slate-700 flex items-center gap-1.5">
                  <Clock className="h-5 w-5 text-rose-600" />
                  Textos do Player
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-slate-600">Subtítulo (artista)</label>
                    <input
                      type="text"
                      value={formData.counterTopText}
                      onChange={e => setFormData({ ...formData, counterTopText: e.target.value })}
                      className="rounded-xl border border-black/30 p-2.5 text-xs font-semibold focus:outline-none bg-white"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-slate-600">Texto inferior</label>
                    <input
                      type="text"
                      value={formData.counterBottomText}
                      onChange={e => setFormData({ ...formData, counterBottomText: e.target.value })}
                      className="rounded-xl border border-black/30 p-2.5 text-xs font-semibold focus:outline-none bg-white"
                    />
                  </div>
                </div>
              </div>

              {/* Navigation */}
              <div className="mt-8 flex justify-between">
                <button onClick={prevStep} className="flex items-center gap-1.5 rounded-2xl border-2 border-b-[4px] border-black bg-white px-5 py-3 font-bold hover:bg-slate-50 transition-all active:scale-95">
                  <ArrowLeft className="h-5 w-5" /> Voltar
                </button>
                <button onClick={addProduct} className="flex items-center gap-2 rounded-2xl border-2 border-b-[4px] border-black bg-emerald-600 px-6 py-3 font-bold text-white shadow-md hover:bg-emerald-700 transition-all active:scale-95">
                  <Sparkles className="h-5 w-5" /> Adicionar ao Presente
                </button>
              </div>
            </ProductStepCard>
          )}

          {/* ───────────────────────────────────────────────────────────────
             STEP 2: WRAPPED / RETROSPECTIVA
             ─────────────────────────────────────────────────────────────── */}
          {FUNNEL_STEPS[step]?.id === 'wrapped' && (
            <ProductStepCard
              title="Retrospectiva Wrapped"
              subtitle="Conte a história do casal com mensagem romântica, cards de marcos e linha do tempo."
              icon={<Sparkles className="h-6 w-6 text-amber-500" />}
              accentColor="amber"
            >
              {/* Message */}
              <div className="space-y-3">
                <h3 className="font-bold text-sm text-slate-700 flex items-center gap-1.5">
                  <Sparkles className="h-5 w-5 text-rose-600" />
                  Mensagem de Amor
                </h3>
                <textarea
                  rows={4}
                  value={formData.romanticMessage}
                  onChange={e => setFormData({ ...formData, romanticMessage: e.target.value })}
                  className="w-full rounded-xl border-2 border-black p-3 text-sm font-semibold focus:outline-none shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                />
                <div className="flex flex-wrap gap-2">
                  {PRESET_MESSAGES.map((msg, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setFormData({ ...formData, romanticMessage: msg })}
                      className={`px-3 py-1.5 text-xs font-bold rounded-xl border border-slate-200 transition-all ${
                        formData.romanticMessage === msg ? 'bg-rose-50 border-rose-500 text-rose-600' : 'bg-white hover:bg-slate-50'
                      }`}
                    >
                      Sugestão {i + 1}
                    </button>
                  ))}
                </div>
              </div>

              {/* Meet Couple Cards */}
              <div className="space-y-4 mt-5 p-4 rounded-2xl border-2 border-black bg-slate-50">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-sm text-slate-700 flex items-center gap-1.5">
                    <Heart className="h-5 w-5 text-rose-600" />
                    Cards &quot;Conheça o Casal&quot;
                  </h3>
                  <input
                    type="checkbox"
                    checked={formData.meetCouple}
                    onChange={e => setFormData({ ...formData, meetCouple: e.target.checked })}
                    className="h-5 w-5 rounded border-black text-rose-600 focus:ring-0 cursor-pointer"
                  />
                </div>
                {formData.meetCouple && (
                  <div className="space-y-4 pt-2 border-t border-slate-200">
                    {formData.meetCards.map((card, idx) => (
                      <div key={idx} className="p-3 bg-white rounded-xl border border-black/20 relative space-y-3">
                        <button
                          type="button"
                          onClick={() => setFormData({ ...formData, meetCards: formData.meetCards.filter((_, i) => i !== idx) })}
                          className="absolute top-2 right-2 text-slate-400 hover:text-rose-600"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                        <input
                          type="text" value={card.title}
                          onChange={e => { const u = [...formData.meetCards]; u[idx].title = e.target.value; setFormData({ ...formData, meetCards: u }); }}
                          className="w-full rounded-lg border border-slate-300 p-2 text-xs font-semibold focus:outline-none" placeholder="Título do marco"
                        />
                        <textarea
                          rows={2} value={card.description}
                          onChange={e => { const u = [...formData.meetCards]; u[idx].description = e.target.value; setFormData({ ...formData, meetCards: u }); }}
                          className="w-full rounded-lg border border-slate-300 p-2 text-xs font-semibold focus:outline-none" placeholder="Descrição"
                        />
                        {card.photo ? (
                          <div className="relative h-20 w-full rounded-lg overflow-hidden border">
                            <img src={card.photo} alt="Card" className="w-full h-full object-cover" />
                            <button type="button" onClick={() => { const u = [...formData.meetCards]; u[idx].photo = ''; setFormData({ ...formData, meetCards: u }); }} className="absolute top-1 right-1 bg-black/60 rounded p-1 text-white hover:bg-black">
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        ) : (
                          <label className="flex h-10 items-center justify-center rounded-lg border border-dashed border-slate-300 bg-slate-50/50 hover:bg-white cursor-pointer text-xs font-bold text-slate-600">
                            <Upload className="h-4 w-4 mr-1.5 text-slate-400" /> Foto
                            <input type="file" accept="image/*" onChange={e => handlePhotoUpload(e, base64 => { const u = [...formData.meetCards]; u[idx].photo = base64; setFormData({ ...formData, meetCards: u }); })} className="hidden" />
                          </label>
                        )}
                      </div>
                    ))}
                    {formData.meetCards.length < 3 && (
                      <button type="button" onClick={() => setFormData({ ...formData, meetCards: [...formData.meetCards, { title: 'Novo Marco', photo: '', description: 'Descreva esse momento...' }] })} className="w-full flex items-center justify-center gap-1.5 rounded-xl border border-black bg-white p-2 text-xs font-bold text-slate-600 hover:bg-slate-50">
                        <Plus className="h-4 w-4" /> Adicionar Card
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* Timeline */}
              <div className="space-y-4 mt-5 p-4 rounded-2xl border-2 border-black bg-slate-50">
                <h3 className="font-bold text-sm text-slate-700 flex items-center gap-1.5">
                  <Calendar className="h-5 w-5 text-rose-600" />
                  Linha do Tempo
                </h3>
                {formData.timelineEvents.map((evt, idx) => (
                  <div key={idx} className="p-3 bg-white rounded-xl border border-black/20 relative space-y-3">
                    <button type="button" onClick={() => setFormData({ ...formData, timelineEvents: formData.timelineEvents.filter((_, i) => i !== idx) })} className="absolute top-2 right-2 text-slate-400 hover:text-rose-600">
                      <Trash2 className="h-4 w-4" />
                    </button>
                    <div className="grid grid-cols-2 gap-2">
                      <input type="date" value={evt.date} onChange={e => { const u = [...formData.timelineEvents]; u[idx].date = e.target.value; setFormData({ ...formData, timelineEvents: u }); }} className="rounded-lg border border-slate-300 p-2 text-xs font-semibold focus:outline-none" />
                      <input type="text" value={evt.title} onChange={e => { const u = [...formData.timelineEvents]; u[idx].title = e.target.value; setFormData({ ...formData, timelineEvents: u }); }} placeholder="Marco" className="rounded-lg border border-slate-300 p-2 text-xs font-semibold focus:outline-none" />
                    </div>
                    <textarea rows={2} value={evt.description} onChange={e => { const u = [...formData.timelineEvents]; u[idx].description = e.target.value; setFormData({ ...formData, timelineEvents: u }); }} placeholder="Descrição" className="w-full rounded-lg border border-slate-300 p-2 text-xs font-semibold focus:outline-none" />
                    {evt.photo ? (
                      <div className="relative h-20 w-full rounded-lg overflow-hidden border">
                        <img src={evt.photo} alt="Momento" className="w-full h-full object-cover" />
                        <button type="button" onClick={() => { const u = [...formData.timelineEvents]; u[idx].photo = undefined; setFormData({ ...formData, timelineEvents: u }); }} className="absolute top-1 right-1 bg-black/60 rounded p-1 text-white hover:bg-black">
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    ) : (
                      <label className="flex h-10 items-center justify-center rounded-lg border border-dashed border-slate-300 bg-slate-50/50 hover:bg-white cursor-pointer text-xs font-bold text-slate-600">
                        <Upload className="h-4 w-4 mr-1.5 text-slate-400" /> Foto (Opcional)
                        <input type="file" accept="image/*" onChange={e => handlePhotoUpload(e, base64 => { const u = [...formData.timelineEvents]; u[idx].photo = base64; setFormData({ ...formData, timelineEvents: u }); })} className="hidden" />
                      </label>
                    )}
                  </div>
                ))}
                <button type="button" onClick={() => setFormData({ ...formData, timelineEvents: [...formData.timelineEvents, { date: new Date().toISOString().split('T')[0], title: 'Outro momento', description: '' }] })} className="w-full flex items-center justify-center gap-1.5 rounded-xl border border-black bg-white p-2 text-xs font-bold text-slate-600 hover:bg-slate-50">
                  <Plus className="h-4 w-4" /> Adicionar Momento
                </button>
              </div>

              <FunnelNavigation
                onBack={prevStep}
                onAdd={addProduct}
                onSkip={skipProduct}
                showSkip
              />
            </ProductStepCard>
          )}

          {/* ───────────────────────────────────────────────────────────────
             STEP 3: GALLERY
             ─────────────────────────────────────────────────────────────── */}
          {FUNNEL_STEPS[step]?.id === 'gallery' && (
            <ProductStepCard
              title="Galeria de Fotos"
              subtitle="As melhores fotos de vocês dois em formato Stories (Instagram) ou Cards (Carrossel)."
              icon={<ImageIcon className="h-6 w-6 text-pink-500" />}
              accentColor="pink"
            >
              <div className="flex gap-4 mb-4">
                <button type="button" onClick={() => setFormData({ ...formData, galleryLayout: 'stories' })} className={`flex-1 p-3 rounded-xl border-2 border-black text-center font-bold text-xs ${formData.galleryLayout === 'stories' ? 'bg-rose-50 border-rose-600 text-rose-600' : 'bg-white hover:bg-slate-50'}`}>
                  Estilo Stories
                </button>
                <button type="button" onClick={() => setFormData({ ...formData, galleryLayout: 'cards' })} className={`flex-1 p-3 rounded-xl border-2 border-black text-center font-bold text-xs ${formData.galleryLayout === 'cards' ? 'bg-rose-50 border-rose-600 text-rose-600' : 'bg-white hover:bg-slate-50'}`}>
                  Estilo Cards
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {formData.galleryImages.map((img, idx) => (
                  <div key={idx} className="rounded-xl border-2 border-black overflow-hidden bg-slate-50 relative group">
                    <div className="h-32 w-full">
                      <img src={img.photo} alt="Gallery" className="w-full h-full object-cover" />
                    </div>
                    <button type="button" onClick={() => setFormData({ ...formData, galleryImages: formData.galleryImages.filter((_, i) => i !== idx) })} className="absolute top-2 right-2 bg-black/60 hover:bg-black rounded-lg p-1 text-white">
                      <Trash2 className="h-4 w-4" />
                    </button>
                    <div className="p-2 border-t border-black space-y-1">
                      <input type="text" placeholder="Título" value={img.title || ''} onChange={e => { const u = [...formData.galleryImages]; u[idx].title = e.target.value; setFormData({ ...formData, galleryImages: u }); }} className="w-full bg-white border border-slate-200 text-[10px] p-1 rounded font-semibold focus:outline-none" />
                      <input type="text" placeholder="Legenda" value={img.caption || ''} onChange={e => { const u = [...formData.galleryImages]; u[idx].caption = e.target.value; setFormData({ ...formData, galleryImages: u }); }} className="w-full bg-white border border-slate-200 text-[10px] p-1 rounded font-semibold focus:outline-none" />
                    </div>
                  </div>
                ))}
                <label className="rounded-xl border-2 border-dashed border-slate-300 hover:border-black bg-slate-50/50 hover:bg-white flex flex-col items-center justify-center p-6 cursor-pointer text-center h-[180px] transition-all">
                  <Plus className="h-8 w-8 text-slate-400 mb-1" />
                  <span className="text-xs font-bold text-slate-700">Adicionar Foto</span>
                  <input type="file" accept="image/*" onChange={e => handlePhotoUpload(e, base64 => setFormData({ ...formData, galleryImages: [...formData.galleryImages, { photo: base64 }] }))} className="hidden" />
                </label>
              </div>

              <FunnelNavigation onBack={prevStep} onAdd={addProduct} onSkip={skipProduct} showSkip />
            </ProductStepCard>
          )}

          {/* ───────────────────────────────────────────────────────────────
             STEP 4: STAR MAP
             ─────────────────────────────────────────────────────────────── */}
          {FUNNEL_STEPS[step]?.id === 'starmap' && (
            <ProductStepCard
              title="Mapa das Estrelas"
              subtitle="Veja como as estrelas estavam no céu na data e cidade onde tudo começou."
              icon={<Star className="h-6 w-6 text-indigo-500" />}
              accentColor="indigo"
            >
              <div className="flex flex-col gap-2">
                <label className="text-sm font-bold text-slate-700">Cidade e Estado/País</label>
                <input
                  type="text"
                  value={formData.starMapCity}
                  onChange={e => setFormData({ ...formData, starMapCity: e.target.value })}
                  placeholder="Ex: São Paulo, Brasil"
                  className="rounded-xl border-2 border-black p-3 text-sm font-semibold focus:outline-none shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                />
                <p className="text-[10px] text-slate-400 font-semibold leading-relaxed mt-1 flex items-center gap-1">
                  <Info className="h-3.5 w-3.5" />
                  O mapa simulará as constelações visíveis nesta cidade na data configurada.
                </p>
              </div>
              <FunnelNavigation onBack={prevStep} onAdd={addProduct} onSkip={skipProduct} showSkip />
            </ProductStepCard>
          )}

          {/* ───────────────────────────────────────────────────────────────
             STEP 5: WORLD MAP
             ─────────────────────────────────────────────────────────────── */}
          {FUNNEL_STEPS[step]?.id === 'worldmap' && (
            <ProductStepCard
              title="Mapa de Viagens"
              subtitle="Marque no mapa mundi os lugares que marcaram a história de vocês."
              icon={<MapPin className="h-6 w-6 text-teal-500" />}
              accentColor="teal"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-600">Título da Seção</label>
                  <input type="text" value={formData.worldMapTitle} onChange={e => setFormData({ ...formData, worldMapTitle: e.target.value })} className="rounded-xl border border-black/30 p-2 text-xs font-semibold bg-white focus:outline-none" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-600">Subtítulo</label>
                  <input type="text" value={formData.worldMapSubtitle} onChange={e => setFormData({ ...formData, worldMapSubtitle: e.target.value })} className="rounded-xl border border-black/30 p-2 text-xs font-semibold bg-white focus:outline-none" />
                </div>
              </div>

              <div className="space-y-4">
                {formData.worldMapLocations.map((loc, idx) => (
                  <div key={idx} className="p-4 rounded-2xl border-2 border-black bg-slate-50 relative space-y-3">
                    <button type="button" onClick={() => setFormData({ ...formData, worldMapLocations: formData.worldMapLocations.filter((_, i) => i !== idx) })} className="absolute top-3 right-3 text-slate-400 hover:text-rose-600"><Trash2 className="h-5 w-5" /></button>
                    <div className="grid grid-cols-2 gap-3">
                      <input type="text" value={loc.placeName} onChange={e => { const u = [...formData.worldMapLocations]; u[idx].placeName = e.target.value; setFormData({ ...formData, worldMapLocations: u }); }} placeholder="Nome do Local" className="rounded-xl border border-black/30 p-2 text-xs font-semibold bg-white focus:outline-none" />
                      <input type="date" value={loc.date} onChange={e => { const u = [...formData.worldMapLocations]; u[idx].date = e.target.value; setFormData({ ...formData, worldMapLocations: u }); }} className="rounded-xl border border-black/30 p-2 text-xs font-semibold bg-white focus:outline-none" />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <input type="text" value={loc.polaroidText} onChange={e => { const u = [...formData.worldMapLocations]; u[idx].polaroidText = e.target.value; setFormData({ ...formData, worldMapLocations: u }); }} placeholder="Texto Polaroid" className="rounded-xl border border-black/30 p-2 text-xs font-semibold bg-white focus:outline-none" />
                      <input type="text" value={loc.locationNickname} onChange={e => { const u = [...formData.worldMapLocations]; u[idx].locationNickname = e.target.value; setFormData({ ...formData, worldMapLocations: u }); }} placeholder="Apelido" className="rounded-xl border border-black/30 p-2 text-xs font-semibold bg-white focus:outline-none" />
                    </div>
                    <textarea rows={2} value={loc.description} onChange={e => { const u = [...formData.worldMapLocations]; u[idx].description = e.target.value; setFormData({ ...formData, worldMapLocations: u }); }} placeholder="História do lugar" className="w-full rounded-xl border border-black/30 p-2 text-xs font-semibold bg-white focus:outline-none" />
                    {loc.photo ? (
                      <div className="relative h-24 w-24 rounded-xl overflow-hidden border border-black">
                        <img src={loc.photo} alt="Polaroid" className="w-full h-full object-cover" />
                        <button type="button" onClick={() => { const u = [...formData.worldMapLocations]; u[idx].photo = ''; setFormData({ ...formData, worldMapLocations: u }); }} className="absolute top-1 right-1 bg-black/60 rounded p-1 text-white hover:bg-black"><Trash2 className="h-3.5 w-3.5" /></button>
                      </div>
                    ) : (
                      <label className="flex h-10 items-center justify-center rounded-xl border border-dashed border-slate-300 bg-white hover:bg-slate-100 cursor-pointer text-xs font-bold text-slate-600">
                        <Upload className="h-4 w-4 mr-1.5 text-slate-400" /> Foto Polaroid
                        <input type="file" accept="image/*" onChange={e => handlePhotoUpload(e, base64 => { const u = [...formData.worldMapLocations]; u[idx].photo = base64; setFormData({ ...formData, worldMapLocations: u }); })} className="hidden" />
                      </label>
                    )}
                  </div>
                ))}
                <button type="button" onClick={() => setFormData({ ...formData, worldMapLocations: [...formData.worldMapLocations, { placeName: '', date: new Date().toISOString().split('T')[0], photo: '', polaroidText: '', locationNickname: '', description: '' }] })} className="w-full flex items-center justify-center gap-1.5 rounded-xl border-2 border-black bg-white p-3 font-bold text-slate-700 hover:bg-slate-50">
                  <MapPin className="h-5 w-5" /> Adicionar Cidade
                </button>
              </div>

              <FunnelNavigation onBack={prevStep} onAdd={addProduct} onSkip={skipProduct} showSkip />
            </ProductStepCard>
          )}

          {/* ───────────────────────────────────────────────────────────────
             STEP 6: WORDLE
             ─────────────────────────────────────────────────────────────── */}
          {FUNNEL_STEPS[step]?.id === 'wordle' && (
            <ProductStepCard
              title="Jogo Wordle"
              subtitle="Um desafio divertido para seu amor adivinhar uma palavra secreta."
              icon={<HelpCircle className="h-6 w-6 text-violet-500" />}
              accentColor="violet"
            >
              <div className="space-y-4">
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-bold text-slate-700">Palavra Secreta (3 a 10 letras)</label>
                  <input
                    type="text" maxLength={10}
                    value={formData.wordleWord}
                    onChange={e => setFormData({ ...formData, wordleWord: e.target.value.toUpperCase().replace(/[^a-zA-Z]/g, '') })}
                    className="rounded-xl border-2 border-black p-3 text-sm font-semibold focus:outline-none shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-bold text-slate-700">Dica</label>
                  <input
                    type="text" value={formData.wordleClue}
                    onChange={e => setFormData({ ...formData, wordleClue: e.target.value })}
                    className="rounded-xl border-2 border-black p-3 text-sm font-semibold focus:outline-none shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-bold text-slate-700">Mensagem ao Vencer</label>
                  <textarea
                    rows={3} value={formData.wordleWinMessage}
                    onChange={e => setFormData({ ...formData, wordleWinMessage: e.target.value })}
                    className="rounded-xl border-2 border-black p-3 text-sm font-semibold focus:outline-none shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                  />
                </div>
              </div>
              <FunnelNavigation onBack={prevStep} onAdd={addProduct} onSkip={skipProduct} showSkip />
            </ProductStepCard>
          )}

          {/* ───────────────────────────────────────────────────────────────
             STEP 7: ROULETTE
             ─────────────────────────────────────────────────────────────── */}
          {FUNNEL_STEPS[step]?.id === 'roulette' && (
            <ProductStepCard
              title="Roleta Surpresa"
              subtitle="Uma roleta divertida para decidir o próximo programa do casal!"
              icon={<Gift className="h-6 w-6 text-orange-500" />}
              accentColor="orange"
            >
              <div className="space-y-4">
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-bold text-slate-700">Pergunta/Título</label>
                  <input
                    type="text" value={formData.rouletteTitle}
                    onChange={e => setFormData({ ...formData, rouletteTitle: e.target.value })}
                    className="rounded-xl border-2 border-black p-3 text-sm font-semibold focus:outline-none shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 block">Opções da Roleta</label>
                  {formData.rouletteOptions.map((opt, idx) => (
                    <div key={idx} className="flex gap-2 items-center">
                      <input type="text" value={opt} onChange={e => { const u = [...formData.rouletteOptions]; u[idx] = e.target.value; setFormData({ ...formData, rouletteOptions: u }); }} className="w-full rounded-xl border border-black/30 p-2 text-xs font-semibold focus:outline-none" />
                      <button type="button" onClick={() => setFormData({ ...formData, rouletteOptions: formData.rouletteOptions.filter((_, i) => i !== idx) })} disabled={formData.rouletteOptions.length <= 2} className="p-2 border-2 border-black rounded-xl text-slate-400 hover:text-rose-600 disabled:opacity-30 bg-white">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                  <button type="button" onClick={() => setFormData({ ...formData, rouletteOptions: [...formData.rouletteOptions, 'Nova Opção'] })} className="w-full flex items-center justify-center gap-1.5 rounded-xl border-2 border-black bg-white p-2 text-xs font-bold text-slate-600 hover:bg-slate-50">
                    <Plus className="h-4 w-4" /> Adicionar Opção
                  </button>
                </div>
              </div>
              <FunnelNavigation onBack={prevStep} onAdd={addProduct} onSkip={skipProduct} showSkip />
            </ProductStepCard>
          )}

          {/* ───────────────────────────────────────────────────────────────
             STEP 8: CHECKOUT
             ─────────────────────────────────────────────────────────────── */}
          {FUNNEL_STEPS[step]?.id === 'checkout' && (
            <div className="space-y-6">
              {/* Summary of Added Products */}
              <div className="rounded-[2rem] border-2 border-black bg-white p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
                <h2 className="text-xl font-black mb-4 text-slate-800 uppercase tracking-wide flex items-center gap-2">
                  <Package className="h-6 w-6 text-rose-600" />
                  Resumo do Presente
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {FUNNEL_STEPS.filter(s => s.id !== 'intro' && s.id !== 'checkout').map(s => {
                    const isAdded = addedProducts.has(s.id);
                    const StIcon = s.icon;
                    return (
                      <div key={s.id} className={`flex items-center gap-2 p-3 rounded-xl border-2 text-xs font-bold transition-all ${
                        isAdded ? 'border-emerald-500 bg-emerald-50 text-emerald-700' : 'border-slate-200 bg-slate-50 text-slate-400 line-through'
                      }`}>
                        <StIcon className="h-4 w-4" />
                        {s.emoji} {s.label}
                        {isAdded && <Check className="h-3.5 w-3.5 ml-auto text-emerald-600" />}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Pricing */}
              <div className="rounded-[2rem] border-2 border-black bg-white p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] text-center">
                <h2 className="text-xl font-black mb-2 text-slate-800 uppercase tracking-wide">Escolha o seu plano</h2>
                <p className="text-xs text-slate-500 max-w-sm mx-auto mb-6 font-medium">Pagamento único sem mensalidades.</p>
                <div className="flex flex-col sm:flex-row gap-6 justify-center">
                  <div className="flex-1 rounded-3xl border-2 border-black bg-white p-6 flex flex-col justify-between shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[-2px] transition-all">
                    <div>
                      <span className="text-[10px] font-black text-slate-400 tracking-wider uppercase">Plano Básico</span>
                      <h3 className="text-lg font-bold text-slate-800 mt-1">24 Horas</h3>
                      <p className="text-xs text-slate-500 mt-2 leading-relaxed">Presente no ar por 24h.</p>
                    </div>
                    <div className="my-6">
                      <span className="text-xs font-semibold text-slate-400">R$</span>
                      <span className="text-3xl font-black text-slate-800 ml-1">24,90</span>
                    </div>
                    <button type="button" className="w-full py-3 px-4 rounded-xl border-2 border-b-[4px] border-black bg-white hover:bg-slate-50 font-bold text-xs tracking-wider transition-all">
                      Selecionar Básico
                    </button>
                  </div>
                  <div className="flex-1 rounded-3xl border-2 border-[#E11D48] bg-rose-50/50 p-6 flex flex-col justify-between shadow-[4px_4px_0px_0px_rgba(225,29,72,1)] relative hover:translate-y-[-2px] transition-all">
                    <div className="absolute top-[-12px] left-1/2 -translate-x-1/2 bg-[#E11D48] text-[9px] font-black tracking-widest text-white uppercase px-3 py-1 rounded-full border border-black shadow-sm">
                      Mais Popular ⭐
                    </div>
                    <div>
                      <span className="text-[10px] font-black text-rose-500 tracking-wider uppercase mt-2 block">Plano Completo</span>
                      <h3 className="text-lg font-bold text-[#E11D48] mt-1">Vitalício</h3>
                      <p className="text-xs text-slate-600 mt-2 leading-relaxed">Para sempre, sem data de expiração.</p>
                    </div>
                    <div className="my-6">
                      <span className="text-xs font-semibold text-slate-400">R$</span>
                      <span className="text-4xl font-black text-rose-600 ml-1">34,90</span>
                    </div>
                    <button type="button" className="w-full py-3.5 px-4 rounded-xl border-2 border-b-[4px] border-black bg-rose-600 hover:bg-rose-700 font-bold text-xs text-white tracking-wider transition-all shadow-md">
                      Selecionar Vitalício ↗
                    </button>
                  </div>
                </div>
              </div>

              {/* Payment Form */}
              <div className="rounded-[2rem] border-2 border-black bg-white p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
                <h2 className="text-xl font-black mb-4 text-slate-800 uppercase tracking-wide">Finalizar Pagamento</h2>
                <form onSubmit={handleCheckoutSubmit} className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="font-bold text-sm text-slate-700 border-b border-slate-100 pb-2">Informações Cadastrais</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-bold text-slate-600">Nome Completo</label>
                        <input type="text" required value={paymentData.name} onChange={e => setPaymentData({ ...paymentData, name: e.target.value })} placeholder="João da Silva" className="rounded-xl border border-black/30 p-2.5 text-xs font-semibold focus:outline-none bg-white" />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-bold text-slate-600">CPF</label>
                        <input type="text" required value={paymentData.cpf} onChange={e => setPaymentData({ ...paymentData, cpf: e.target.value })} placeholder="123.456.789-00" className="rounded-xl border border-black/30 p-2.5 text-xs font-semibold focus:outline-none bg-white" />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-bold text-slate-600">E-mail</label>
                        <input type="email" required value={paymentData.email} onChange={e => setPaymentData({ ...paymentData, email: e.target.value })} placeholder="joao@email.com" className="rounded-xl border border-black/30 p-2.5 text-xs font-semibold focus:outline-none bg-white" />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-bold text-slate-600">WhatsApp</label>
                        <input type="tel" required value={paymentData.phone} onChange={e => setPaymentData({ ...paymentData, phone: e.target.value })} placeholder="(11) 99999-9999" className="rounded-xl border border-black/30 p-2.5 text-xs font-semibold focus:outline-none bg-white" />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-bold text-sm text-slate-700 border-b border-slate-100 pb-2">Forma de Pagamento</h3>
                    <div className="flex gap-4">
                      <button type="button" onClick={() => setPaymentData({ ...paymentData, paymentMethod: 'pix' })} className={`flex-1 p-3.5 rounded-xl border-2 border-black font-bold text-xs flex items-center justify-center gap-1.5 ${paymentData.paymentMethod === 'pix' ? 'bg-rose-50 border-rose-600 text-rose-600 shadow-sm' : 'bg-white hover:bg-slate-50'}`}>
                        <QrCode className="h-5 w-5" /> PIX
                      </button>
                      <button type="button" onClick={() => setPaymentData({ ...paymentData, paymentMethod: 'card' })} className={`flex-1 p-3.5 rounded-xl border-2 border-black font-bold text-xs flex items-center justify-center gap-1.5 ${paymentData.paymentMethod === 'card' ? 'bg-rose-50 border-rose-600 text-rose-600 shadow-sm' : 'bg-white hover:bg-slate-50'}`}>
                        <CreditCard className="h-5 w-5" /> Cartão
                      </button>
                    </div>
                    {paymentData.paymentMethod === 'pix' && (
                      <div className="p-4 rounded-2xl bg-rose-50/50 border border-rose-100/60 flex flex-col items-center text-center">
                        <div className="h-28 w-28 bg-white border border-slate-200 p-2 rounded-xl mb-3">
                          <div className="h-full w-full bg-slate-900 flex items-center justify-center text-white text-[8px] font-black select-none">MOCK QR</div>
                        </div>
                        <span className="text-[10px] font-black text-rose-600 uppercase tracking-widest mb-1">COPIA E COLA</span>
                        <code className="text-xs bg-white border border-slate-200 px-3 py-2 rounded-xl select-all font-mono font-medium max-w-xs truncate">00020101021226830014br.gov.bcb.pix</code>
                      </div>
                    )}
                    {paymentData.paymentMethod === 'card' && (
                      <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                        <input type="text" value={paymentData.cardNumber} onChange={e => setPaymentData({ ...paymentData, cardNumber: e.target.value })} placeholder="Número do Cartão" className="w-full rounded-lg border border-slate-300 p-2 text-xs font-semibold focus:outline-none bg-white" />
                        <div className="grid grid-cols-2 gap-3">
                          <input type="text" value={paymentData.cardExpiry} onChange={e => setPaymentData({ ...paymentData, cardExpiry: e.target.value })} placeholder="MM/AA" className="rounded-lg border border-slate-300 p-2 text-xs font-semibold focus:outline-none bg-white" />
                          <input type="text" value={paymentData.cardCvv} onChange={e => setPaymentData({ ...paymentData, cardCvv: e.target.value })} placeholder="CVV" className="rounded-lg border border-slate-300 p-2 text-xs font-semibold focus:outline-none bg-white" />
                        </div>
                        <input type="text" value={paymentData.cardName} onChange={e => setPaymentData({ ...paymentData, cardName: e.target.value })} placeholder="Nome no Cartão" className="w-full rounded-lg border border-slate-300 p-2 text-xs font-semibold focus:outline-none bg-white" />
                      </div>
                    )}
                  </div>

                  <div className="flex justify-between border-t-2 border-black/10 pt-6">
                    <button type="button" onClick={prevStep} className="flex items-center gap-1.5 rounded-2xl border-2 border-b-[4px] border-black bg-white px-5 py-3 font-bold hover:bg-slate-50 transition-all">
                      <ArrowLeft className="h-5 w-5" /> Voltar
                    </button>
                    <button type="submit" disabled={loading} className="flex items-center justify-center gap-2 rounded-2xl border-2 border-b-[4px] border-black bg-rose-600 px-8 py-3.5 font-bold text-white shadow-md hover:bg-rose-700 transition-all">
                      {loading ? <RefreshCw className="h-5 w-5 animate-spin" /> : <><Check className="h-5 w-5" />Pagar e Ativar ↗</>}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

        </div>

        {/* ════════════════════════════════════════════════════════════════════
           RIGHT PANEL: Live Mobile Preview
           ════════════════════════════════════════════════════════════════════ */}
        <div className="hidden lg:block lg:col-span-5 sticky top-6">
          <div className="flex flex-col items-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-rose-200 bg-rose-100 px-4 py-1.5 text-xs font-black tracking-widest text-[#E11D48] uppercase shadow-sm">
              <Eye className="h-4 w-4" />
              Preview ao Vivo
              <span className="text-[9px] bg-emerald-500 text-white px-1.5 py-0.5 rounded-full font-black">{addedProducts.size} produtos</span>
            </div>
            <div className="relative h-[680px] w-[320px] rounded-[3rem] border-[10px] border-[#1a1a1a] bg-[#121212] p-1.5 shadow-[0px_25px_50px_-12px_rgba(0,0,0,0.4)] overflow-hidden">
              <div className="absolute left-1/2 top-0 z-40 h-5 w-28 -translate-x-1/2 rounded-b-2xl bg-[#1a1a1a]" />
              <div className="absolute top-1.5 left-0 w-full px-6 flex justify-between text-[9px] font-bold text-white/50 z-30 select-none pointer-events-none">
                <span>09:41</span>
                <div className="flex gap-1"><span>5G</span><span>100%</span></div>
              </div>
              <div className="h-full w-full overflow-y-auto overflow-x-hidden rounded-[2.5rem] pt-6 scrollbar-hide bg-[#121212]">
                <LivePreview data={formData} addedProducts={addedProducts} currentStep={FUNNEL_STEPS[step]?.id || 'intro'} />
              </div>
            </div>
            <p className="mt-3 text-xs font-semibold text-slate-400">* Atualiza conforme você configura.</p>
          </div>
        </div>

      </div>

      {/* Mobile Preview FAB */}
      <div className="lg:hidden fixed bottom-6 left-6 z-40">
        <button onClick={() => setMobilePreviewOpen(true)} className="flex items-center justify-center gap-2 rounded-full border-2 border-b-[4px] border-black bg-rose-600 px-5 py-3 font-extrabold text-white text-xs tracking-wider shadow-lg active:scale-95 transition-all">
          <Eye className="h-4 w-4" /> Preview
        </button>
      </div>

      {/* Mobile Preview Overlay */}
      {mobilePreviewOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative w-full max-w-sm rounded-[2.5rem] border-[8px] border-black p-2 shadow-2xl h-[90vh] flex flex-col bg-[#121212]">
            <button onClick={() => setMobilePreviewOpen(false)} className="absolute top-4 right-4 z-40 flex h-9 w-9 items-center justify-center rounded-full bg-white border-2 border-black shadow hover:bg-rose-50">
              <X className="h-5 w-5 text-black" />
            </button>
            <div className="h-full w-full overflow-y-auto overflow-x-hidden rounded-[1.8rem] pt-10 pb-6 scrollbar-hide">
              <LivePreview data={formData} addedProducts={addedProducts} currentStep={FUNNEL_STEPS[step]?.id || 'intro'} />
            </div>
          </div>
        </div>
      )}

    </main>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// REUSABLE COMPONENTS
// ═══════════════════════════════════════════════════════════════════════════

// Product step card wrapper
function ProductStepCard({ title, subtitle, icon, accentColor, children }: {
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  accentColor: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-[2rem] border-2 border-black bg-white p-6 sm:p-8 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
      <div className="flex items-start gap-3 mb-6">
        <div className={`flex h-12 w-12 items-center justify-center rounded-2xl border-2 border-black bg-${accentColor}-50 shadow-sm flex-shrink-0`}>
          {icon}
        </div>
        <div>
          <h2 className="text-lg font-black text-slate-800 uppercase tracking-wide">{title}</h2>
          <p className="text-xs text-slate-500 font-medium mt-0.5 leading-relaxed">{subtitle}</p>
        </div>
      </div>
      {children}
    </div>
  );
}

// Funnel navigation buttons
function FunnelNavigation({ onBack, onAdd, onSkip, showSkip }: {
  onBack: () => void;
  onAdd: () => void;
  onSkip?: () => void;
  showSkip?: boolean;
}) {
  return (
    <div className="mt-8 flex flex-col sm:flex-row gap-3 sm:justify-between border-t-2 border-black/10 pt-6">
      <button onClick={onBack} className="flex items-center gap-1.5 rounded-2xl border-2 border-b-[4px] border-black bg-white px-5 py-3 font-bold hover:bg-slate-50 transition-all active:scale-95 order-2 sm:order-1">
        <ArrowLeft className="h-5 w-5" /> Voltar
      </button>
      <div className="flex gap-3 order-1 sm:order-2">
        {showSkip && onSkip && (
          <button onClick={onSkip} className="flex items-center gap-1.5 rounded-2xl border-2 border-b-[4px] border-black bg-slate-100 px-5 py-3 font-bold text-slate-500 hover:bg-slate-200 transition-all active:scale-95 text-sm">
            Pular
          </button>
        )}
        <button onClick={onAdd} className="flex items-center gap-2 rounded-2xl border-2 border-b-[4px] border-black bg-emerald-600 px-6 py-3 font-bold text-white shadow-md hover:bg-emerald-700 transition-all active:scale-95">
          <Sparkles className="h-5 w-5" /> Adicionar ao Presente
        </button>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// LIVE PREVIEW COMPONENT
// ═══════════════════════════════════════════════════════════════════════════
function LivePreview({ data, addedProducts, currentStep }: {
  data: GiftFormData;
  addedProducts: Set<string>;
  currentStep: string;
}) {
  const [timeTogether, setTimeTogether] = useState({
    years: 0, months: 0, days: 0, hours: 0, minutes: 0, seconds: 0
  });

  useEffect(() => {
    const calculateTime = () => {
      const now = new Date();
      const start = new Date(`${data.date}T${data.time || '12:00'}:00`);
      if (isNaN(start.getTime())) return;
      let diffMs = now.getTime() - start.getTime();
      if (diffMs < 0) diffMs = 0;
      const diffSecs = Math.floor(diffMs / 1000);
      const diffMins = Math.floor(diffSecs / 60);
      const diffHours = Math.floor(diffMins / 60);
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
  }, [data.date, data.time]);

  const showProduct = (id: string) => addedProducts.has(id) || currentStep === id;

  return (
    <div className="px-3 pb-16 text-[11px] leading-normal font-sans text-zinc-200">

      {/* Spotify Header */}
      <div className="flex items-center justify-between w-full px-2 py-3 mb-2 text-white">
        <ChevronDown className="h-5 w-5 text-zinc-400" />
        <span className="text-[8px] font-black uppercase tracking-widest text-zinc-400">
          {data.receiverName ? `Para ${data.receiverName}` : 'Love Valentine'}
        </span>
        <MoreHorizontal className="h-5 w-5 text-zinc-400" />
      </div>

      {/* ─── Spotify Player Section ─── */}
      {showProduct('spotify') && (
        <div className="mb-6 rounded-[1.8rem] border-2 border-black bg-gradient-to-b from-[#7a1c2e] via-[#121212] to-[#121212] text-white p-4 shadow-md overflow-hidden font-sans select-none">
          <div
            className="aspect-square w-full rounded-2xl border border-black bg-cover bg-center shadow-sm mb-3.5"
            style={{ backgroundImage: `url(${data.bgPhoto || PRESET_BACKDROPS[0].url})` }}
          />
          <div className="flex items-center justify-between mb-3">
            <div className="overflow-hidden pr-3">
              <h3 className="text-xs font-black truncate text-white leading-normal">
                {data.giverName || 'Seu Nome'} & {data.receiverName || 'Nome Dela(e)'}
              </h3>
              <p className="text-[9px] text-zinc-400 font-semibold truncate">
                {data.counterTopText || 'Playlist do Amor'}
              </p>
            </div>
            <div className="flex h-4.5 w-4.5 items-center justify-center rounded-full bg-[#1db954] text-black flex-shrink-0">
              <Check className="h-2.5 w-2.5 stroke-[3.5]" />
            </div>
          </div>

          {/* Seekbar */}
          <div className="space-y-1 mb-3">
            <div className="h-1 w-full bg-zinc-800 rounded-full overflow-hidden relative">
              <div className="h-full bg-rose-600 rounded-full transition-all duration-1000" style={{ width: `${(timeTogether.seconds % 60) * 1.67}%` }} />
            </div>
            <div className="flex justify-between text-[8px] font-bold text-zinc-500">
              <span>0:{String(timeTogether.seconds % 60).padStart(2, '0')}</span>
              <span>-{String(60 - (timeTogether.seconds % 60)).padStart(2, '0')}</span>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-between px-3 mb-5">
            <button className="text-zinc-500 hover:text-white transition-colors"><Shuffle className="h-3.5 w-3.5" /></button>
            <button className="text-white hover:scale-105 transition-transform"><SkipBack className="h-4.5 w-4.5 fill-current" /></button>
            <button className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-black hover:scale-105 active:scale-95 transition-transform shadow-md">
              <Play className="h-4.5 w-4.5 fill-current ml-0.5" />
            </button>
            <button className="text-white hover:scale-105 transition-transform"><SkipForward className="h-4.5 w-4.5 fill-current" /></button>
            <button className="text-zinc-500 hover:text-white transition-colors"><Repeat className="h-3.5 w-3.5" /></button>
          </div>

          {/* Spotify Embed */}
          {data.musicUrl && data.musicUrl.includes('spotify.com') && (() => {
            const trackId = getSpotifyTrackId(data.musicUrl);
            if (!trackId) return null;
            return (
              <div className="mb-4 rounded-xl overflow-hidden border border-black bg-black">
                <iframe src={`https://open.spotify.com/embed/track/${trackId}?utm_source=generator`} width="100%" height="80" frameBorder="0" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy" className="rounded-xl" />
              </div>
            );
          })()}

          {/* Lyrics Card (Timer) */}
          <div className="rounded-2xl bg-white/5 border border-white/10 p-4 shadow-inner relative overflow-hidden">
            <div className="absolute top-3 right-3 text-white/5 font-serif text-5xl select-none font-bold leading-none">,,</div>
            <h4 className="text-[8px] font-black tracking-widest text-rose-500 uppercase mb-2">Letra (Tempo Juntos)</h4>
            <div className="space-y-2 font-bold text-[10px] text-white tracking-tight leading-snug">
              <p className="opacity-100">Já se passaram <span className="text-rose-500 font-extrabold text-xs">{timeTogether.years}</span> anos de amor...</p>
              <p className="opacity-95">E <span className="text-rose-500 font-extrabold text-xs">{timeTogether.months}</span> meses inesquecíveis.</p>
              <p className="opacity-90">Há <span className="text-rose-500 font-extrabold text-xs">{timeTogether.days}</span> dias sorrindo ao seu lado,</p>
              <p className="opacity-85">Contando <span className="text-rose-500 font-extrabold text-xs">{String(timeTogether.hours).padStart(2, '0')}</span> horas de carinho,</p>
              <p className="opacity-80">Com <span className="text-rose-500 font-extrabold text-xs">{String(timeTogether.minutes).padStart(2, '0')}</span> minutos de cumplicidade,</p>
              <p className="text-rose-400 font-black animate-pulse">A cada <span className="text-white font-extrabold text-sm">{String(timeTogether.seconds).padStart(2, '0')}</span> segundos mais feliz! ❤️</p>
            </div>
          </div>

          {/* Romantic Message */}
          <div className="rounded-2xl border border-black bg-zinc-900 p-4 relative mt-4">
            <span className="block text-[8px] font-black text-rose-500 uppercase mb-1">MENSAGEM</span>
            <p className="text-zinc-200 text-[9px] leading-relaxed whitespace-pre-line font-medium">
              {data.romanticMessage || 'Sua mensagem de amor aparecerá aqui...'}
            </p>
          </div>
        </div>
      )}

      {/* ─── Meet Couple Section ─── */}
      {showProduct('wrapped') && data.meetCouple && data.meetCards && data.meetCards.length > 0 && (
        <div className="mb-6">
          <div className="flex items-center gap-1 mb-3">
            <Heart className="h-3.5 w-3.5 fill-current text-rose-600" />
            <span className="font-black text-[9px] uppercase tracking-wider">Conheça o Casal</span>
          </div>
          <div className="grid grid-cols-1 gap-4">
            {data.meetCards.map((card, i) => (
              <div key={i} className="bg-white/5 border border-white/10 rounded-[1.2rem] p-3 flex flex-col items-center text-center">
                <div className="w-full h-24 rounded-lg overflow-hidden border border-white/10 mb-2 bg-white/5 flex items-center justify-center">
                  {card.photo ? <img src={card.photo} alt={card.title} className="w-full h-full object-cover" /> : <Heart className="h-8 w-8 text-rose-200/30 fill-current animate-pulse" />}
                </div>
                <h4 className="font-extrabold text-[10px] text-white">{card.title || 'Marco'}</h4>
                <p className="text-[8px] text-zinc-400 font-medium leading-relaxed mt-0.5">{card.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ─── Timeline Section ─── */}
      {showProduct('wrapped') && data.timelineEvents && data.timelineEvents.length > 0 && (
        <div className="mb-6">
          <div className="flex items-center gap-1 mb-3">
            <Sparkles className="h-3.5 w-3.5 text-rose-600" />
            <span className="font-black text-[9px] uppercase tracking-wider">Nossa Linha do Tempo</span>
          </div>
          <div className="border-l-2 border-rose-600/40 ml-2 pl-3 space-y-4">
            {data.timelineEvents.map((evt, i) => (
              <div key={i} className="relative">
                <div className="absolute -left-[18px] top-1 flex h-4.5 w-4.5 items-center justify-center rounded-full border border-rose-600 bg-rose-600 text-[8px] font-bold text-white shadow">{i + 1}</div>
                <div className="rounded-xl border border-white/10 bg-white/5 p-2.5 shadow-sm">
                  <span className="text-[8px] font-bold text-rose-500">{new Date(evt.date).toLocaleDateString('pt-BR')}</span>
                  <h4 className="font-bold text-[10px] mt-0.5 text-white">{evt.title}</h4>
                  <p className="text-zinc-400 text-[8px] mt-0.5 leading-normal">{evt.description}</p>
                  {evt.photo && <img src={evt.photo} alt="Photo" className="mt-2 w-full h-20 object-cover rounded border border-white/10 shadow-sm" />}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ─── Gallery Section ─── */}
      {showProduct('gallery') && data.galleryImages && data.galleryImages.length > 0 && (
        <div className="mb-6">
          <div className="flex items-center gap-1 mb-3">
            <ImageIcon className="h-3.5 w-3.5 text-rose-600" />
            <span className="font-black text-[9px] uppercase tracking-wider">Melhores Fotos</span>
          </div>
          {data.galleryLayout === 'stories' ? (
            <StoriesView images={data.galleryImages} />
          ) : (
            <CardsView images={data.galleryImages} />
          )}
        </div>
      )}

      {/* ─── StarMap Section ─── */}
      {showProduct('starmap') && data.starMapCity && (
        <div className="mb-6">
          <div className="flex items-center gap-1 mb-3">
            <Star className="h-3.5 w-3.5 text-rose-600" />
            <span className="font-black text-[9px] uppercase tracking-wider">Mapa das Estrelas</span>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-center">
            <StarMapMock date={data.date} city={data.starMapCity} />
            <p className="text-[9px] font-bold text-white mt-3 uppercase tracking-wider">Céu de {data.starMapCity}</p>
            <p className="text-[7px] text-zinc-500 font-semibold mt-0.5">{new Date(data.date).toLocaleDateString('pt-BR', { dateStyle: 'long' })}</p>
          </div>
        </div>
      )}

      {/* ─── WorldMap Section ─── */}
      {showProduct('worldmap') && data.worldMapLocations && data.worldMapLocations.length > 0 && (
        <div className="mb-6">
          <div className="flex items-center gap-1 mb-3">
            <MapPin className="h-3.5 w-3.5 text-rose-600" />
            <span className="font-black text-[9px] uppercase tracking-wider">{data.worldMapTitle || 'Nossa Jornada'}</span>
          </div>
          <WorldMapVisualizer
            title={data.worldMapTitle || 'Nossa Jornada'}
            subtitle={data.worldMapSubtitle || 'Cidades que visitamos'}
            locations={data.worldMapLocations}
          />
        </div>
      )}

      {/* ─── Wordle Section ─── */}
      {showProduct('wordle') && data.wordleWord && (
        <div className="mb-6">
          <div className="flex items-center gap-1 mb-3">
            <HelpCircle className="h-3.5 w-3.5 text-rose-600" />
            <span className="font-black text-[9px] uppercase tracking-wider">Desafio Wordle</span>
          </div>
          <WordleGame
            word={data.wordleWord}
            clue={data.wordleClue || 'Uma dica romântica...'}
            winMessage={data.wordleWinMessage || 'Você acertou!'}
            giverName={data.giverName || 'Seu Amor'}
          />
        </div>
      )}

      {/* ─── Roulette Section ─── */}
      {showProduct('roulette') && data.rouletteOptions && data.rouletteOptions.length > 1 && (
        <div className="mb-6">
          <div className="flex items-center gap-1 mb-3">
            <Gift className="h-3.5 w-3.5 text-rose-600" />
            <span className="font-black text-[9px] uppercase tracking-wider">Roleta Surpresa</span>
          </div>
          <RouletteWheel
            title={data.rouletteTitle || 'O que faremos?'}
            options={data.rouletteOptions}
          />
        </div>
      )}

      {/* Empty state */}
      {addedProducts.size === 0 && currentStep === 'intro' && (
        <div className="flex flex-col items-center justify-center text-center py-12 text-zinc-500">
          <Gift className="h-10 w-10 text-zinc-600 mb-3 animate-pulse" />
          <p className="text-xs font-bold">Seu presente aparecerá aqui</p>
          <p className="text-[9px] mt-1">Configure os dados do casal para começar.</p>
        </div>
      )}

    </div>
  );
}
