// BHAIJAAN.WTF — Spotify Web Playback SDK Single Instance Manager

import { spotifyAuth } from './spotifyAuth';

export function getSpotifyUri(urlOrUri) {
  if (!urlOrUri) return 'spotify:playlist:3Ye57MhrB2yFkD39bdxU5c';
  if (urlOrUri.startsWith('spotify:')) return urlOrUri;
  try {
    const parsed = new URL(urlOrUri);
    const parts = parsed.pathname.split('/').filter(Boolean);
    if (parts.length >= 2) {
      return `spotify:${parts[0]}:${parts[1]}`;
    }
  } catch (e) {
    console.error('[BHAIJAAN] Invalid Spotify URL:', urlOrUri, e);
  }
  return 'spotify:playlist:3Ye57MhrB2yFkD39bdxU5c';
}

class SpotifySDKManager {
  constructor() {
    this.player = null;
    this.deviceId = null;
    this.token = null;
    this.isInitializing = false;
    this.listeners = new Set();
    this.currentContextUri = null;

    // Visibility Resync: Listen for tab visibility return to synchronize UI with Spotify state
    if (typeof document !== 'undefined') {
      document.addEventListener('visibilitychange', async () => {
        if (!document.hidden && this.player) {
          // DO NOT resume/pause manually. Only synchronize UI with actual Spotify state.
          await this.resyncState();
        }
      });
    }
  }

  async getCurrentState() {
    if (!this.player || typeof this.player.getCurrentState !== 'function') return null;
    try {
      return await this.player.getCurrentState();
    } catch (e) {
      console.warn('[BHAIJAAN] getCurrentState error:', e);
      return null;
    }
  }

  async resyncState() {
    const state = await this.getCurrentState();
    if (!state) return;
    const track = state.track_window?.current_track;
    this.notifyListeners('player_state_changed', {
      state,
      track,
      isPlaying: !state.paused,
      position: state.position,
      duration: state.duration,
      disallows: state.disallows || {},
      nextTracks: state.track_window?.next_tracks,
      previousTracks: state.track_window?.previous_tracks
    });
  }

  init(tokenOverride = null) {
    if (this.player || this.isInitializing) return Promise.resolve(this.player);
    this.isInitializing = true;

    return new Promise((resolve) => {
      window.onSpotifyWebPlaybackSDKReady = () => {
        console.log('[BHAIJAAN] Spotify SDK loaded');

        const player = new window.Spotify.Player({
          name: 'BHAIJAAN.WTF',
          getOAuthToken: async (cb) => {
            const validToken = await spotifyAuth.getValidToken();
            cb(validToken || tokenOverride || '');
          },
          volume: 0.8
        });

        this.player = player;
        console.log('[BHAIJAAN] Spotify player initialized');

        // 1. Ready Listener
        player.addListener('ready', ({ device_id }) => {
          this.deviceId = device_id;
          console.log('[BHAIJAAN] Spotify device ready:', device_id);
          this.notifyListeners('ready', { device_id });

          // Auto-transfer playback if context URI is set
          if (this.currentContextUri) {
            this.playContext(this.currentContextUri);
          }
        });

        // 2. Not Ready Listener
        player.addListener('not_ready', ({ device_id }) => {
          console.warn('[BHAIJAAN] Spotify device not ready:', device_id);
        });

        // 3. CANONICAL player_state_changed Listener (SINGLE SOURCE OF TRUTH)
        player.addListener('player_state_changed', (state) => {
          if (!state) return;

          const track = state.track_window.current_track;

          if (track) {
            console.log('[BHAIJAAN] PLAYBACK STATE:', {
              track: track.name,
              uri: track.uri,
              paused: state.paused,
              position: state.position,
              duration: state.duration,
              next: state.track_window.next_tracks?.[0]?.name,
              previous: state.track_window.previous_tracks?.[0]?.name
            });
          }

          this.notifyListeners('player_state_changed', {
            state,
            track,
            isPlaying: !state.paused,
            position: state.position,
            duration: state.duration,
            disallows: state.disallows || {},
            nextTracks: state.track_window.next_tracks,
            previousTracks: state.track_window.previous_tracks
          });
        });

        // 4. Error Listeners
        player.addListener('initialization_error', ({ message }) => {
          console.error('[BHAIJAAN] SDK Initialization Error:', message);
          this.notifyListeners('error', { message });
        });

        player.addListener('authentication_error', ({ message }) => {
          console.error('[BHAIJAAN] SDK Authentication Error:', message);
          this.notifyListeners('error', { message, authError: true });
        });

        player.addListener('account_error', ({ message }) => {
          console.error('[BHAIJAAN] SDK Account Error (Premium Required):', message);
          this.notifyListeners('error', { message, accountError: true });
        });

        player.connect().then((success) => {
          if (success) {
            console.log('[BHAIJAAN] Web Playback SDK connected successfully');
          } else {
            console.warn('[BHAIJAAN] Web Playback SDK connection failed');
          }
          this.isInitializing = false;
          resolve(player);
        });
      };

      // Load SDK Script if not already in document
      if (!document.querySelector('script[src="https://sdk.scdn.co/spotify-player/js/spotify-player.js"]')) {
        const script = document.createElement('script');
        script.src = 'https://sdk.scdn.co/spotify-player/js/spotify-player.js';
        script.async = true;
        document.body.appendChild(script);
      } else if (window.Spotify) {
        window.onSpotifyWebPlaybackSDKReady();
      }
    });
  }

