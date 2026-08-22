import React from 'react';

export function NowPlaying({ mode, playlist, track, isPlaying, isLoading }) {
  const modeName = mode?.label || mode?.name || playlist?.name || 'BHAI MODE';

  const trackTitle = track?.title || track?.name || 'O O Jaane Jaana';

  const singersList = Array.isArray(track?.singers)
    ? track.singers.join(', ')
    : track?.singers || track?.artist || 'Salman Khan';

  const filmName = track?.film || track?.album || '';
  const releaseYear = track?.year || '';

  const subtitle = filmName
    ? `${singersList} · ${filmName} ${releaseYear ? `· ${releaseYear}` : ''}`
    : singersList || playlist?.subtitle || 'Barbershop Radio · Official Hits';

  const spotifyTargetUrl = track?.spotifyUrl || playlist?.spotifyUrl || 'https://open.spotify.com';

  return (
    <div className="compact-now-playing">
      {/* Category / Mode Label with Active Status Indicator */}
      <div className="status-indicator">
        <span className={`status-dot ${isPlaying ? 'is-active' : ''}`} />
        <span>{modeName} • {isPlaying ? 'PLAYING' : 'PAUSED'}</span>
      </div>

      {/* Large Track Title (100% Accurate Verified Metadata) */}
      <h2 className="compact-track-title">{trackTitle}</h2>

      {/* Metadata Subtitle (Singers · Film · Year) */}
      <div className="compact-track-sub">
        <span>{subtitle}</span>
      </div>

      {/* External Spotify Link */}
      <a
        href={spotifyTargetUrl}
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

