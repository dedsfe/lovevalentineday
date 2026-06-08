export type LovePlayerMusic = {
  id: string;
  title: string;
  artist: string;
  albumName?: string;
  albumImageUrl?: string;
  spotifyUrl?: string;
  previewUrl?: string;
  durationMs?: number;
};

export type LovePlayerImage = {
  id: string;
  url: string;
  alt?: string;
};

export type LovePlayerData = {
  partnerOneName: string;
  partnerTwoName: string;
  relationshipDate: string;
  city: string;
  giftTitle: string;
  titleSuggestions?: string[];
  selectedMusic: LovePlayerMusic;
  coverImages: LovePlayerImage[];
  specialMessage: string;
  memoryImage?: LovePlayerImage;
};

export type SpotifyProductProps = {
  data: LovePlayerData;
  compact?: boolean;
};
