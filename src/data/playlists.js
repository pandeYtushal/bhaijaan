// BHAIJAAN.WTF — Single Playlist (all verified songs)
import songsCatalog from './songs-with-spotify.json';

const ALL_SONGS = songsCatalog.map((s) => ({
  ...s,
  duration: s.duration || 300,
}));

export const allSongsPlaylist = {
  id: 'bhaijaan',
  name: 'BHAIJAAN.WTF',
  label: 'ALL ERAS',
  description: 'THE COMPLETE CATALOG',
  subtitle: '1989 — ∞. Every era. Every bhai.',
  tracks: ALL_SONGS,
};

export const ninetiesPlaylist = {
  id: '90s',
  name: 'The Prem Era',
  label: 'THE 90s',
  description: 'The Golden Romance Era',
  subtitle: '1989 — 1999',
  tracks: ALL_SONGS.filter(s => s.year >= 1989 && s.year < 2000),
};

export const twoThousandsPlaylist = {
  id: '00s',
  name: 'The Bhai Era',
  label: 'THE 00s',
  description: 'Swag & Action Begins',
  subtitle: '2000 — 2009',
  tracks: ALL_SONGS.filter(s => s.year >= 2000 && s.year < 2010),
};

export const modernPlaylist = {
  id: '10s',
  name: 'The Blockbuster Era',
  label: '2010s & BEYOND',
  description: '100 Crore Club Records',
  subtitle: '2010 — ∞',
  tracks: ALL_SONGS.filter(s => s.year >= 2010),
};

// Fallback for default import
export const playlist = allSongsPlaylist;

export const playlists = { 
  bhaijaan: allSongsPlaylist,
  '90s': ninetiesPlaylist,
  '00s': twoThousandsPlaylist,
  '10s': modernPlaylist
};

export const PLAYLISTS = [allSongsPlaylist, ninetiesPlaylist, twoThousandsPlaylist, modernPlaylist];
export default playlist;
