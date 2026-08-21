import { useCallback, useEffect, useRef, useState } from 'react';
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

// Map mood IDs directly to playlists with unique Spotify URLs
function getPlaylistForMood(moodId) {
  switch (moodId) {
    case 'ROMANCE':
    case 'PEHLA PYAR':
      return playlists.pehlaPyar;
    case 'BHAI MODE':
      return playlists.bhaiMode;
    case 'NOSTALGIA':
    case '90s RADIO':
    case '90s':
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
  // Single Canonical Playback State
  const [playbackState, setPlaybackState] = useState({
    modeId: 'ALL',
    playlist: PLAYLISTS[0],
    currentTrack: PLAYLISTS[0].tracks[0],
    isPlaying: false,
    isLoading: false,
    position: 0,
    duration: 0,
    error: null
  });

  const [filmFlash, setFilmFlash] = useState(false);
  const [isRewinding, setIsRewinding] = useState(false);

  const spotifyRef = useRef(null);
  const switchRequestRef = useRef(0);

  const triggerRewindEffect = useCallback(() => {
    audioFX.playFilmBurn();
    setIsRewinding(true);
    setFilmFlash(true);
    setTimeout(() => {
      setIsRewinding(false);
      setFilmFlash(false);
    }, 350);
  }, []);

  const handlePlaybackChange = useCallback((data) => {
    setPlaybackState((prev) => {
      const isPaused = typeof data.isPaused === 'boolean' ? data.isPaused : !prev.isPlaying;
      const isPlaying = !isPaused;
      const position = Number.isFinite(data.position) ? Math.round(data.position / 1000) : prev.position;
      const duration = Number.isFinite(data.duration) ? Math.round(data.duration / 1000) : prev.duration;
      
      let matchedTrack = prev.currentTrack;
      if (data.playingUri) {
        console.log('[BHAIJAAN] PLAYING URI:', data.playingUri);
        const found = prev.playlist.tracks.find(t => t.spotifyUri === data.playingUri || t.id === data.playingUri);
        if (found) {
          console.log('[BHAIJAAN] CURRENT SONG MATCHED:', found.title);
          matchedTrack = found;
        }
      }

      return {
        ...prev,
        isPlaying,
        isLoading: false,
        position,
        duration,
        currentTrack: matchedTrack
      };
    });
  }, []);

  // Central Mode / Playlist Change Function with Rapid Click Protection
  const changeMode = useCallback((targetPlaylist, targetTrack = null, autoStart = false) => {
    if (!targetPlaylist) return;
    const selectedTrack = targetTrack || targetPlaylist.tracks[0];
    const requestId = ++switchRequestRef.current;

    console.log('[BHAIJAAN] SWITCH REQUEST ID:', requestId);
    console.log('[BHAIJAAN] MODE CHANGE:', targetPlaylist.name);
    console.log('[BHAIJAAN] LOADING PLAYLIST URL:', targetPlaylist.spotifyUrl);

    triggerRewindEffect();

    // Prevent stale song display while new mode/playlist loads
    setPlaybackState((prev) => ({
      ...prev,
      playlist: targetPlaylist,
      currentTrack: selectedTrack,
      isLoading: true,
      error: null
    }));

    // Dynamically load the new playlist entity into the persistent Spotify Controller
    spotifyController.loadEntity(targetPlaylist.spotifyUrl);

    if (autoStart) {
      setTimeout(() => {
        if (requestId === switchRequestRef.current) {
          spotifyController.play();
        }
      }, 300);
    }
  }, [triggerRewindEffect]);

  const takeMeBack = useCallback(() => {
    console.log('[BHAIJAAN] TAKE ME BACK TRIGGERED');
    const randomPi = Math.floor(Math.random() * PLAYLISTS.length);
    const randomPlaylist = PLAYLISTS[randomPi];
    const randomTi = Math.floor(Math.random() * randomPlaylist.tracks.length);

    changeMode(randomPlaylist, randomPlaylist.tracks[randomTi], true);
  }, [changeMode]);

  const choosePlaylist = (pi, start = false) => {
    audioFX.playClick();
    const targetPlaylist = PLAYLISTS[pi];
    changeMode(targetPlaylist, targetPlaylist.tracks[0], start);
  };

  const triggerBhaiMode = useCallback(() => {
    audioFX.playBhaiMode();
    setPlaybackState(prev => ({ ...prev, modeId: 'BHAI MODE' }));
    changeMode(playlists.bhaiMode, playlists.bhaiMode.tracks[0], true);
  }, [changeMode]);

  const handleMoodClick = useCallback((mood) => {
    audioFX.playClick();
    const moodId = typeof mood === 'object' ? mood.id : mood;
    setPlaybackState(prev => ({ ...prev, modeId }));
    
    if (moodId === 'BHAI MODE') {
      triggerBhaiMode();
      return;
    }

    const targetPlaylist = getPlaylistForMood(moodId);
    changeMode(targetPlaylist, targetPlaylist.tracks[0], true);
  }, [changeMode, triggerBhaiMode]);

  const next = useCallback(() => {
    audioFX.playClick();
    const tracks = playbackState.playlist.tracks;
    const currentIdx = tracks.findIndex(t => t.id === playbackState.currentTrack.id);
    const nextIdx = (currentIdx + 1) % tracks.length;
    const nextTrack = tracks[nextIdx];
    
    setPlaybackState(prev => ({
      ...prev,
      currentTrack: nextTrack
    }));

    if (nextTrack.spotifyUri && nextTrack.spotifyUri.startsWith('spotify:track:')) {
      spotifyController.loadEntity(nextTrack.spotifyUri);
    } else {
      spotifyController.next();
    }
  }, [playbackState.playlist.tracks, playbackState.currentTrack.id]);

  const previous = useCallback(() => {
    audioFX.playClick();
    const tracks = playbackState.playlist.tracks;
    const currentIdx = tracks.findIndex(t => t.id === playbackState.currentTrack.id);
    const prevIdx = (currentIdx - 1 + tracks.length) % tracks.length;
    const prevTrack = tracks[prevIdx];
    
    setPlaybackState(prev => ({
      ...prev,
      currentTrack: prevTrack
    }));

    if (prevTrack.spotifyUri && prevTrack.spotifyUri.startsWith('spotify:track:')) {
      spotifyController.loadEntity(prevTrack.spotifyUri);
    } else {
      spotifyController.previous();
    }
  }, [playbackState.playlist.tracks, playbackState.currentTrack.id]);

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

      {/* Persistent Off-Screen Spotify iFrame Embed (Mounts ONCE on application startup) */}
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
          onClick={() => choosePlaylist(0, false)}
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
            onChange={(event) => choosePlaylist(Number(event.target.value), true)}
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

      {/* Environment Cassette Object Player Dock (15-20% footprint) */}
      <section className="dock environment-dock" aria-label="Player">
        <MusicPlayer
          track={playbackState.currentTrack}
          playlist={playbackState.playlist}
          isPlaying={playbackState.isPlaying}
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
