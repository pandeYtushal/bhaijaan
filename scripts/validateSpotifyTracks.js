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
  console.error('[ERROR] Data file not found:', jsonPath);
  console.log('Please run:\n  npm run sync:spotify\n');
  process.exit(1);
}

const rawData = fs.readFileSync(jsonPath, 'utf8');
let songs = [];
try {
  songs = JSON.parse(rawData);
} catch (e) {
  console.error('[ERROR] Invalid JSON format in songs-with-spotify.json:', e.message);
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
    console.warn(`[WARN] Duplicate local song ID: ${song.id}`);
  }
  seenIds.add(song.id);

  let uri = song.spotifyUri;
  if (!uri && song.spotifyUrl && song.spotifyUrl.includes('/track/')) {
    const parts = song.spotifyUrl.split('/track/')[1];
    const trackId = parts ? parts.split('?')[0] : null;
    if (trackId) {
      uri = `spotify:track:${trackId}`;
    }
  }

  const isDummyUri = uri === 'spotify:track:1999010101010101010101';

  if (uri && !isDummyUri) {
    if (seenTrackUris.has(uri)) {
      console.warn(`[WARN] Duplicate Spotify URI: ${uri} for song '${song.title}'`);
    }
    seenTrackUris.add(uri);

    const isFormatValid = /^spotify:track:[a-zA-Z0-9]{22}$/.test(uri);
    if (!isFormatValid) {
      invalidUriCount++;
      console.warn(`[WARN] Non-standard Spotify URI format: ${uri} for '${song.title}'`);
    }

    if (song.needsReview || (song.matchConfidence && song.matchConfidence < 0.90)) {
      reviewCount++;
      console.log(`[REVIEW] ${song.title.padEnd(28, '.')} [${(song.matchConfidence || 0).toFixed(2)}]`);
    } else {
      verifiedCount++;
      console.log(`[PASS] ${song.title.padEnd(28, '.')} [${(song.matchConfidence || 1.0).toFixed(2)}] (${uri})`);
    }
  } else {
    unavailableCount++;
    console.log(`[UNAVAILABLE] ${song.title.padEnd(28, '.')} Unavailable on Spotify`);
  }
});

console.log('\n----------------------------------------------------');
console.log(`[SUMMARY] ${verifiedCount} verified tracks`);
console.log(`[SUMMARY] ${reviewCount} tracks need review`);
console.log(`[SUMMARY] ${unavailableCount} tracks unavailable on Spotify`);
if (invalidUriCount > 0) {
  console.log(`[SUMMARY] ${invalidUriCount} non-standard URI formats detected`);
}
console.log('----------------------------------------------------');
console.log('====================================================\n');
