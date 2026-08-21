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
          this.controller.loadUri(this.currentUri);
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
      this.controller?.play();
    } catch (e) {
      console.warn('[BHAIJAAN] Play failed', e);
    }
  }

  pause() {
    try {
      this.controller?.pause();
    } catch (e) {
      console.warn('[BHAIJAAN] Pause failed', e);
    }
  }

  togglePlay() {
    console.log('[BHAIJAAN] TOGGLE PLAYBACK REQUESTED');
    try {
      this.controller?.togglePlay();
    } catch (e) {
      console.warn('[BHAIJAAN] Toggle play failed', e);
    }
  }

  seek(seconds) {
    try {
      if (this.controller && typeof this.controller.seek === 'function') {
        this.controller.seek(Math.round(seconds));
      }
    } catch (e) {
      console.warn('[BHAIJAAN] Seek failed', e);
    }
  }

  next() {
    try {
      if (this.controller && typeof this.controller.next === 'function') {
        this.controller.next();
      }
    } catch (e) {}
  }

  previous() {
    try {
      if (this.controller && typeof this.controller.previous === 'function') {
        this.controller.previous();
      }
    } catch (e) {}
  }

  loadEntity(urlOrUri) {
    const uri = getSpotifyUri(urlOrUri);
    this.currentUri = uri;
    console.log('[BHAIJAAN] LOADING ENTITY:', uri);

    if (!this.controller) {
      console.warn('[BHAIJAAN] SPOTIFY CONTROLLER: Not ready yet');
      return;
    }

    try {
      if (typeof this.controller.loadUri === 'function') {
        this.controller.loadUri(uri);
      } else if (typeof this.controller.loadEntity === 'function') {
        this.controller.loadEntity(uri);
      }
    } catch (e) {
      console.warn('[BHAIJAAN] loadEntity failed:', e);
    }
  }

  openSpotify(url) {
    if (url) {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  }
}

export const spotifyController = new SpotifyControllerManager();
