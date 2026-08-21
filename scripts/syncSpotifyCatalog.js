import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

// Helper to load .env variables if available
function loadEnv() {
  const envPath = path.join(rootDir, '.env');
  if (fs.existsSync(envPath)) {
    const content = fs.readFileSync(envPath, 'utf8');
    content.split('\n').forEach((line) => {
      const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
      if (match) {
        const key = match[1];
        let value = match[2] || '';
        if (value.startsWith('"') && value.endsWith('"')) value = value.slice(1, -1);
        if (value.startsWith("'") && value.endsWith("'")) value = value.slice(1, -1);
        if (!process.env[key]) {
          process.env[key] = value.trim();
        }
      }
    });
  }
}

loadEnv();

const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;

function normalize(str) {
  if (!str) return '';
  return String(str)
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function calculateSimilarity(str1, str2) {
  const norm1 = normalize(str1);
  const norm2 = normalize(str2);
  if (!norm1 || !norm2) return 0;
  if (norm1 === norm2) return 1.0;
  if (norm1.includes(norm2) || norm2.includes(norm1)) return 0.85;

  const set1 = new Set(norm1.split(' '));
  const set2 = new Set(norm2.split(' '));
  const intersection = new Set([...set1].filter((x) => set2.has(x)));
  const union = new Set([...set1, ...set2]);
  return intersection.size / union.size;
}

function calculateScore(localSong, spotifyTrack) {
  const titleScore = calculateSimilarity(localSong.title, spotifyTrack.name);

  const albumName = spotifyTrack.album ? spotifyTrack.album.name : '';
  const filmScore = calculateSimilarity(localSong.film, albumName);

  const artistNames = spotifyTrack.artists ? spotifyTrack.artists.map((a) => a.name).join(' ') : '';
  const singerScore = localSong.singers && localSong.singers.length > 0
    ? Math.max(...localSong.singers.map((s) => calculateSimilarity(s, artistNames)))
    : 0.5;

  let yearScore = 1.0;
  if (spotifyTrack.album && spotifyTrack.album.release_date && localSong.year) {
    const spotifyYear = parseInt(spotifyTrack.album.release_date.substring(0, 4), 10);
    if (!isNaN(spotifyYear)) {
      const diff = Math.abs(localSong.year - spotifyYear);
      yearScore = diff === 0 ? 1.0 : diff <= 2 ? 0.8 : diff <= 5 ? 0.5 : 0.2;
    }
  }

  const normTitle = normalize(localSong.title);
  const normSpTitle = normalize(spotifyTrack.name);
  const exactTitleBonus = normTitle === normSpTitle ? 0.1 : 0;

  const totalScore = (titleScore * 0.40) + (filmScore * 0.20) + (singerScore * 0.20) + (yearScore * 0.10) + exactTitleBonus;
  return Math.min(1.0, Math.round(totalScore * 100) / 100);
}

async function getAccessToken() {
  const authHeader = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64');
  const res = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${authHeader}`,
      'Content-Type': 'application/x-www-form-request-body'
    },
    body: new URLSearchParams({ grant_type: 'client_credentials' })
  });

  if (!res.ok) {
    throw new Error(`Spotify Auth HTTP Error: ${res.status} ${res.statusText}`);
  }
  const data = await res.json();
  return data.access_token;
}

async function searchTrack(token, query) {
  const url = `https://api.spotify.com/v1/search?type=track&limit=5&q=${encodeURIComponent(query)}`;
  const res = await fetch(url, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  if (!res.ok) return [];
  const data = await res.json();
  return data.tracks?.items || [];
}

async function runSync() {
  console.log('====================================================');
  console.log('BHAIJAAN.WTF — SPOTIFY CATALOG AUTOMATIC SYNC');
  console.log('====================================================\n');

  if (!CLIENT_ID || !CLIENT_SECRET || CLIENT_ID === 'your_client_id') {
    console.log('⚠️  Spotify Web API Credentials Required.\n');
    console.log('Please set:');
    console.log('  SPOTIFY_CLIENT_ID=your_client_id');
    console.log('  SPOTIFY_CLIENT_SECRET=your_client_secret');
    console.log('in your .env file or environment variables.\n');
    console.log('See .env.example for details.');
    console.log('Then run:\n  npm run sync:spotify\n');
    console.log('====================================================');
    return;
  }

  // Load existing songs database
  const songsPath = path.join(rootDir, 'src', 'data', 'songs.js');
  let songCatalog = [];

  try {
    const rawModule = await import(`file://${songsPath}`);
    songCatalog = rawModule.SONGS || [];
  } catch (err) {
    console.error('Failed to load local songs database:', err);
    return;
  }

  console.log(`🔑 Authenticating with Spotify API...`);
  let token;
  try {
    token = await getAccessToken();
    console.log('✓ Authenticated successfully.\n');
  } catch (err) {
    console.error('❌ Spotify Authentication Failed:', err.message);
    return;
  }

  const results = [];
  let matchedCount = 0;
  let reviewCount = 0;
  let unmatchedCount = 0;

  for (const song of songCatalog) {
    const query = `${song.title} ${song.film}`;
    const candidates = await searchTrack(token, query);

    let bestCandidate = null;
    let bestScore = 0;

    for (const track of candidates) {
      const score = calculateScore(song, track);
      if (score > bestScore) {
        bestScore = score;
        bestCandidate = track;
      }
    }

    let item = {
      id: song.id,
      title: song.title,
      film: song.film,
      year: song.year,
      singers: song.singers || [],
      spotifyUri: null,
      spotifyUrl: null,
      spotifyTrackId: null,
      matchConfidence: bestScore,
      needsReview: true
    };

    if (bestCandidate && bestScore >= 0.90) {
      item.spotifyUri = bestCandidate.uri;
      item.spotifyUrl = bestCandidate.external_urls?.spotify || `https://open.spotify.com/track/${bestCandidate.id}`;
      item.spotifyTrackId = bestCandidate.id;
      item.needsReview = false;
      matchedCount++;
      console.log(`✓ ${song.title.padEnd(28, '.')} ${bestScore.toFixed(2)}`);
    } else if (bestCandidate && bestScore >= 0.75) {
      item.spotifyUri = bestCandidate.uri;
      item.spotifyUrl = bestCandidate.external_urls?.spotify || `https://open.spotify.com/track/${bestCandidate.id}`;
      item.spotifyTrackId = bestCandidate.id;
      item.needsReview = true;
      reviewCount++;
      console.log(`? ${song.title.padEnd(28, '.')} ${bestScore.toFixed(2)} (Needs Review)`);
    } else {
      unmatchedCount++;
      console.log(`✗ ${song.title.padEnd(28, '.')} NOT FOUND / LOW SCORE (${bestScore.toFixed(2)})`);
    }

    results.push(item);
  }

  // Save to src/data/songs-with-spotify.json
  const outputPath = path.join(rootDir, 'src', 'data', 'songs-with-spotify.json');
  fs.writeFileSync(outputPath, JSON.stringify(results, null, 2), 'utf8');

  // Save report to spotify-match-report.json
  const reportPath = path.join(rootDir, 'spotify-match-report.json');
  const reportData = {
    total: results.length,
    matched: matchedCount,
    needsReview: reviewCount,
    unmatched: unmatchedCount,
    timestamp: new Date().toISOString(),
    results
  };
  fs.writeFileSync(reportPath, JSON.stringify(reportData, null, 2), 'utf8');

  console.log('\n----------------------------------------------------');
  console.log(`Matched:       ${matchedCount}`);
  console.log(`Needs review:  ${reviewCount}`);
  console.log(`Unmatched:     ${unmatchedCount}`);
  console.log('----------------------------------------------------');
  console.log(`✓ Output saved to src/data/songs-with-spotify.json`);
  console.log(`✓ Report saved to spotify-match-report.json`);
  console.log('====================================================\n');
}

runSync().catch(console.error);
