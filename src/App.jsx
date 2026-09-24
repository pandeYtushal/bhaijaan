/**
 * @file App.jsx
 * @description Main application entry point for "Bhaijaan". 
 * Manages the global state for the audio player, handles playlist switching (eras),
 * and orchestrates UI interactions like global keyboard shortcuts and vinyl effects.
 */

import { useCallback, useEffect, useState } from 'react';
import { playlist, PLAYLISTS } from './data/playlists';
import { MusicPlayer } from './components/MusicPlayer/MusicPlayer';
import { YouTubePlayer } from './components/YouTubePlayer';
import { audioEngine } from './utils/audioEngine';
import { audioFX } from './utils/audioFX';

/**
 * Utility to determine if a keyboard event originated from a typing field.
 * Prevents global hotkeys from interfering with user inputs.
 * 
 * @param {EventTarget} target - The DOM element target of the event.
 * @returns {boolean} True if the target is an input field.
 */
function isTypingTarget(target) {
  if (!(target instanceof HTMLElement)) return false;
  const tag = target.tagName;
  return tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || target.isContentEditable;
}

/**
 * Main App Component
 * Integrates the MusicPlayer UI with the SaloonAudioEngine and visual elements.
 */
export default function App() {
  const [activePlaylist, setActivePlaylist] = useState(playlist);
  const [currentTrack, setCurrentTrack] = useState(activePlaylist.tracks[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(playlist.tracks[0]?.duration || 300);
  const [filmFlash, setFilmFlash] = useState(false);
  const [isRewinding, setIsRewinding] = useState(false);

  const triggerRewindEffect = useCallback(() => {
    setIsRewinding(true);
    setFilmFlash(true);
    requestAnimationFrame(() => {
      setTimeout(() => {
        setIsRewinding(false);
        setFilmFlash(false);
      }, 150);
    });
  }, []);

  // Listen to SaloonAudioEngine updates
  useEffect(() => {
    audioEngine.loadPlaylist(activePlaylist, false, false);

    const unsubscribe = audioEngine.addListener((type, data) => {
      if (type === 'playback_update' || type === 'state_change') {
        if (typeof data.isPlaying === 'boolean') {
          setIsPlaying(data.isPlaying);
        } else if (typeof data.isPaused === 'boolean') {
          setIsPlaying(!data.isPaused);
        }
        if (Number.isFinite(data.position)) setPosition(data.position);
        if (Number.isFinite(data.duration) && data.duration > 0) setDuration(data.duration);
        if (data.trackInfo && data.trackInfo.title) setCurrentTrack(data.trackInfo);
        setIsLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  // Unlock Web Audio on first gesture
  useEffect(() => {
    const handle = () => {
      audioFX.init();
      audioFX.toggleVinylCrackle(true);
    };
    window.addEventListener('click', handle, { once: true });
    window.addEventListener('touchstart', handle, { once: true });
    return () => {
      window.removeEventListener('click', handle);
      window.removeEventListener('touchstart', handle);
    };
  }, []);

  const next = useCallback(() => {
    triggerRewindEffect();
    audioEngine.next();
  }, [triggerRewindEffect]);

  const previous = useCallback(() => {
    triggerRewindEffect();
    audioEngine.previous();
  }, [triggerRewindEffect]);

  const toggle = useCallback(() => {
    audioEngine.toggle();
  }, []);

  const handleSeek = useCallback((seconds) => {
    setPosition(seconds);
    audioEngine.seek(seconds);
  }, []);

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (isTypingTarget(event.target)) return;
      const code = event.code || event.key;
      if (code === 'Space' || event.key === ' ' || event.key === 'Spacebar') {
        event.preventDefault();
        toggle();
      } else if (code === 'ArrowRight' || event.key === 'ArrowRight') {
        event.preventDefault();
        next();
      } else if (code === 'ArrowLeft' || event.key === 'ArrowLeft') {
        event.preventDefault();
        previous();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [next, previous, toggle]);

  const switchPlaylist = useCallback((newPlaylist) => {
    setActivePlaylist(newPlaylist);
    setCurrentTrack(newPlaylist.tracks[0]);
    audioEngine.loadPlaylist(newPlaylist, true, false);
  }, []);

  return (
    <main className="saloon-page">
      {filmFlash && <div className="film-flash" aria-hidden="true" />}
      <div className="photo" />
      <div className="shade" />
      <div className="noise" />

      {/* Hidden YouTube Audio Stream Player */}
      <YouTubePlayer />

      {/* Center Stage */}
      <section className="center-stage">
        <div className="hero-content-wrapper">
          <div className="hero-main">
            <h1 className="hero-hindi-title">भाईजान</h1>
            <p className="hindi">{activePlaylist.name}</p>
            <p className="years">{activePlaylist.subtitle}</p>
          </div>
          <nav className="vertical-modes-nav" aria-label="Eras">
            {PLAYLISTS.map((pl, index) => (
              <button
                key={pl.id}
                className={`vertical-mode-btn ${activePlaylist.id === pl.id ? 'active' : ''}`}
                onClick={() => switchPlaylist(pl)}
              >
                <span className="mode-number">0{index + 1}</span>
                <span className="mode-label-text">{pl.label}</span>
              </button>
            ))}
          </nav>
        </div>
      </section>

      {/* Player Dock */}
      <section className="dock environment-dock" aria-label="Player">
        <MusicPlayer
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
      </section>

      {/* Site Footer */}
      <footer className="saloon-footer">
        <p className="footer-credits">
          Made by <a href="https://tushal-pandey.vercel.app/" target="_blank" rel="noopener noreferrer" className="footer-link">Tushal Pandey</a>
        </p>
      </footer>
    </main>
  );
}
