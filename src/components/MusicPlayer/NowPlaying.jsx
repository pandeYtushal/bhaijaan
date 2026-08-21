import React from 'react';

export function NowPlaying({ mode, playlist, track, isPlaying, isLoading }) {
  const modeName = mode?.label || mode?.name || playlist?.name || 'BHAI MODE';

  const displayTrack = track || playlist?.initialTrack;

  const trackTitle = isLoading
    ? 'LOADING TAPE...'
    : displayTrack?.title || '';

  const subtitle = displayTrack?.film
    ? `${displayTrack.singers ? displayTrack.singers.join(', ') : displayTrack.artist || 'Salman Khan'} · ${displayTrack.film} ${displayTrack.year ? `· ${displayTrack.year}` : ''}`
    : playlist?.subtitle || 'Spotify · Official Playlist';

  return (
    <div className="compact-now-playing">
      {/* Category / Mode Label with Active Status Indicator */}
      <div className="status-indicator">
        <span className={`status-dot ${isPlaying ? 'is-active' : ''}`} />
        <span>{modeName} • {isPlaying ? 'PLAYING' : 'PAUSED'}</span>
      </div>

      {/* Large Actual Track Title (NEVER mode name or "SELECT A TRACK") */}
      <h2 className="compact-track-title">{trackTitle}</h2>

      {/* Metadata Subtitle (Artist · Film · Year) */}
      <div className="compact-track-sub">
        <span>{subtitle}</span>
      </div>

      {/* External Spotify Link */}
      <a
        href={playlist?.spotifyUrl || 'https://open.spotify.com'}
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
