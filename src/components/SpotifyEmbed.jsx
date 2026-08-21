import { useEffect, useRef, useImperativeHandle, forwardRef } from 'react';
import { spotifyController, getSpotifyUri } from '../utils/spotifyController';

let spotifyApiPromise = null;

function loadSpotifyIframeApi() {
  if (window.SpotifyIframeApi) {
    return Promise.resolve(window.SpotifyIframeApi);
  }
  if (spotifyApiPromise) {
    return spotifyApiPromise;
  }
  spotifyApiPromise = new Promise((resolve) => {
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
        console.error('[BHAIJAAN] Failed to load Spotify iFrame API script', err);
        spotifyApiPromise = null;
      };
      document.head.appendChild(script);
    }
  });
  return spotifyApiPromise;
}

export const SpotifyEmbed = forwardRef(function SpotifyEmbed({ initialPlaylistUrl, onPlaybackChange }, ref) {
  const containerRef = useRef(null);
  const controllerRef = useRef(null);
  const playbackChangeRef = useRef(onPlaybackChange);

  playbackChangeRef.current = onPlaybackChange;

  useImperativeHandle(ref, () => ({
    play: () => spotifyController.play(),
    pause: () => spotifyController.pause(),
    togglePlay: () => spotifyController.togglePlay(),
    loadPlaylist: (url) => spotifyController.loadEntity(url),
    seek: (seconds) => spotifyController.seek(seconds)
  }));

  // Create Spotify Controller ONCE on mount
  useEffect(() => {
    let isCancelled = false;
    const initialUri = getSpotifyUri(initialPlaylistUrl);

    loadSpotifyIframeApi()
      .then((IFrameAPI) => {
        if (isCancelled || !containerRef.current || controllerRef.current) return;
        
        const element = document.createElement('div');
        element.id = 'spotify-embed-root';
        element.setAttribute('allow', 'autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture');
        containerRef.current.replaceChildren(element);

        const options = {
          uri: initialUri,
          width: '100%',
          height: '380'
        };

        const callback = (EmbedController) => {
          if (isCancelled) return;
          controllerRef.current = EmbedController;
          spotifyController.setController(EmbedController);

          const iframe = containerRef.current?.querySelector('iframe');
          if (iframe) {
            iframe.setAttribute('allow', 'autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture');
          }

          EmbedController.addListener('ready', () => {
            console.log('[BHAIJAAN] SPOTIFY CONTROLLER: Ready event');
          });

          EmbedController.addListener('playback_update', (e) => {
            console.log('[BHAIJAAN] PLAYBACK UPDATE FROM SPOTIFY:', e.data);
            
            const rawTrack = e.data?.track;
            const playingUri = e.data?.playingURI || rawTrack?.uri;

            let extractedTrack = null;
            if (rawTrack) {
              const artistName = typeof rawTrack.artist === 'string'
                ? rawTrack.artist
                : rawTrack.artist?.name || rawTrack.artists?.[0]?.name || 'Salman Khan';
              
              const albumTitle = typeof rawTrack.album === 'string'
                ? rawTrack.album
                : rawTrack.album?.name || '';

              extractedTrack = {
                title: rawTrack.name || rawTrack.title || 'Spotify Track',
                film: albumTitle || 'Salman Khan Hits',
                singers: artistName ? [artistName] : ['Salman Khan'],
                spotifyUri: playingUri
              };
            }

            playbackChangeRef.current?.({
              isPaused: e.data?.isPaused,
              position: e.data?.position,
              duration: e.data?.duration,
              playingUri: playingUri,
              trackInfo: extractedTrack
            });
          });

          EmbedController.addListener('playback_started', (e) => {
            console.log('[BHAIJAAN] PLAYBACK STARTED:', e);
          });

          // Distinct Spotify Embed Error Listener
          EmbedController.addListener('error', (err) => {
            console.error('[BHAIJAAN] Spotify Embed Error:', err);
            playbackChangeRef.current?.({
              error: err?.message || 'Spotify embed error'
            });
          });
        };

        IFrameAPI.createController(element, options, callback);
      })
      .catch((err) => {
        console.error('[BHAIJAAN] Spotify controller initialization failed:', err);
      });

    return () => {
      isCancelled = true;
    };
  }, []); // Run ONLY once on mount

  return (
    <div
      ref={containerRef}
      className="spotify-embed-container w-full"
      style={{ minHeight: '380px' }}
    />
  );
});

export default SpotifyEmbed;
