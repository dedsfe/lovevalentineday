"use client";

import React, { useState, useMemo } from "react";
import { SpotifyProduct } from "@/components/products";
import { mockSpotifyProductData } from "@/components/products/SpotifyProduct/SpotifyProduct.mock";
import { LovePlayerMusic, LovePlayerImage } from "@/components/products/SpotifyProduct/SpotifyProduct.types";
import { Sparkles, Monitor, Tablet, Layers, Type, Calendar, MapPin, Plus, Trash2, Search, Music } from "lucide-react";

// Mock database for song search simulation
const MOCK_SPOTIFY_RESULTS: LovePlayerMusic[] = [
  {
    id: "4PTG3Z6ehGkBFzI7Y1rqy",
    title: "Yellow",
    artist: "Coldplay",
    albumName: "Parachutes",
    albumImageUrl: "https://i.scdn.co/image/ab67616d0000b2739164d557616292a54308d029",
    spotifyUrl: "https://open.spotify.com/track/4PTG3Z6ehGkBFzI7Y1rqy",
  },
  {
    id: "7tFieVDaaZ9o8Y65Xv5M97",
    title: "Perfect",
    artist: "Ed Sheeran",
    albumName: "÷ (Deluxe)",
    albumImageUrl: "https://i.scdn.co/image/ab67616d0000b273ba5db46f4b838ef6ee27ee23",
    spotifyUrl: "https://open.spotify.com/track/7tFieVDaaZ9o8Y65Xv5M97",
  },
  {
    id: "3ee8JWhZHYImw5L28Of86g",
    title: "All of Me",
    artist: "John Legend",
    albumName: "Love in the Future",
    albumImageUrl: "https://i.scdn.co/image/ab67616d0000b2733d82f71887ce1b29d443ee9e",
    spotifyUrl: "https://open.spotify.com/track/3ee8JWhZHYImw5L28Of86g",
  },
  {
    id: "4jDmrpzw7oOhXg45td5tBS",
    title: "Ocean Eyes",
    artist: "Billie Eilish",
    albumName: "Don't Smile at Me",
    albumImageUrl: "https://i.scdn.co/image/ab67616d0000b273b2a2649a3a1f86f7db191d8e",
    spotifyUrl: "https://open.spotify.com/track/4jDmrpzw7oOhXg45td5tBS",
  },
];

