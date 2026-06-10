// ─── Gift Base ───────────────────────────────────────────────────────────────

export type GiftPlan = 'basic' | 'lifetime';

export interface Gift {
  id: string;
  createdAt: string;        // ISO 8601
  isPaid: boolean;
  plan: GiftPlan;

  // Sempre presente
  base: GiftBase;

  // Produtos opcionais
  spotify?:  SpotifyData;
  wrapped?:  WrappedData;
  gallery?:  GalleryData;
  starMap?:  StarMapData;
  worldMap?: WorldMapData;
  wordle?:   WordleData;
  roulette?: RouletteData;
}

export interface GiftBase {
  giverName:    string;
  receiverName: string;
  startDate:    string;      // YYYY-MM-DD
  startTime?:   string;      // HH:MM
  coverPhoto:   string;      // URL ou base64
}

// ─── Produto: Spotify Player ──────────────────────────────────────────────────

export type MusicSource = 'preset' | 'spotify';

export interface SpotifyData {
  source:           MusicSource;
  trackId?:         string;
  previewUrl?:      string;
  albumArt?:        string;
  musicUrl?:        string;
  musicTitle:       string;
  displayTitle?:    string;  // user-editable override for musicTitle
  musicArtist:      string;
  topText:          string;
  bottomText:       string;
  photos:           string[];
  specialMessage?:  string;  // "Mensagem especial" section
  closingPhoto?:    string;  // full-width photo after message
  closingCaption?:  string;  // text overlay on closing photo
  reasons?:         string[]; // "X motivos pelos quais te amo"
}

// ─── Produto: Wrapped / Retrospectiva ────────────────────────────────────────

export interface MeetCard {
  title:       string;
  description: string;
  photo?:      string;
}

export interface TimelineEvent {
  date:        string;       // YYYY-MM-DD
  title:       string;
  description: string;
  photo?:      string;
}

export interface WrappedData {
  romanticMessage: string;
  meetCards:       MeetCard[];
  timelineEvents:  TimelineEvent[];
}

// ─── Produto: Galeria de Fotos ───────────────────────────────────────────────

export type GalleryLayout = 'stories' | 'cards';

export interface GalleryImage {
  photo:    string;
  title?:   string;
  caption?: string;
}

export interface GalleryData {
  layout: GalleryLayout;
  images: GalleryImage[];
}

// ─── Produto: Mapa Estelar ───────────────────────────────────────────────────

export interface StarMapData {
  city: string;              // Ex: "São Paulo, Brasil"
}

// ─── Produto: Mapa de Viagens ─────────────────────────────────────────────────

export interface WorldMapLocation {
  placeName:        string;
  date:             string;  // YYYY-MM-DD
  photo?:           string;
  polaroidText:     string;
  locationNickname: string;
  description:      string;
}

export interface WorldMapData {
  title:     string;
  subtitle:  string;
  locations: WorldMapLocation[];
}

// ─── Produto: Wordle ─────────────────────────────────────────────────────────

export interface WordleData {
  word:       string;        // 3-10 letras maiúsculas
  clue:       string;
  winMessage: string;
}

// ─── Produto: Roleta Surpresa ────────────────────────────────────────────────

export interface RouletteData {
  title:   string;
  options: string[];         // mínimo 2
}

// ─── Funil ───────────────────────────────────────────────────────────────────

// Quais produtos estão ativos no funil (para controle de steps)
export type ProductKey = 'spotify' | 'wrapped' | 'gallery' | 'starMap' | 'worldMap' | 'wordle' | 'roulette';

export interface FunnelState {
  base:          GiftBase;
  activeProducts: Set<ProductKey>;
  spotify:       SpotifyData;
  wrapped:       WrappedData;
  gallery:       GalleryData;
  starMap:       StarMapData;
  worldMap:      WorldMapData;
  wordle:        WordleData;
  roulette:      RouletteData;
}
