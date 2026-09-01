// BHAIJAAN.WTF — Single Playlist (all verified songs)
import songsCatalog from './songs-with-spotify.json';

const ALL_SONGS = songsCatalog.map((s) => ({
  ...s,
  duration: s.duration || 300,
}));

export const playlist = {
  id: 'bhaijaan',
  name: 'BHAIJAAN.WTF',
  label: 'BHAIJAAN.WTF',
  description: 'THE COMPLETE CATALOG',
  subtitle: '1989 — ∞. Every era. Every bhai.',
  tracks: ALL_SONGS,
};

// Keep PLAYLISTS array for compatibility with audioEngine
export const playlists = { bhaijaan: playlist };
export const PLAYLISTS = [playlist];
export default playlist;
