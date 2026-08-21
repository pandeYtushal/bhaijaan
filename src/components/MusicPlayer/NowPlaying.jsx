import React from 'react';
import { resolveTrack } from '../../spotify/trackResolver';

export function NowPlaying({ track, isPlaying, isLoading, spotifyUrl }) {
  if (!track) return null;

  const resolution = resolveTrack(track);
  const isAvailable = resolution.matched;
  const targetUrl = spotifyUrl || resolution.spotifyUrl;

  return (
    <div className="compact-now-playing">
      <div className="status-indicator">
        <span className={`status-dot ${isPlaying ? 'is-active' : ''}`} />
        <span>
          {isLoading
            ? 'LOADING TAPE...'
            : isAvailable
            ? isPlaying
              ? 'PLAYING'
              : 'PAUSED'
            : 'NOT AVAILABLE ON SPOTIFY'}
        </span>
      </div>

      <h2 className="compact-track-title">{track.title}</h2>

      <div className="compact-track-sub">
        <span>{track.film}</span>
        <span className="sep">·</span>
        <span>{track.year}</span>
      </div>

      {isAvailable ? (
        <a
          href={targetUrl || 'https://open.spotify.com'}
          target="_blank"
          rel="noopener noreferrer"
          className="tiny-spotify-link"
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          LISTEN ON SPOTIFY →
        </a>
      ) : (
        <a
          href={`https://open.spotify.com/search/${encodeURIComponent(`${track.title} ${track.film}`)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="tiny-spotify-link unavailable-link"
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          SEARCH ON SPOTIFY →
        </a>
      )}
    </div>
  );
}

export default NowPlaying;
