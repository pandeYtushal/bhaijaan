import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const jsonPath = path.join(rootDir, 'src', 'data', 'songs-with-spotify.json');

console.log('====================================================');
console.log('BHAIJAAN.WTF — Spotify Track Database Validator');
console.log('====================================================\n');

if (!fs.existsSync(jsonPath)) {
  console.error('❌ Data file not found:', jsonPath);
  console.log('Please run:\n  npm run sync:spotify\n');
  process.exit(1);
}

const rawData = fs.readFileSync(jsonPath, 'utf8');
let songs = [];
try {
  songs = JSON.parse(rawData);
} catch (e) {
  console.error('❌ Invalid JSON format in songs-with-spotify.json:', e.message);
  process.exit(1);
}

let verifiedCount = 0;
let reviewCount = 0;
let unavailableCount = 0;
let invalidUriCount = 0;

const seenIds = new Set();
const seenTrackUris = new Set();

songs.forEach((song) => {
  if (seenIds.has(song.id)) {
    console.warn(`⚠️ Duplicate local song ID: ${song.id}`);
  }
  seenIds.add(song.id);

  if (song.spotifyUri) {
    if (seenTrackUris.has(song.spotifyUri)) {
      console.warn(`⚠️ Duplicate Spotify URI: ${song.spotifyUri} for song '${song.title}'`);
    }
    seenTrackUris.add(song.spotifyUri);

    const isFormatValid = /^spotify:track:[a-zA-Z0-9]{22}$/.test(song.spotifyUri);
    if (!isFormatValid) {
      invalidUriCount++;
      console.warn(`⚠️ Potentially non-standard Spotify URI format: ${song.spotifyUri} for '${song.title}'`);
    }

    if (song.needsReview || (song.matchConfidence && song.matchConfidence < 0.90)) {
      reviewCount++;
      console.log(`? ${song.title.padEnd(28, '.')} [${(song.matchConfidence || 0).toFixed(2)}] Needs Review`);
    } else {
      verifiedCount++;
      console.log(`✓ ${song.title.padEnd(28, '.')} [${(song.matchConfidence || 1.0).toFixed(2)}] Verified (${song.spotifyUri})`);
    }
  } else {
    unavailableCount++;
    console.log(`✗ ${song.title.padEnd(28, '.')} [${(song.matchConfidence || 0).toFixed(2)}] Unavailable`);
  }
});

console.log('\n----------------------------------------------------');
console.log(`✓ ${verifiedCount} verified tracks`);
console.log(`⚠ ${reviewCount} tracks need review`);
console.log(`✗ ${unavailableCount} tracks unavailable on Spotify`);
if (invalidUriCount > 0) {
  console.log(`⚠️ ${invalidUriCount} non-standard URI formats detected`);
}
console.log('----------------------------------------------------');
console.log('====================================================\n');
