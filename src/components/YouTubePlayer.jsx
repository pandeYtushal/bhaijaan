/**
 * @file YouTubePlayer.jsx
 * @description Hidden iframe component that loads the YouTube IFrame API.
 * Mounts an invisible player bound to `audioEngine` to stream high-quality audio
 * directly from YouTube without displaying the video.
 */

import { useEffect, useRef } from 'react';
import { audioEngine } from '../utils/audioEngine';

let ytPromise = null;

/**
 * Dynamically loads the YouTube IFrame API script and resolves when ready.
 * Employs a singleton pattern to ensure the script is only loaded once.
 * 
 * @returns {Promise<Object>} A promise that resolves with the window.YT object.
 */
function loadYouTubeIframeApi() {
  if (window.YT && window.YT.Player) {
    return Promise.resolve(window.YT);
  }
  if (ytPromise) return ytPromise;

  ytPromise = new Promise((resolve, reject) => {
    const prev = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      if (typeof prev === 'function') prev();
      resolve(window.YT);
    };

    if (!document.querySelector('script[src="https://www.youtube.com/iframe_api"]')) {
      const script = document.createElement('script');
      script.src = 'https://www.youtube.com/iframe_api';
      script.async = true;
      script.onerror = (err) => {
        console.error('[YouTubePlayer] Failed to load YouTube iframe API script', err);
        ytPromise = null;
        reject(err);
      };
      document.head.appendChild(script);
    }
  });

  return ytPromise;
}

export function YouTubePlayer() {
  const playerRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    let isCancelled = false;

    loadYouTubeIframeApi()
      .then((YT) => {
        if (isCancelled || !containerRef.current || playerRef.current) return;

        const element = document.createElement('div');
        element.id = 'yt-player-root';
        containerRef.current.replaceChildren(element);

        playerRef.current = new YT.Player(element, {
          height: '1',
          width: '1',
          videoId: 'x_elT6zkqN0',
          playerVars: {
            autoplay: 0,
            controls: 0,
            disablekb: 1,
            fs: 0,
            modestbranding: 1,
            playsinline: 1,
            rel: 0
          },
          events: {
            onReady: (event) => {
              console.log('[YouTubePlayer] YT API Ready');
              audioEngine.setYouTubePlayer(event.target);
            },
            onStateChange: (event) => {
              // YT.PlayerState: UNSTARTED (-1), ENDED (0), PLAYING (1), PAUSED (2), BUFFERING (3)
              if (event.data === YT.PlayerState.ENDED) {
                console.log('[YouTubePlayer] Song ended naturally, playing next');
                audioEngine.next();
              } else if (event.data === YT.PlayerState.PLAYING) {
                audioEngine.onYTPlaybackStateChange(true);
              } else if (event.data === YT.PlayerState.PAUSED) {
                audioEngine.onYTPlaybackStateChange(false);
              }
            },
            onError: (event) => {
              console.warn('[YouTubePlayer] Error occurred:', event.data, 'skipping to next track...');
              audioEngine.next();
            }
          }
        });
      })
      .catch((err) => {
        console.warn('[YouTubePlayer] Failed to initialize YouTube player, using HTML5 Audio fallback', err);
      });

    return () => {
      isCancelled = true;
    };
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        position: 'fixed',
        top: '-9999px',
        left: '-9999px',
        width: '1px',
        height: '1px',
        opacity: 0.0001,
        pointerEvents: 'none',
        zIndex: -9999,
        overflow: 'hidden'
      }}
    />
  );
}

export default YouTubePlayer;
