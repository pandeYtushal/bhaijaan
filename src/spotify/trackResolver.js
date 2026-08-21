// Track Resolution System for BHAIJAAN.WTF — Exact Song Matching

export function normalizeText(text) {
  if (!text) return '';
  return String(text)
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s]/g, '')
    .trim();
}

export function resolveTrack(song) {
  if (!song) {
    return { matched: false, spotifyUri: null, spotifyUrl: null, reason: 'No song provided' };
  }

  const normalizedTitle = normalizeText(song.title);
  const normalizedFilm = normalizeText(song.film);
  const year = song.year;

  // Verify explicit spotifyUri / spotifyUrl
  if (song.spotifyUri && song.spotifyUri.startsWith('spotify:track:')) {
    const trackId = song.spotifyUri.replace('spotify:track:', '');
    return {
      matched: true,
      spotifyUri: song.spotifyUri,
      spotifyUrl: song.spotifyUrl || `https://open.spotify.com/track/${trackId}`,
      trackInfo: { title: song.title, film: song.film, year: song.year }
    };
  }

  if (song.spotifyUrl && song.spotifyUrl.includes('/track/')) {
    const parts = song.spotifyUrl.split('/track/')[1];
    const trackId = parts ? parts.split('?')[0] : null;
    if (trackId) {
      return {
        matched: true,
        spotifyUri: `spotify:track:${trackId}`,
        spotifyUrl: song.spotifyUrl,
        trackInfo: { title: song.title, film: song.film, year: song.year }
      };
    }
  }

  return {
    matched: false,
    spotifyUri: null,
    spotifyUrl: null,
    reason: `Unverified track metadata for '${song.title}' (${song.film}, ${song.year})`
  };
}
