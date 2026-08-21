import { SONGS } from '../src/data/songs.js';
import { resolveTrack } from '../src/spotify/trackResolver.js';

console.log('====================================================');
console.log('BHAIJAAN.WTF — Spotify Track Database Validation');
console.log('====================================================\n');

let validCount = 0;
let invalidCount = 0;

for (const song of SONGS) {
  const result = resolveTrack(song);
  if (result.matched) {
    console.log(`✓ ${song.title} (${song.film}, ${song.year}) -> ${result.spotifyUri}`);
    validCount++;
  } else {
    console.log(`✗ ${song.title} (${song.film}, ${song.year}) — ${result.reason}`);
    invalidCount++;
  }
}

console.log('\n----------------------------------------------------');
console.log(`Total: ${SONGS.length} | Verified: ${validCount} | Unverified: ${invalidCount}`);
console.log('====================================================');
