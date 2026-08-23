// BHAIJAAN.WTF — Curated Mode Playlists
// 5 modes · 41 songs · ZERO duplicate Spotify URIs
// Each mode is a distinct musical personality, not a shuffle of the same pool.

import songsCatalog from './songs-with-spotify.json';

const ALL_SONGS = songsCatalog.map((s) => ({
  ...s,
  duration: s.duration || 300,
  audioUrl: s.audioUrl
}));

export const playlists = {
  // 01 — BHAI MODE: MASS ENERGY CONFIDENCE FUN ICONIC
  // Songs [0–7] — anthems, party bangers, crowd-raisers
  bhaiMode: {
    id: 'bhai-mode',
    name: 'BHAI MODE',
    label: 'BHAI MODE',
    description: 'THE ANTHEMS',
    subtitle: 'Mass energy. Iconic Bollywood. This is Bhai.',
    playlistUri: 'spotify:playlist:3Ye57MhrB2yFkD39bdxU5c',
    spotifyUrl: 'https://open.spotify.com/playlist/3Ye57MhrB2yFkD39bdxU5c',
    tracks: ALL_SONGS.slice(0, 8)
  },

  // 02 — BHAI OFFICIAL: ROMANTIC NOSTALGIC SOFT EMOTIONAL
  // Songs [8–15] — love songs, emotional ballads, soulful melodies
  bhaiOfficial: {
    id: 'bhai-official',
    name: 'BHAI OFFICIAL',
    label: 'BHAI OFFICIAL',
    description: 'THE LOVE SONGS',
    subtitle: 'Romantic. Soft. Emotional. The other side of Bhai.',
    playlistUri: 'spotify:playlist:37i9dQZF1DZ06evO3CjygN',
    spotifyUrl: 'https://open.spotify.com/playlist/37i9dQZF1DZ06evO3CjygN',
    tracks: ALL_SONGS.slice(8, 16)
  },

  // 03 — 2000S KID: CHILDHOOD SCHOOL DAYS EARLY INTERNET CD PLAYERS
  // Songs [16–23] — the hits that defined a generation's youth
  twoThousands: {
    id: '2000s-kid',
    name: '2000S KID',
    label: '2000S KID',
    description: 'THE CHILDHOOD YEARS',
    subtitle: 'School bags, CD players, music channels. You were there.',
    playlistUri: 'spotify:playlist:7iW35WA5Zs6GtHBGGRu4CZ',
    spotifyUrl: 'https://open.spotify.com/playlist/7iW35WA5Zs6GtHBGGRu4CZ',
    tracks: ALL_SONGS.slice(16, 24)
  },

  // 04 — 90S RADIO: PURE 90S BOLLYWOOD CASSETTE RADIO TV COUNTDOWN
  // Songs [24–31] — the original classics, straight from the cassette era
  nineties: {
    id: '90s-radio',
    name: '90S RADIO',
    label: '90S RADIO',
    description: 'STRAIGHT FROM THE CASSETTE',
    subtitle: 'Rewind to 1989–1999. Cassette. Doordarshan. Sunday morning.',
    playlistUri: 'spotify:playlist:4a499zchFELXUSumfrUFvK',
    spotifyUrl: 'https://open.spotify.com/playlist/4a499zchFELXUSumfrUFvK',
    tracks: ALL_SONGS.slice(24, 32)
  },

  // 05 — 90S / EARLY 2000S: THE TRANSITION ERA 1997–2005
  // Songs [32–40] — the in-between years, where eras crossed
  nostalgia: {
    id: 'nostalgia',
    name: '90S / EARLY 2000S',
    label: '90S / EARLY 2000S',
    description: 'THE IN-BETWEEN YEARS',
    subtitle: '1997–2005. Between two eras. Neither fully 90s nor 2000s.',
    playlistUri: 'spotify:playlist:0Rgj9nRineoSYEktQeg61b',
    spotifyUrl: 'https://open.spotify.com/playlist/0Rgj9nRineoSYEktQeg61b',
    tracks: ALL_SONGS.slice(32)
  }
};

export const PLAYLISTS = Object.values(playlists);
export default playlists;

// ─── GLOBAL DUPLICATE URI VALIDATION ─────────────────────────────────────────
// Runs on import. Confirms every track URI is globally unique across all modes.
const _allModeTracks = PLAYLISTS.flatMap((p) => p.tracks);
const _trackUris = _allModeTracks.map((t) => t.spotifyUri);
const _duplicates = _trackUris.filter((uri, index) => _trackUris.indexOf(uri) !== index);

if (_duplicates.length > 0) {
  console.error('[BHAIJAAN] ⚠ Duplicate Spotify URIs detected across modes:', _duplicates);
} else {
  console.log(
    `[BHAIJAAN] ✓ All ${_allModeTracks.length} track URIs are unique across ${PLAYLISTS.length} modes.`
  );
}
