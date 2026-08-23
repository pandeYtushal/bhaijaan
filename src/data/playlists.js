// BHAIJAAN.WTF — Strictly Unique Track Database (0 Audio Repeats, 0 Title Repeats)

import songsCatalog from './songs-with-spotify.json';

const ALL_SONGS = songsCatalog.map((s) => ({
  ...s,
  duration: s.duration || 300,
  audioUrl: s.audioUrl
}));

export const playlists = {
  bhaiMode: {
    id: "bhai-mode",
    name: "BHAI MODE",
    label: "BHAI MODE",
    spotifyUrl: "https://open.spotify.com/playlist/3Ye57MhrB2yFkD39bdxU5c",
    subtitle: "High-Energy Party & Action Bangers (8 Unique Songs)",
    tracks: ALL_SONGS.slice(0, 8)
  },

  bhaiOfficial: {
    id: "bhai-official",
    name: "BHAI OFFICIAL",
    label: "BHAI OFFICIAL",
    spotifyUrl: "https://open.spotify.com/playlist/37i9dQZF1DZ06evO3CjygN",
    subtitle: "Official Romantic Blockbusters & Soulful Hits (8 Unique Songs)",
    tracks: ALL_SONGS.slice(8, 16)
  },

  twoThousands: {
    id: "2000s-kid",
    name: "2000s KID",
    label: "2000s KID",
    spotifyUrl: "https://open.spotify.com/playlist/7iW35WA5Zs6GtHBGGRu4CZ",
    subtitle: "2000s Love, Heartbreak & Upbeat Jams (8 Unique Songs)",
    tracks: ALL_SONGS.slice(16, 24)
  },

  nineties: {
    id: "90s-radio",
    name: "90s RADIO",
    label: "90s RADIO",
    spotifyUrl: "https://open.spotify.com/playlist/4a499zchFELXUSumfrUFvK",
    subtitle: "Blockbuster 90s Vintage Cassette Radio (8 Unique Songs)",
    tracks: ALL_SONGS.slice(24, 32)
  },

  nostalgia: {
    id: "nostalgia",
    name: "90s / EARLY 2000s",
    label: "90s / EARLY 2000s",
    spotifyUrl: "https://open.spotify.com/playlist/0Rgj9nRineoSYEktQeg61b",
    subtitle: "Cult Barbershop Nostalgia & Melodies (9 Unique Songs)",
    tracks: ALL_SONGS.slice(32)
  }
};

export const PLAYLISTS = Object.values(playlists);
export default playlists;
