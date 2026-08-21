import { useCallback, useEffect, useRef, useState } from 'react';
import { SONGS } from './data/songs';
import { playlists, PLAYLISTS } from './data/playlists';
import { MOODS } from './data/moods';
import { MusicPlayer } from './components/MusicPlayer/MusicPlayer';
import { SpotifyEmbed } from './components/SpotifyEmbed';
import { spotifyController } from './utils/spotifyController';
import { audioFX } from './utils/audioFX';

function isTypingTarget(target) {
  if (!(target instanceof HTMLElement)) return false;
  const tag = target.tagName;
  return tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || target.isContentEditable;
}

export default function App() {
  // Independent States: activeMode, activePlaylist, currentTrack, isPlaying, position, duration
  const [activeMode, setActiveMode] = useState(MOODS[0]);
  const [activePlaylist, setActivePlaylist] = useState(PLAYLISTS[0]);
  const [currentTrack, setCurrentTrack] = useState(PLAYLISTS[0].initialTrack); // Initial Song Name
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(0);

  const [filmFlash, setFilmFlash] = useState(false);
  const [isRewinding, setIsRewinding] = useState(false);

  const spotifyRef = useRef(null);

  // Rewind effect helper
  const triggerRewindEffect = useCallback(() => {
    audioFX.playFilmBurn();
    setIsRewinding(true);
    setFilmFlash(true);
    requestAnimationFrame(() => {
      setTimeout(() => {
        setIsRewinding(false);
        setFilmFlash(false);
      }, 120);
    });
  }, []);

  // Spotify Playback Event Handler — Updates currentTrack from Spotify live events
  const handlePlaybackChange = useCallback((data) => {
    if (data.error) {
      console.error('[BHAIJAAN] Spotify Embed Error:', data.error);
    }

    if (typeof data.isPaused === 'boolean') {
      setIsPlaying(!data.isPaused);
    }
    
    // Live Progress Bar Sync
    if (Number.isFinite(data.position)) {
      setPosition(Math.round(data.position / 1000));
    }
    if (Number.isFinite(data.duration) && data.duration > 0) {
      setDuration(Math.round(data.duration / 1000));
    }

    setIsLoading(false);

    // Update currentTrack strictly when Spotify emits live track metadata
    if (data.playingUri || data.trackInfo) {
      const localMatch = data.playingUri
        ? SONGS.find((s) => s.spotifyUri === data.playingUri || s.id === data.playingUri)
        : null;

      if (localMatch) {
        setCurrentTrack(localMatch);
      } else if (data.trackInfo && data.trackInfo.title) {
        setCurrentTrack(data.trackInfo);
      }
    }
  }, []);

  // Mode & Playlist Switcher: Sets mode's initial track immediately & syncs with Spotify events
  const changeMode = useCallback((targetMood, targetPlaylist, autoStart = true) => {
    if (!targetPlaylist) return;
    triggerRewindEffect();

    console.log('[BHAIJAAN] LOAD SPOTIFY PLAYLIST:', targetPlaylist.name, targetPlaylist.spotifyUrl);

    const initialSong = targetPlaylist.initialTrack || SONGS[0];

    setActiveMode(targetMood || MOODS[0]);
    setActivePlaylist(targetPlaylist);
    setCurrentTrack(initialSong); // Instantly set song name
    setPosition(0);
    setDuration(0);
    setIsLoading(false);

    spotifyController.loadEntity(targetPlaylist.spotifyUrl);

    if (autoStart) {
      spotifyController.play();
    }
  }, [triggerRewindEffect]);

  // "PLAY SOMETHING": Plays active Spotify playlist
  const playSomething = useCallback(() => {
    audioFX.playClick();
    changeMode(activeMode, activePlaylist, true);
  }, [changeMode, activeMode, activePlaylist]);

  // "TAKE ME BACK": Randomly selects a Spotify playlist mode
  const takeMeBack = useCallback(() => {
    const randomMood = MOODS[Math.floor(Math.random() * MOODS.length)];
    const key = randomMood.key || 'bhaiMode';
    const targetPlaylist = playlists[key] || PLAYLISTS[0];

    changeMode(randomMood, targetPlaylist, true);
  }, [changeMode]);

  const handleMoodClick = useCallback((mood) => {
    audioFX.playClick();
    const moodObj = typeof mood === 'object' ? mood : MOODS.find(m => m.id === mood || m.key === mood);
    const key = moodObj ? moodObj.key : 'bhaiMode';
    const targetPlaylist = playlists[key] || PLAYLISTS[0];

    if (key === 'bhaiMode') {
      audioFX.playBhaiMode();
    }

    changeMode(moodObj, targetPlaylist, true);
  }, [changeMode]);

  const next = useCallback(() => {
    audioFX.playClick();
    setPosition(0);
    spotifyController.next();
  }, []);

  const previous = useCallback(() => {
    audioFX.playClick();
    setPosition(0);
    spotifyController.previous();
  }, []);

  const toggle = useCallback(() => {
    audioFX.playClick();
    spotifyController.togglePlay();
  }, []);

  const handleSeek = useCallback((seconds) => {
    setPosition(seconds);
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

      {/* Persistent Background Spotify Embed Container */}
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
          initialPlaylistUrl={activePlaylist.spotifyUrl}
          onPlaybackChange={handlePlaybackChange}
        />
      </div>

      {/* Top Header */}
      <header className="top">
        <button
          type="button"
          className="logo"
          onClick={() => changeMode(MOODS[0], PLAYLISTS[0], false)}
          aria-label="BHAIJAAN.WTF home"
        >
          BHAIJAAN<span>.WTF</span>
        </button>
        <p className="online"><i /> 1,847 <span>online</span></p>
        <label className="collection-button">
          ◉{' '}
          <select
            aria-label="Playlist"
            value={PLAYLISTS.findIndex(p => p.id === activePlaylist.id)}
            onChange={(event) => {
              const idx = Number(event.target.value);
              const targetPlaylist = PLAYLISTS[idx];
              const targetMood = MOODS.find(m => m.key === targetPlaylist.id) || MOODS[idx] || MOODS[0];
              changeMode(targetMood, targetPlaylist, true);
            }}
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
          <button type="button" className="text-action-btn play-something-link" onClick={playSomething}>
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
          mode={activeMode}
          playlist={activePlaylist}
          track={currentTrack}
          isPlaying={isPlaying}
          isLoading={isLoading}
          playbackProgress={{ current: position, duration: duration }}
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
                className={`text-nav-btn ${activeMode.id === mood.id ? 'active' : ''}`}
                onClick={() => handleMoodClick(mood)}
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
