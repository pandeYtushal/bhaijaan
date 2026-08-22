import { useCallback, useEffect, useState } from 'react';
import { playlists, PLAYLISTS } from './data/playlists';
import { MOODS } from './data/moods';
import { MusicPlayer } from './components/MusicPlayer/MusicPlayer';
import { YouTubePlayer } from './components/YouTubePlayer';
import { audioEngine } from './utils/audioEngine';
import { audioFX } from './utils/audioFX';

function isTypingTarget(target) {
  if (!(target instanceof HTMLElement)) return false;
  const tag = target.tagName;
  return tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || target.isContentEditable;
}

export default function App() {
  const [activeMode, setActiveMode] = useState(MOODS[0]);
  const [activePlaylist, setActivePlaylist] = useState(PLAYLISTS[0]);

  // 100% Canonical playback state from SaloonAudioEngine
  const [currentTrack, setCurrentTrack] = useState(PLAYLISTS[0].tracks[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(PLAYLISTS[0].tracks[0].duration || 300);

  const [filmFlash, setFilmFlash] = useState(false);
  const [isRewinding, setIsRewinding] = useState(false);

  // Rewind & Radio Tuning Effect
  const triggerRewindEffect = useCallback(() => {
    audioFX.playRadioTuning();
    setIsRewinding(true);
    setFilmFlash(true);
    requestAnimationFrame(() => {
      setTimeout(() => {
        setIsRewinding(false);
        setFilmFlash(false);
      }, 150);
    });
  }, []);

  // Listen to SaloonAudioEngine updates (100% accurate song titles & state)
  useEffect(() => {
    // Initial load sync - start clean from 0:00
    audioEngine.loadPlaylist(PLAYLISTS[0], false, false);

    const unsubscribe = audioEngine.addListener((type, data) => {
      if (type === 'playback_update' || type === 'state_change') {
        if (typeof data.isPlaying === 'boolean') {
          setIsPlaying(data.isPlaying);
        } else if (typeof data.isPaused === 'boolean') {
          setIsPlaying(!data.isPaused);
        }
        if (Number.isFinite(data.position)) {
          setPosition(data.position);
        }
        if (Number.isFinite(data.duration) && data.duration > 0) {
          setDuration(data.duration);
        }
        if (data.trackInfo && data.trackInfo.title) {
          setCurrentTrack(data.trackInfo);
        }
        setIsLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  // Unlock Web Audio Context on first touch/click anywhere (saloon.wtf mobile auto-resume)
  useEffect(() => {
    const handleFirstUserGesture = () => {
      audioFX.init();
      audioFX.toggleVinylCrackle(true);
    };
    window.addEventListener('click', handleFirstUserGesture, { once: true });
    window.addEventListener('touchstart', handleFirstUserGesture, { once: true });
    return () => {
      window.removeEventListener('click', handleFirstUserGesture);
      window.removeEventListener('touchstart', handleFirstUserGesture);
    };
  }, []);

  // Mode Switcher: Loads Saloon Station Playlist directly
  const changeMode = useCallback((targetMood, targetPlaylist, autoStart = true) => {
    if (!targetPlaylist) return;
    triggerRewindEffect();

    console.log('[BHAIJAAN] LOAD SALOON STATION PLAYLIST:', targetPlaylist.name);

    setActiveMode(targetMood || MOODS[0]);
    setActivePlaylist(targetPlaylist);
    if (targetPlaylist.tracks && targetPlaylist.tracks[0]) {
      setCurrentTrack(targetPlaylist.tracks[0]);
      setDuration(targetPlaylist.tracks[0].duration || 300);
    }
    setPosition(0);

    audioEngine.loadPlaylist(targetPlaylist, autoStart, false);
  }, [triggerRewindEffect]);

  // Actions
  const playSomething = useCallback(() => {
    audioFX.playScissors();
    changeMode(activeMode, activePlaylist, true);
  }, [changeMode, activeMode, activePlaylist]);

  const takeMeBack = useCallback(() => {
    const randomMood = MOODS[Math.floor(Math.random() * MOODS.length)];
    const key = randomMood.key || 'bhaiMode';
    const targetPlaylist = playlists[key] || PLAYLISTS[0];

    changeMode(randomMood, targetPlaylist, true);
  }, [changeMode]);

  const handleMoodClick = useCallback((mood) => {
    audioFX.playScissors();
    const moodObj = typeof mood === 'object' ? mood : MOODS.find(m => m.id === mood || m.key === mood);
    const key = moodObj ? moodObj.key : 'bhaiMode';
    const targetPlaylist = playlists[key] || PLAYLISTS[0];

    if (key === 'bhaiMode') {
      audioFX.playBhaiMode();
    }

    changeMode(moodObj, targetPlaylist, true);
  }, [changeMode]);

  const next = useCallback(() => {
    audioFX.playRadioTuning();
    audioEngine.next();
  }, []);

  const previous = useCallback(() => {
    audioFX.playRadioTuning();
    audioEngine.previous();
  }, []);

  const toggle = useCallback(() => {
    setIsPlaying((prev) => !prev);
    audioEngine.toggle();
  }, []);

  const handleSeek = useCallback((seconds) => {
    setPosition(seconds);
    audioEngine.seek(seconds);
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

      {/* Hidden YouTube Audio Stream Player */}
      <YouTubePlayer />

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

