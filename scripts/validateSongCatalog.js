// Song Catalog Integrity Validator
// Validates uniqueness of IDs, Spotify URIs, YouTube IDs, and metadata fields.

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const jsonPath = path.join(rootDir, 'src', 'data', 'songs-with-spotify.json');

const line = '='.repeat(52);
const dashes = '-'.repeat(52);

if (!fs.existsSync(jsonPath)) {
  console.error('[VALIDATOR] Catalog file not found:', jsonPath);
  process.exit(1);
}

let songs;
try {
  songs = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
} catch (e) {
  console.error('[VALIDATOR] Failed to parse JSON catalog:', e.message);
  process.exit(1);
}

const errors = [];

// Track uniqueness
const ids = songs.map((s) => s.id);
const uniqueIds = new Set(ids);
const dupIds = ids.filter((id, i) => ids.indexOf(id) !== i);

const spotifyUris = songs.filter((s) => s.spotifyUri).map((s) => s.spotifyUri);
const uniqueSpotifyUris = new Set(spotifyUris);
const dupSpotify = spotifyUris.filter((u, i) => spotifyUris.indexOf(u) !== i);

const ytIds = songs.filter((s) => s.youtubeId).map((s) => s.youtubeId);
const uniqueYt = new Set(ytIds);
const dupYt = ytIds.filter((id, i) => ytIds.indexOf(id) !== i);

const audioUrls = songs.filter((s) => s.audioUrl).map((s) => s.audioUrl);
const uniqueAudio = new Set(audioUrls);
const dupAudio = audioUrls.filter((u, i) => audioUrls.indexOf(u) !== i);

// Required metadata check
const missingTitle = songs.filter((s) => !s.title || !s.title.trim());
const missingArtist = songs.filter((s) => !s.singers || s.singers.length === 0);
const missingFilm = songs.filter((s) => !s.film || !s.film.trim());
const missingYear = songs.filter((s) => !s.year);

if (dupIds.length > 0) errors.push(`Duplicate IDs found: ${dupIds.join(', ')}`);
if (dupSpotify.length > 0) errors.push(`Duplicate Spotify URIs found: ${dupSpotify.join(', ')}`);
if (dupYt.length > 0) errors.push(`Duplicate YouTube IDs found: ${dupYt.join(', ')}`);
if (dupAudio.length > 0) errors.push(`Duplicate audio URLs found: ${dupAudio.join(', ')}`);
if (missingTitle.length > 0) errors.push(`${missingTitle.length} songs missing title`);
if (missingArtist.length > 0) errors.push(`${missingArtist.length} songs missing singers`);

const PASS = errors.length === 0;

console.log('\n' + line);
console.log('BHAIJAAN.WTF CATALOG AUDIT REPORT');
console.log(line);
console.log(`TOTAL RECORDINGS:               ${songs.length}`);
console.log(`UNIQUE SONG IDs:                ${uniqueIds.size}`);
console.log(`UNIQUE YOUTUBE IDs:             ${uniqueYt.size}`);
console.log(`UNIQUE SPOTIFY URIs:            ${uniqueSpotifyUris.size}`);
console.log(`UNIQUE AUDIO URLs:              ${uniqueAudio.size}`);
console.log(dashes);

if (errors.length > 0) {
  console.log('\nCRITICAL INTEGRITY ERRORS:');
  errors.forEach((e) => console.log(`  [ERROR] ${e}`));
} else {
  console.log('\nALL INTEGRITY CHECKS PASSED SUCCESSFULLY.');
}

console.log(line);
console.log(`FINAL STATUS: ${PASS ? 'PASS' : 'FAIL'}`);
console.log(line + '\n');

process.exit(PASS ? 0 : 1);
