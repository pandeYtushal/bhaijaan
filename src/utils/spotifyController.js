// Spotify Controller API Wrapper for BHAIJAAN.WTF — Persistent Controller Instance

export function getSpotifyUri(urlOrUri) {
  if (!urlOrUri) return 'spotify:playlist:6zgVvGyocDlJCntkDnKqU3';
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
  return 'spotify:playlist:6zgVvGyocDlJCntkDnKqU3';
}

class SpotifyControllerManager {
  constructor() {
    this.controller = null;
    this.apiPromise = null;
    this.currentUri = '';
    this.listeners = new Set();
  }

  loadApi() {
    if (window.SpotifyIframeApi) {
      return Promise.resolve(window.SpotifyIframeApi);
    }
    if (this.apiPromise) {
      return this.apiPromise;
    }
    this.apiPromise = new Promise((resolve) => {
      const prevHandler = window.onSpotifyIframeApiReady;
      window.onSpotifyIframeApiReady = (IFrameAPI) => {
        console.log('[BHAIJAAN] Spotify API ready');
        if (typeof prevHandler === 'function') prevHandler(IFrameAPI);
        window.SpotifyIframeApi = IFrameAPI;
        resolve(IFrameAPI);
      };

      if (!document.querySelector('script[src="https://open.spotify.com/embed/iframe-api/v1"]')) {
        const script = document.createElement('script');
        script.src = 'https://open.spotify.com/embed/iframe-api/v1';
        script.async = true;
        script.onerror = (err) => {
          console.error('[BHAIJAAN] Spotify API script load failed', err);
          this.apiPromise = null;
        };
        document.head.appendChild(script);
      }
    });
    return this.apiPromise;
  }

  setController(controller) {
    this.controller = controller;
    console.log('[BHAIJAAN] SPOTIFY CONTROLLER: Ready and persistent');
    this.notifyListeners('ready', { controller });

    if (this.currentUri) {
      try {
        if (typeof this.controller.loadUri === 'function') {
          const res = this.controller.loadUri(this.currentUri);
          if (res && typeof res.catch === 'function') res.catch(() => {});
        }
      } catch (e) {}
    }
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

  play() {
    console.log('[BHAIJAAN] PLAYBACK REQUESTED');
    try {
      const res = this.controller?.play();
      if (res && typeof res.catch === 'function') res.catch(() => {});
    } catch (e) {
      console.warn('[BHAIJAAN] Play notice:', e);
    }
  }

  pause() {
    console.log('[BHAIJAAN] PAUSE REQUESTED');
    try {
      const res = this.controller?.pause();
      if (res && typeof res.catch === 'function') res.catch(() => {});
    } catch (e) {
      console.warn('[BHAIJAAN] Pause notice:', e);
    }
  }

  togglePlay() {
    console.log('[BHAIJAAN] TOGGLE PLAY CLICK');
    try {
      const res = this.controller?.togglePlay();
      if (res && typeof res.catch === 'function') res.catch(() => {});
    } catch (e) {
      console.warn('[BHAIJAAN] Toggle play notice:', e);
    }
  }

  seek(seconds) {
    console.log('[BHAIJAAN] SEEK REQUESTED:', seconds);
    try {
      if (this.controller && typeof this.controller.seek === 'function') {
        const res = this.controller.seek(Math.round(seconds));
        if (res && typeof res.catch === 'function') {
          res.catch((err) => {
            console.warn('[BHAIJAAN] Spotify seek notice (content does not allow seek):', err?.message || err);
          });
        }
      }
    } catch (e) {
      console.warn('[BHAIJAAN] Seek notice:', e);
    }
  }

  next() {
    console.log('[BHAIJAAN] NEXT CLICK');
    console.log('[BHAIJAAN] Spotify NEXT REQUEST');
    try {
      if (this.controller && typeof this.controller.next === 'function') {
        const res = this.controller.next();
        if (res && typeof res.catch === 'function') res.catch(() => {});
      }
    } catch (e) {
      console.error('[BHAIJAAN] Next command notice:', e);
    }
  }

  previous() {
    console.log('[BHAIJAAN] PREVIOUS CLICK');
    console.log('[BHAIJAAN] Spotify PREVIOUS REQUEST');
    try {
      if (this.controller && typeof this.controller.previous === 'function') {
        const res = this.controller.previous();
        if (res && typeof res.catch === 'function') res.catch(() => {});
      }
    } catch (e) {
      console.error('[BHAIJAAN] Previous command notice:', e);
    }
  }

  loadEntity(urlOrUri, autoPlay = true) {
    const uri = getSpotifyUri(urlOrUri);
    this.currentUri = uri;
    console.log('[BHAIJAAN] LOADING SPOTIFY ENTITY:', uri);

    if (!this.controller) {
      console.warn('[BHAIJAAN] SPOTIFY CONTROLLER: Not ready yet');
      return;
    }

    try {
      let res = null;
      if (typeof this.controller.loadUri === 'function') {
        res = this.controller.loadUri(uri);
      } else if (typeof this.controller.loadEntity === 'function') {
        res = this.controller.loadEntity(uri);
      }

      if (res && typeof res.catch === 'function') {
        res.catch(() => {});
      }

      if (autoPlay) {
        this.play();
      }
    } catch (e) {
      console.warn('[BHAIJAAN] loadEntity notice:', e);
    }
  }

  openSpotify(url) {
    if (url) {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  }
}

export const spotifyController = new SpotifyControllerManager();