export default function SpotifyProductPage() {
  const [compact, setCompact] = useState(false);

  // States mirroring LovePlayerData
  const [partnerOneName, setPartnerOneName] = useState(mockSpotifyProductData.partnerOneName);
  const [partnerTwoName, setPartnerTwoName] = useState(mockSpotifyProductData.partnerTwoName);
  const [relationshipDate, setRelationshipDate] = useState(mockSpotifyProductData.relationshipDate);
  const [city, setCity] = useState(mockSpotifyProductData.city);
  const [giftTitle, setGiftTitle] = useState(mockSpotifyProductData.giftTitle);
  const [selectedMusic, setSelectedMusic] = useState<LovePlayerMusic>(mockSpotifyProductData.selectedMusic);
  const [coverImages, setCoverImages] = useState<LovePlayerImage[]>(mockSpotifyProductData.coverImages);
  const [specialMessage, setSpecialMessage] = useState(mockSpotifyProductData.specialMessage);
  const [memoryImage, setMemoryImage] = useState<LovePlayerImage | undefined>(mockSpotifyProductData.memoryImage);

  // Music search state
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearchResults, setShowSearchResults] = useState(false);

  const titleSuggestions = mockSpotifyProductData.titleSuggestions || [];

  // Filter music results mock
  const filteredMusicResults = useMemo(() => {
    if (!searchQuery.trim()) return MOCK_SPOTIFY_RESULTS;
    return MOCK_SPOTIFY_RESULTS.filter(
      (song) =>
        song.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        song.artist.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  // Image helpers
  const handleUpdateImageUrl = (index: number, val: string) => {
    setCoverImages((prev) => {
      const copy = [...prev];
      if (copy[index]) {
        copy[index] = { ...copy[index], url: val };
      }
      return copy;
    });
  };

  const handleAddImage = () => {
    if (coverImages.length >= 6) return;
    setCoverImages((prev) => [
      ...prev,
      { id: `img-${Date.now()}`, url: "https://images.unsplash.com/photo-1518199266791-5375a83164ba?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80", alt: "Nova foto" },
    ]);
  };

  const handleRemoveImage = (index: number) => {
    setCoverImages((prev) => prev.filter((_, i) => i !== index));
  };

  // Build current LovePlayerData
  const productData = useMemo(() => {
    return {
      partnerOneName,
      partnerTwoName,
      relationshipDate,
      city,
      giftTitle,
      selectedMusic,
      coverImages,
      specialMessage,
      memoryImage,
    };
  }, [
    partnerOneName,
    partnerTwoName,
    relationshipDate,
    city,
    giftTitle,
    selectedMusic,
    coverImages,
    specialMessage,
    memoryImage,
  ]);

  return (
    <main className="min-h-screen bg-[#070707] text-zinc-300 font-sans flex flex-col lg:flex-row">
      {/* ── Left Creation panel ── */}
      <section className="w-full lg:w-[48%] border-b lg:border-b-0 lg:border-r border-zinc-900 bg-zinc-950 p-6 sm:p-10 flex flex-col gap-8 overflow-y-auto max-h-screen scrollbar-hide">
        {/* Header branding */}
        <div className="flex items-center gap-3">
          <div className="bg-[#800a0a]/20 text-[#E0A96D] p-2 rounded-2xl border border-[#800a0a]/40 shadow-sm">
            <Sparkles className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-base font-black text-white uppercase tracking-wider">
              Love Player Studio
            </h1>
            <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mt-0.5">
              Refinamento de Produto • Paridade de visualização
            </p>
          </div>
        </div>

        {/* Form sections */}
        <div className="flex flex-col gap-6">
          {/* Section 1: Couple Info */}
          <div className="space-y-4">
            <h2 className="text-xs font-black uppercase text-white/40 tracking-wider flex items-center gap-1.5 border-b border-zinc-900 pb-2">
              <Type className="h-4 w-4" /> 1. Protagonistas e Data
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-zinc-400 uppercase">Nome Parceiro 1</label>
                <input
                  type="text"
                  value={partnerOneName}
                  onChange={(e) => setPartnerOneName(e.target.value)}
                  className="bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-zinc-700 transition-all"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-zinc-400 uppercase">Nome Parceiro 2</label>
                <input
                  type="text"
                  value={partnerTwoName}
                  onChange={(e) => setPartnerTwoName(e.target.value)}
                  className="bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-zinc-700 transition-all"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-zinc-400 uppercase">Data de Início</label>
                <input
                  type="date"
                  value={relationshipDate}
                  onChange={(e) => setRelationshipDate(e.target.value)}
                  className="bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-zinc-700 transition-all"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-zinc-400 uppercase">Cidade</label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-zinc-700 transition-all"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Gift Title */}
          <div className="space-y-4">
            <h2 className="text-xs font-black uppercase text-white/40 tracking-wider flex items-center gap-1.5 border-b border-zinc-900 pb-2">
              <Sparkles className="h-4 w-4" /> 2. Título do Presente
            </h2>
            <div className="flex flex-col gap-2">
              <input
                type="text"
                value={giftTitle}
                onChange={(e) => setGiftTitle(e.target.value)}
                placeholder="Ex: O som da nossa história"
                className="bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-zinc-700 transition-all"
              />
              {/* Suggestion pills */}
              <div className="flex flex-wrap gap-1.5 mt-1">
                {titleSuggestions.map((sug, i) => (
                  <button
                    key={i}
                    onClick={() => setGiftTitle(sug)}
                    className={`px-3 py-1.5 rounded-full text-[9px] font-bold border transition-all cursor-pointer ${
                      giftTitle === sug
                        ? "bg-[#E0A96D] text-black border-transparent"
                        : "bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white"
                    }`}
                  >
                    {sug}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Section 3: Music Search mock */}
          <div className="space-y-4 relative">
            <h2 className="text-xs font-black uppercase text-white/40 tracking-wider flex items-center gap-1.5 border-b border-zinc-900 pb-2">
              <Search className="h-4 w-4" /> 3. Música do Spotify (API Mock)
            </h2>
            <div className="flex flex-col gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-zinc-500" />
                <input
                  type="text"
                  placeholder="Pesquisar música ou artista..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setShowSearchResults(true);
                  }}
                  onFocus={() => setShowSearchResults(true)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pl-9 pr-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-zinc-700 transition-all"
                />
              </div>

              {/* Current track indicator */}
              <div className="bg-zinc-900/50 rounded-xl border border-zinc-850 p-3.5 flex items-center gap-3">
                <div className="h-10 w-10 bg-zinc-800 rounded-lg overflow-hidden flex items-center justify-center">
                  {selectedMusic.albumImageUrl ? (
                    <img src={selectedMusic.albumImageUrl} alt="Album" className="w-full h-full object-cover" />
                  ) : (
                    <Music className="h-5 w-5 text-zinc-500" />
                  )}
                </div>
                <div>
                  <span className="text-[9px] font-black tracking-widest text-[#E0A96D] uppercase block">
                    Música selecionada
                  </span>
                  <h4 className="text-xs font-black text-white mt-0.5">{selectedMusic.title}</h4>
                  <p className="text-[10px] text-zinc-500 font-bold">{selectedMusic.artist}</p>
                </div>
              </div>

              {/* Dropdown list mock */}
              {showSearchResults && (
                <div className="absolute left-0 right-0 top-[84px] bg-zinc-950 border border-zinc-800 rounded-2xl shadow-2xl p-2 z-50 flex flex-col gap-1 max-h-48 overflow-y-auto">
                  <div className="flex justify-between items-center px-2 py-1 border-b border-zinc-900 mb-1.5">
                    <span className="text-[8px] font-black text-zinc-500 uppercase tracking-widest">
                      Sugestões locais
                    </span>
                    <button
                      onClick={() => setShowSearchResults(false)}
                      className="text-[9px] text-[#E0A96D] font-bold"
                    >
                      Fechar
                    </button>
                  </div>
                  {filteredMusicResults.map((music) => (
                    <button
                      key={music.id}
                      onClick={() => {
                        setSelectedMusic(music);
                        setSearchQuery("");
                        setShowSearchResults(false);
                      }}
                      className="flex items-center gap-3 p-2 rounded-xl hover:bg-zinc-900 text-left transition-all cursor-pointer"
                    >
                      <img src={music.albumImageUrl} className="h-8 w-8 rounded object-cover" />
                      <div>
                        <h4 className="text-xs font-black text-white leading-tight">{music.title}</h4>
                        <p className="text-[10px] text-zinc-500 font-bold">{music.artist}</p>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Section 4: Collage Cover Images */}
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-900 pb-2">
              <h2 className="text-xs font-black uppercase text-white/40 tracking-wider flex items-center gap-1.5">
                <Layers className="h-4 w-4" /> 4. Fotos de Capa (Colagem - Máx 6)
              </h2>
              <button
                disabled={coverImages.length >= 6}
                onClick={handleAddImage}
                className="text-[10px] font-black text-[#E0A96D] uppercase flex items-center gap-1 hover:underline cursor-pointer disabled:opacity-40 disabled:no-underline"
              >
                <Plus className="h-3.5 w-3.5" /> Adicionar foto
              </button>
            </div>

            <div className="flex flex-col gap-3">
              {coverImages.map((img, i) => (
                <div key={img.id} className="flex gap-2 items-center">
                  <div className="h-8 w-8 rounded-lg overflow-hidden flex-shrink-0 border border-zinc-800 bg-zinc-900">
                    <img src={img.url} className="w-full h-full object-cover" />
                  </div>
                  <input
                    type="text"
                    value={img.url}
                    onChange={(e) => handleUpdateImageUrl(i, e.target.value)}
                    className="flex-1 bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                    placeholder={`URL da Imagem ${i + 1}`}
                  />
                  <button
                    onClick={() => handleRemoveImage(i)}
                    className="p-2 bg-zinc-900 hover:bg-[#800a0a]/20 border border-zinc-800 hover:border-red-900 rounded-xl text-zinc-500 hover:text-red-500 transition-all cursor-pointer"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Section 5: Special Message */}
          <div className="space-y-4">
            <h2 className="text-xs font-black uppercase text-white/40 tracking-wider flex items-center gap-1.5 border-b border-zinc-900 pb-2">
              <Type className="h-4 w-4" /> 5. Mensagem Especial
            </h2>
            <textarea
              rows={3}
              value={specialMessage}
              onChange={(e) => setSpecialMessage(e.target.value)}
              placeholder="Sua declaração de amor..."
              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-zinc-700 transition-all resize-none"
            />
          </div>

          {/* Section 6: Memory Image */}
          <div className="space-y-4">
            <h2 className="text-xs font-black uppercase text-white/40 tracking-wider flex items-center gap-1.5 border-b border-zinc-900 pb-2">
              <Calendar className="h-4 w-4" /> 6. Foto Extra (Uma Memória)
            </h2>
            <div className="flex flex-col gap-3">
              <div className="flex flex-col gap-1.5">
                <label className="text-[9px] font-bold text-zinc-500 uppercase">URL da Imagem Extra</label>
                <input
                  type="text"
                  value={memoryImage?.url || ""}
                  onChange={(e) =>
                    setMemoryImage((prev) => ({
                      id: prev?.id || "mem-1",
                      url: e.target.value,
                      alt: prev?.alt || "",
                    }))
                  }
                  className="bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-zinc-700"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[9px] font-bold text-zinc-500 uppercase">Legenda / Polaroid Text</label>
                <input
                  type="text"
                  value={memoryImage?.alt || ""}
                  onChange={(e) =>
                    setMemoryImage((prev) => ({
                      id: prev?.id || "mem-1",
                      url: prev?.url || "",
                      alt: e.target.value,
                    }))
                  }
                  className="bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-zinc-700"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Right Stage Live Preview ── */}
      <section className="flex-1 bg-[#090909] flex flex-col items-center justify-center p-6 sm:p-12 relative">
        {/* Toggle size buttons overlay */}
        <div className="absolute top-6 right-6 z-50 flex bg-zinc-900/60 backdrop-blur-md border border-zinc-850 rounded-2xl p-1 shadow-2xl">
          <button
            onClick={() => setCompact(false)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer ${
              !compact ? "bg-[#E0A96D] text-black shadow-sm" : "text-zinc-400 hover:text-white"
            }`}
          >
            <Monitor className="h-3.5 w-3.5" /> Desktop
          </button>
          <button
            onClick={() => setCompact(true)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer ${
              compact ? "bg-[#E0A96D] text-black shadow-sm" : "text-zinc-400 hover:text-white"
            }`}
          >
            <Tablet className="h-3.5 w-3.5" /> Mobile
          </button>
        </div>

        {/* Display Wrapper */}
        <div className="w-full flex justify-center items-center">
          {compact ? (
            <div className="relative p-3 bg-zinc-950 rounded-[3.2rem] border-[10px] border-zinc-800 shadow-[0_25px_60px_rgba(0,0,0,0.8)]">
              <div className="absolute left-1/2 top-4 z-40 h-4.5 w-24 -translate-x-1/2 rounded-full bg-zinc-800" />
              <SpotifyProduct data={productData} compact={true} />
            </div>
          ) : (
            <div className="w-full max-w-lg rounded-[2.5rem] overflow-hidden border border-zinc-900 shadow-2xl bg-[#121212]">
              <SpotifyProduct data={productData} compact={false} />
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
