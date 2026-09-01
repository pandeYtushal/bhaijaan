// BHAIJAAN.WTF — High Performance Saloon Audio Engine
// Full-length YouTube streaming (3-5 min full songs) + HTML5 fallback

import { audioFX } from './audioFX';

function fisherYates(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

class SaloonAudioEngine {
  constructor() {
    this.audio = new Audio();
    this.audio.preload = 'auto';
    this.ytPlayer = null;
    this.currentPlaylist = null;
    this.currentTrack = null;
    this.currentTrackIndex = 0;
    this.isPlaying = false;
    this.listeners = new Set();
    this.stationEpoch = 1700000000;
    this.timer = null;

    // Shuffle Queue State
    this.shuffleEnabled = false;
    this.shuffleQueue = [];
    this.shuffleHistory = new Set();

    // HTML5 Audio Events (Fallback)
    this.audio.addEventListener('timeupdate', () => {
      if (this.ytPlayer && this.currentTrack?.youtubeId) return;
      const realDur = (Number.isFinite(this.audio.duration) && this.audio.duration > 0)
        ? Math.round(this.audio.duration)
        : (this.currentTrack?.duration || 300);

      this.notifyListeners('playback_update', {
        position: Math.round(this.audio.currentTime),
        duration: realDur,
        isPaused: this.audio.paused,
        trackInfo: this.currentTrack
      });
    });

    this.audio.addEventListener('play', () => {
      if (this.ytPlayer && this.currentTrack?.youtubeId) return;
      this.isPlaying = true;
      this.notifyListeners('state_change', { isPlaying: true, isPaused: false, trackInfo: this.currentTrack });
    });

    this.audio.addEventListener('pause', () => {
      if (this.ytPlayer && this.currentTrack?.youtubeId) return;
      this.isPlaying = false;
      this.notifyListeners('state_change', { isPlaying: false, isPaused: true, trackInfo: this.currentTrack });
    });

    this.audio.addEventListener('ended', () => {
      if (this.ytPlayer && this.currentTrack?.youtubeId) return;
      console.log('[SaloonAudioEngine] Track ended, playing next track');
      this.next();
    });
  }

  // Shuffle Queue
  buildShuffleQueue(excludeCurrentId = null) {
    if (!this.currentPlaylist || !this.currentPlaylist.tracks.length) return;
    const ids = this.currentPlaylist.tracks.map((t) => t.id);
    let shuffled = fisherYates(ids);

    if (excludeCurrentId && shuffled.length > 1 && shuffled[0] === excludeCurrentId) {
      shuffled = [...shuffled.slice(1), shuffled[0]];
    }

    this.shuffleQueue = shuffled;
    this.shuffleHistory = new Set();
  }

  nextShuffleId() {
    if (this.shuffleQueue.length === 0) {
      this.buildShuffleQueue(this.currentTrack?.id ?? null);
    }
    const nextId = this.shuffleQueue.shift();
    this.shuffleHistory.add(nextId);
    return nextId;
  }

  setShuffle(enabled) {
    this.shuffleEnabled = enabled;
    if (enabled && this.currentPlaylist) {
      this.buildShuffleQueue(this.currentTrack?.id ?? null);
    } else {
      this.shuffleQueue = [];
      this.shuffleHistory = new Set();
    }
  }

  setYouTubePlayer(player) {
    this.ytPlayer = player;
    console.log('[SaloonAudioEngine] YouTube player connected successfully');
    if (this.currentTrack && this.currentTrack.youtubeId) {
      try {
        this.ytPlayer.cueVideoById(this.currentTrack.youtubeId, 0);
      } catch (e) { }
    }
  }

  onYTPlaybackStateChange(isPlaying) {
    this.isPlaying = isPlaying;
    if ('mediaSession' in navigator) {
      navigator.mediaSession.playbackState = isPlaying ? 'playing' : 'paused';
    }
    if (isPlaying) {
      this.startProgressTimer();
    } else {
      this.stopProgressTimer();
    }
    this.notifyListeners('state_change', { isPlaying: this.isPlaying, isPaused: !this.isPlaying, trackInfo: this.currentTrack });
  }

  startProgressTimer() {
    this.stopProgressTimer();
    this.timer = setInterval(() => {
      if (!this.ytPlayer || typeof this.ytPlayer.getCurrentTime !== 'function') return;
      try {
        const current = Math.round(this.ytPlayer.getCurrentTime() || 0);
        const rawDur = this.ytPlayer.getDuration();
        const dur = (Number.isFinite(rawDur) && rawDur > 0) ? Math.round(rawDur) : (this.currentTrack?.duration || 300);

        this.notifyListeners('playback_update', {
          position: current,
          duration: dur,
          isPlaying: this.isPlaying,
          isPaused: !this.isPlaying,
          trackInfo: this.currentTrack
        });
      } catch (e) { }
    }, 100);
  }

  stopProgressTimer() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }

  getStationSyncState(playlist) {
    if (!playlist || !playlist.tracks || playlist.tracks.length === 0) {
      return { index: 0, position: 0 };
    }
    const tracks = playlist.tracks;
    const totalDuration = tracks.reduce((acc, t) => acc + (t.duration || 300), 0);
    const now = Math.floor(Date.now() / 1000);
    const elapsedInCycle = (now - this.stationEpoch) % totalDuration;

    let accumulated = 0;
    for (let i = 0; i < tracks.length; i++) {
      const trackDur = tracks[i].duration || 300;
      if (elapsedInCycle < accumulated + trackDur) {
        return { index: i, position: elapsedInCycle - accumulated };
      }
      accumulated += trackDur;
    }
    return { index: 0, position: 0 };
  }

  addListener(callback) {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  notifyListeners(type, data) {
    this.listeners.forEach((fn) => {
      try { fn(type, data); } catch (e) { }
    });
  }

  loadPlaylist(playlist, autoPlay = true, syncToStation = false) {
    if (!playlist || !playlist.tracks || playlist.tracks.length === 0) return;

    const isModeSwitch = this.currentPlaylist?.id !== playlist.id;
    this.currentPlaylist = playlist;

    if (isModeSwitch && this.shuffleEnabled) {
      this.buildShuffleQueue(null);
    }

    let targetIndex = 0;
    let initialPosition = 0;

    if (syncToStation && !this.shuffleEnabled) {
      const syncState = this.getStationSyncState(playlist);
      targetIndex = syncState.index;
      initialPosition = syncState.position;
    } else if (this.shuffleEnabled) {
      this.buildShuffleQueue(null);
      const firstId = this.shuffleQueue.shift();
      targetIndex = playlist.tracks.findIndex((t) => t.id === firstId);
      if (targetIndex < 0) targetIndex = 0;
    }

    this.playTrackAtIndex(targetIndex, autoPlay, initialPosition);
  }

  updateMediaSession(track) {
    if (!('mediaSession' in navigator) || !track) return;

    try {
      const singers = Array.isArray(track.singers)
        ? track.singers.join(', ')
        : (track.singers || 'Salman Khan');

      const albumTitle = track.film
        ? `${track.film}${track.year ? ` (${track.year})` : ''}`
        : 'BHAIJAAN.WTF';

      navigator.mediaSession.metadata = new MediaMetadata({
        title: track.title || 'BHAIJAAN',
        artist: singers,
        album: albumTitle,
        artwork: [
          { src: '/favicon.svg', sizes: '96x96', type: 'image/svg+xml' }
        ]
      });

      navigator.mediaSession.setActionHandler('play', () => this.play());
      navigator.mediaSession.setActionHandler('pause', () => this.pause());
      navigator.mediaSession.setActionHandler('previoustrack', () => this.previous());
      navigator.mediaSession.setActionHandler('nexttrack', () => this.next());
      navigator.mediaSession.setActionHandler('seekto', (details) => {
        if (details.seekTime !== undefined) this.seek(details.seekTime);
      });
    } catch (e) {
      console.warn('[SaloonAudioEngine] MediaSession notice:', e);
    }
  }

  playTrackAtIndex(index, autoPlay = true, initialPosition = 0) {
    if (!this.currentPlaylist || !this.currentPlaylist.tracks) return;
    const tracks = this.currentPlaylist.tracks;
    const validIndex = ((index % tracks.length) + tracks.length) % tracks.length;

    this.currentTrackIndex = validIndex;
    const track = tracks[validIndex];
    this.currentTrack = track;

    console.log(`[SaloonAudioEngine] Playing Full Song [${validIndex + 1}/${tracks.length}]: "${track.title}" (${track.film}, ${track.year})`);

    this.updateMediaSession(track);

    this.notifyListeners('playback_update', {
      position: Math.round(initialPosition),
      duration: Math.round(track.duration || 300),
      isPaused: !autoPlay,
      trackInfo: track
    });

    try {
      this.audio.pause();
      if (this.ytPlayer && typeof this.ytPlayer.stopVideo === 'function') {
        this.ytPlayer.stopVideo();
      }
    } catch (e) { }

    // Primary: Full-Length YouTube Video Audio Stream (3 to 5 minutes full track)
    if (this.ytPlayer && typeof this.ytPlayer.loadVideoById === 'function' && track.youtubeId) {
      try {
        if (autoPlay) {
          this.ytPlayer.loadVideoById(track.youtubeId, initialPosition);
        } else {
          this.ytPlayer.cueVideoById(track.youtubeId, initialPosition);
        }
        return;
      } catch (e) {
        console.warn('[SaloonAudioEngine] YT load notice:', e);
      }
    }

    // Fallback: HTML5 audio (audioUrl)
    const audioUrl = track.audioUrl;
    if (audioUrl) {
      if (this.audio.src !== audioUrl) {
        this.audio.src = audioUrl;
      }
      if (initialPosition > 0) {
        this.audio.currentTime = initialPosition;
      }
      if (autoPlay) {
        this.play();
      } else {
        this.audio.pause();
      }
    }
  }

  play() {
    audioFX.playCassetteClick();
    if (this.ytPlayer && typeof this.ytPlayer.playVideo === 'function' && this.currentTrack?.youtubeId) {
      try {
        this.ytPlayer.playVideo();
        this.isPlaying = true;
        return;
      } catch (e) { }
    }

    this.audio.play()
      .then(() => { this.isPlaying = true; })
      .catch((err) => { console.warn('[SaloonAudioEngine] Play notice:', err); });
  }

  pause() {
    audioFX.playCassetteClick();
    if (this.ytPlayer && typeof this.ytPlayer.pauseVideo === 'function' && this.currentTrack?.youtubeId) {
      try {
        this.ytPlayer.pauseVideo();
        this.isPlaying = false;
        return;
      } catch (e) { }
    }

    this.audio.pause();
    this.isPlaying = false;
  }

  toggle() {
    audioFX.playCassetteClick();
    if (this.isPlaying) this.pause();
    else this.play();
  }

  next() {
    audioFX.playRadioTuning();
    if (!this.currentPlaylist) return;

    if (this.shuffleEnabled) {
      const nextId = this.nextShuffleId();
      const idx = this.currentPlaylist.tracks.findIndex((t) => t.id === nextId);
      this.playTrackAtIndex(idx >= 0 ? idx : 0, true, 0);
    } else {
      const nextIndex = (this.currentTrackIndex + 1) % this.currentPlaylist.tracks.length;
      this.playTrackAtIndex(nextIndex, true, 0);
    }
  }

  previous() {
    audioFX.playRadioTuning();
    if (!this.currentPlaylist) return;

    if (this.shuffleEnabled) {
      this.playTrackAtIndex(this.currentTrackIndex, true, 0);
    } else {
      const prevIndex = (this.currentTrackIndex - 1 + this.currentPlaylist.tracks.length) % this.currentPlaylist.tracks.length;
      this.playTrackAtIndex(prevIndex, true, 0);
    }
  }

  seek(seconds) {
    if (!Number.isFinite(seconds)) return;
    if (this.ytPlayer && typeof this.ytPlayer.seekTo === 'function' && this.currentTrack?.youtubeId) {
      try {
        this.ytPlayer.seekTo(seconds, true);
        return;
      } catch (e) { }
    }

    this.audio.currentTime = seconds;
    this.notifyListeners('playback_update', {
      position: Math.round(seconds),
      duration: Math.round(this.audio.duration || this.currentTrack?.duration || 300),
      isPaused: !this.isPlaying,
      trackInfo: this.currentTrack
    });
  }
}

export const audioEngine = new SaloonAudioEngine();
export default audioEngine;
