import { LovePlayerData } from "./SpotifyProduct.types";

export const mockSpotifyProductData: LovePlayerData = {
  partnerOneName: "Gabriel",
  partnerTwoName: "Alice",
  relationshipDate: "2024-06-12",
  city: "Gramado, RS",
  giftTitle: "O som da nossa história",
  titleSuggestions: [
    "Nossa trilha sonora",
    "O som da nossa história",
    "Desde o primeiro olhar",
    "Você é minha melhor lembrança"
  ],
  selectedMusic: {
    id: "4PTG3Z6ehGkBFzI7Y1rqy",
    title: "Yellow",
    artist: "Coldplay",
    albumName: "Parachutes",
    albumImageUrl: "https://i.scdn.co/image/ab67616d0000b2739164d557616292a54308d029",
    spotifyUrl: "https://open.spotify.com/track/4PTG3Z6ehGkBFzI7Y1rqy"
  },
  coverImages: [
    {
      id: "img-1",
      url: "https://images.unsplash.com/photo-1518199266791-5375a83164ba?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
      alt: "Abraço na praia"
    },
    {
      id: "img-2",
      url: "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
      alt: "Sorrisos no parque"
    },
    {
      id: "img-3",
      url: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
      alt: "Pôr do sol"
    },
    {
      id: "img-4",
      url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
      alt: "Viagem juntos"
    }
  ],
  specialMessage: "Alice, desde aquele primeiro beijo em Gramado, cada momento ao seu lado se tornou trilha sonora de uma vida perfeita. Te amo hoje mais do que ontem e para sempre!",
  memoryImage: {
    id: "mem-1",
    url: "https://images.unsplash.com/photo-1464746133101-a2c3f88e0dd9?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
    alt: "Nossa trilha nas montanhas"
  }
};
