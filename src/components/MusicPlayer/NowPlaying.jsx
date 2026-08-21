import React from 'react';

export function NowPlaying({ track, isPlaying, spotifyUrl }) {
  if (!track) return null;

  return (
    <div className="compact-now-playing">
      <div className="status-indicator">
        <span className={`status-dot ${isPlaying ? 'is-active' : ''}`} />
        <span>{isPlaying ? 'PLAYING' : 'PAUSED'}</span>
      </div>

      <h2 className="compact-track-title">{track.title}</h2>

      <div className="compact-track-sub">
        <span>{track.film}</span>
        <span className="sep">·</span>
        <span>{track.year}</span>
      </div>

      <a
        href={spotifyUrl || 'https://open.spotify.com'}
        target="_blank"
        rel="noopener noreferrer"
        className="tiny-spotify-link"
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        LISTEN ON SPOTIFY →
      </a>
    </div>
  );
}

export default NowPlaying;