  addListener(callback) {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  notifyListeners(type, data) {
    this.listeners.forEach((fn) => {
      try {
        fn(type, data);
      } catch (e) {}
    });
  }

  async togglePlay() {
    console.log('[BHAIJAAN] PLAY/PAUSE');
    if (!this.player) return;
    try {
      await this.player.togglePlay();
    } catch (e) {
      console.error('[BHAIJAAN] togglePlay error:', e);
    }
  }

  async nextTrack() {
    console.log('[BHAIJAAN] NEXT CLICK');
    if (!this.player) return;
    try {
      await this.player.nextTrack();
    } catch (e) {
      console.error('[BHAIJAAN] nextTrack error:', e);
    }
  }

  async previousTrack() {
    console.log('[BHAIJAAN] PREVIOUS CLICK');
    if (!this.player) return;
    try {
      await this.player.previousTrack();
    } catch (e) {
      console.error('[BHAIJAAN] previousTrack error:', e);
    }
  }

  async seek(positionMs) {
    console.log('[BHAIJAAN] SEEK:', positionMs);
    if (!this.player) return;
    try {
      await this.player.seek(Math.round(positionMs));
    } catch (e) {
      console.error('[BHAIJAAN] seek error:', e);
    }
  }

  async setVolume(volumeRatio) {
    if (!this.player || typeof this.player.setVolume !== 'function') return;
    try {
      await this.player.setVolume(volumeRatio);
    } catch (e) {
      console.error('[BHAIJAAN] setVolume error:', e);
    }
  }

  async playContext(urlOrUri) {
    const uri = getSpotifyUri(urlOrUri);
    this.currentContextUri = uri;
    console.log('[BHAIJAAN] MODE CHANGE / PLAY CONTEXT:', uri);

    const token = await spotifyAuth.getValidToken();
    if (!token || !this.deviceId) {
      console.warn('[BHAIJAAN] Device ID or Auth Token missing for Web API playback request');
      return;
    }

    try {
      const response = await fetch(`https://api.spotify.com/v1/me/player/play?device_id=${this.deviceId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          context_uri: uri
        })
      });

      if (!response.ok) {
        if (response.status === 401) {
          console.warn('[BHAIJAAN] 401 Unauthorized — Refreshing token and retrying...');
          const freshToken = await spotifyAuth.refreshToken();
          if (freshToken) {
            await fetch(`https://api.spotify.com/v1/me/player/play?device_id=${this.deviceId}`, {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${freshToken}`
              },
              body: JSON.stringify({ context_uri: uri })
            });
          }
        } else {
          const errorData = await response.json().catch(() => ({}));
          console.error('[BHAIJAAN] Spotify playback error:', response.status, errorData);
        }
      } else {
        console.log('[BHAIJAAN] Playback context transferred to device successfully');
      }
    } catch (e) {
      console.error('[BHAIJAAN] Spotify playback error:', e);
    }
  }
}

export const spotifySDK = new SpotifySDKManager();
export default spotifySDK;
