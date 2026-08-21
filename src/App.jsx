import { useCallback, useEffect, useRef, useState } from 'react';
import { SONGS } from './data/songs';
import { PLAYLISTS, playlists } from './data/playlists';
import { MOODS } from './data/moods';
import { MusicPlayer } from './components/MusicPlayer/MusicPlayer';
import { SpotifyEmbed } from './components/SpotifyEmbed';
import { spotifyController } from './utils/spotifyController';
import { resolveTrack } from './spotify/trackResolver';
import { audioFX } from './utils/audioFX';

function isTypingTarget(target) {
  if (!(target instanceof HTMLElement)) return false;
  const tag = target.tagName;
  return tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || target.isContentEditable;
}

function getPlaylistForMood(moodId) {
  switch (moodId) {
    case 'ROMANCE':
    case 'PEHLA PYAR':
      return playlists.pehlaPyar;
    case 'BHAI MODE':
      return playlists.bhaiMode;
    case 'NOSTALGIA':
    case '90s RADIO':
      return playlists.nineties;
    case '2000s':
    case '2000s KID':
      return playlists.twoThousands;
    case 'SHAADI':
      return playlists.shaadi;
    default:
      return playlists.flagship || PLAYLISTS[0];
  }
}

export default function App() {
  // Canonical Playback & Track State
  const [playbackState, setPlaybackState] = useState({
    modeId: 'ALL',
    playlist: PLAYLISTS[0],
    currentSong: SONGS[0],
    requestedSong: SONGS[0],
    isPlaying: false,
    isLoading: false,
    position: 0,
    duration: 0,
    error: null
  });

  const [filmFlash, setFilmFlash] = useState(false);
  const [isRewinding, setIsRewinding] = useState(false);

  const spotifyRef = useRef(null);
  const requestIdRef = useRef(0);

  const triggerRewindEffect = useCallback(() => {
    audioFX.playFilmBurn();
    setIsRewinding(true);
    setFilmFlash(true);
    setTimeout(() => {
      setIsRewinding(false);
      setFilmFlash(false);
    }, 350);
  }, []);

  // Single event subscription handler — updates currentSong ONLY when Spotify confirms playingURI
  const handlePlaybackChange = useCallback((data) => {
    setPlaybackState((prev) => {
      const isPaused = typeof data.isPaused === 'boolean' ? data.isPaused : !prev.isPlaying;
      const isPlaying = !isPaused;
      const position = Number.isFinite(data.position) ? Math.round(data.position / 1000) : prev.position;
      const duration = Number.isFinite(data.duration) ? Math.round(data.duration / 1000) : prev.duration;
      
      let confirmedSong = prev.currentSong;

      if (data.playingUri) {
        console.log('[BHAIJAAN] Spotify confirmed playingURI:', data.playingUri);
        const match = SONGS.find(
          (s) => s.spotifyUri === data.playingUri || s.id === data.playingUri
        );
        if (match) {
          console.log('[BHAIJAAN] Confirmed exact song:', match.title);
          confirmedSong = match;
        }
      }

      return {
        ...prev,
        isPlaying,
        isLoading: false,
        position,
        duration,
        currentSong: confirmedSong
      };
    });
  }, []);

  // Play Exact Track or Fallback Playlist Entity
  const playExactSong = useCallback((targetSong, targetPlaylist = null, autoStart = true) => {
    if (!targetSong) return;
    const requestId = ++requestIdRef.current;

    console.log('[BHAIJAAN] REQUEST ID:', requestId);
    console.log('[BHAIJAAN] PLAY EXACT SONG:', targetSong.title, targetSong.film);

    const resolution = resolveTrack(targetSong);
    const activePlaylist = targetPlaylist || playbackState.playlist;

    triggerRewindEffect();

    setPlaybackState((prev) => ({
      ...prev,
      playlist: activePlaylist,
      requestedSong: targetSong,
      currentSong: targetSong,
      isLoading: true,
      error: resolution.matched ? null : resolution.reason
    }));

    if (resolution.matched) {
      console.log('[BHAIJAAN] Loading exact spotifyUri:', resolution.spotifyUri);
      spotifyController.loadEntity(resolution.spotifyUri);
    } else {
      console.log('[BHAIJAAN] Song has no verified track URI, loading playlist context:', activePlaylist.spotifyUrl);
      spotifyController.loadEntity(activePlaylist.spotifyUrl);
    }

    if (autoStart) {
      spotifyController.play();
    }
  }, [playbackState.playlist, triggerRewindEffect]);

  const selectMode = useCallback((targetPlaylist, autoStart = true) => {
    if (!targetPlaylist) return;
    const firstSong = SONGS.find(s => targetPlaylist.tracks.some(t => t.id === s.id)) || SONGS[0];
    playExactSong(firstSong, targetPlaylist, autoStart);
  }, [playExactSong]);

  const takeMeBack = useCallback(() => {
    console.log('[BHAIJAAN] TAKE ME BACK TRIGGERED');
    const verifiedSongs = SONGS.filter((s) => s.spotifyUri !== null && s.spotifyUri !== undefined);
    if (verifiedSongs.length === 0) return;

    const randomSong = verifiedSongs[Math.floor(Math.random() * verifiedSongs.length)];
    playExactSong(randomSong, playbackState.playlist, true);
  }, [playExactSong, playbackState.playlist]);

  const handleMoodClick = useCallback((mood) => {
    audioFX.playClick();
    const moodId = typeof mood === 'object' ? mood.id : mood;
    setPlaybackState((prev) => ({ ...prev, modeId }));
    
    if (moodId === 'BHAI MODE') {
      audioFX.playBhaiMode();
      selectMode(playlists.bhaiMode, true);
      return;
    }

    const targetPlaylist = getPlaylistForMood(moodId);
    selectMode(targetPlaylist, true);
  }, [selectMode]);

  const next = useCallback(() => {
    audioFX.playClick();
    const currentIdx = SONGS.findIndex((s) => s.id === playbackState.currentSong.id);
    const nextIdx = (currentIdx + 1) % SONGS.length;
    const nextSong = SONGS[nextIdx];
    playExactSong(nextSong, playbackState.playlist, true);
  }, [playbackState.currentSong.id, playbackState.playlist, playExactSong]);

  const previous = useCallback(() => {
    audioFX.playClick();
    const currentIdx = SONGS.findIndex((s) => s.id === playbackState.currentSong.id);
    const prevIdx = (currentIdx - 1 + SONGS.length) % SONGS.length;
    const prevSong = SONGS[prevIdx];
    playExactSong(prevSong, playbackState.playlist, true);
  }, [playbackState.currentSong.id, playbackState.playlist, playExactSong]);

  const toggle = useCallback(() => {
    audioFX.playClick();
    spotifyController.togglePlay();
  }, []);

  const handleSeek = useCallback((seconds) => {
    spotifyController.seek(seconds);
  }, []);

  useEffect(() => {
    const key = (event) => {
      if (isTypingTarget(event.target)) return;
      if (event.key === 'ArrowRight') next();
      if (event.key === 'ArrowLeft') previous();
      if (event.key === ' ') {
        event.preventDefault();
        toggle();
      }
    };
    window.addEventListener('keydown', key);
    return () => window.removeEventListener('keydown', key);
  }, [next, previous, toggle]);

  return (
    <main className="saloon-page">
      {filmFlash && <div className="film-flash" aria-hidden="true" />}
      <div className="photo" />
      <div className="shade" />
      <div className="noise" />

      {/* Persistent Off-Screen Spotify Embed Container */}
      <div
        className="hidden-spotify-container"
        style={{
          position: 'fixed',
          bottom: 0,
          right: 0,
          opacity: 0.001,
          pointerEvents: 'none',
          zIndex: -1,
          width: '300px',
          height: '150px',
          overflow: 'hidden'
        }}
      >
        <SpotifyEmbed
          ref={spotifyRef}
          initialPlaylistUrl={playbackState.playlist.spotifyUrl}
          onPlaybackChange={handlePlaybackChange}
        />
      </div>

      {/* Top Header */}
      <header className="top">
        <button
          type="button"
          className="logo"
          onClick={() => selectMode(PLAYLISTS[0], false)}
          aria-label="BHAIJAAN.WTF home"
        >
          BHAIJAAN<span>.WTF</span>
        </button>
        <p className="online"><i /> 1,847 <span>online</span></p>
        <label className="collection-button">
          ◉{' '}
          <select
            aria-label="Playlist"
            value={PLAYLISTS.findIndex(p => p.id === playbackState.playlist.id)}
            onChange={(event) => selectMode(PLAYLISTS[Number(event.target.value)], true)}
          >
            {PLAYLISTS.map((list, index) => (
              <option key={list.id} value={index}>{list.name}</option>
            ))}
          </select>
        </label>
      </header>

      {/* Center Stage Hero */}
      <section className="center-stage">
        <p className="kicker">the soundtrack of the salon</p>
        <h1>BHAIJAAN<small>.WTF</small></h1>
        <p className="hindi">हर दौर. हर गाना. हमेशा भाईजान.</p>
        <p className="years">1989 — ∞</p>

        {/* Text-Based Hero Action Links */}
        <div className="actions text-actions">
          <button type="button" className="text-action-btn play-something-link" onClick={toggle}>
            [ ▶ PLAY SOMETHING ]
          </button>
          <button type="button" className="text-action-btn rewind-link" onClick={takeMeBack}>
            ↶ REWIND → TAKE ME BACK
          </button>
        </div>
      </section>

      {/* Environment Cassette Object Player Dock */}
      <section className="dock environment-dock" aria-label="Player">
        <MusicPlayer
          track={playbackState.currentSong}
          playlist={playbackState.playlist}
          isPlaying={playbackState.isPlaying}
          isLoading={playbackState.isLoading}
          playbackProgress={{ current: playbackState.position, duration: playbackState.duration }}
          isRewinding={isRewinding}
          onToggle={toggle}
          onNext={next}
          onPrevious={previous}
          onSeek={handleSeek}
        />

        {/* Handwritten Text-Based Dot-Separated Navigation */}
        <nav className="handwritten-text-nav" aria-label="Mood navigation">
          {MOODS.map((mood, idx) => (
            <span key={mood.id} className="nav-item-wrapper">
              <button
                type="button"
                className={`text-nav-btn ${playbackState.modeId === mood.id ? 'active' : ''}`}
                onClick={() => handleMoodClick(mood.id)}
              >
                {mood.label}
              </button>
              {idx < MOODS.length - 1 && <span className="nav-dot">•</span>}
            </span>
          ))}
        </nav>
      </section>
    </main>
  );
}
