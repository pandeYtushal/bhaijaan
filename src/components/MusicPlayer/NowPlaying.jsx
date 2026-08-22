import React, { useEffect, useState } from 'react';

export function NowPlaying({ mode, playlist, track, isPlaying, isLoading }) {
  const [animating, setAnimating] = useState(false);
  const [displayTrack, setDisplayTrack] = useState(track);

  // Smooth text crossfade on track change
  useEffect(() => {
    if (track && track.id !== displayTrack?.id) {
      setAnimating(true);
      const timer = setTimeout(() => {
        setDisplayTrack(track);
        setAnimating(false);
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [track, displayTrack]);

  const activeTrack = displayTrack || track;
  const modeName = mode?.label || mode?.name || playlist?.name || 'BHAI MODE';
  const trackTitle = activeTrack?.title || activeTrack?.name || 'O O Jaane Jaana';

  const singersList = Array.isArray(activeTrack?.singers)
    ? activeTrack.singers.join(', ')
    : activeTrack?.singers || activeTrack?.artist || '';

  const filmName = activeTrack?.film || activeTrack?.album || '';
  const releaseYear = activeTrack?.year || '';

  const subtitle = [singersList, filmName, releaseYear].filter(Boolean).join(' · ');

  return (
    <div className={`compact-now-playing ${animating ? 'track-changing' : ''}`}>
      {/* Quiet mode label */}
      <div className="status-indicator">
        <span className="mode-tag">{modeName}</span>
        <span className={`status-dot ${isPlaying ? 'is-active' : ''}`} />
      </div>

      {/* The song — in Yatra One, like a memory */}
      <h2 className="compact-track-title">{trackTitle}</h2>

      {/* Who sang it, where it's from */}
      {subtitle && (
        <div className="compact-track-sub">
          <span>{subtitle}</span>
        </div>
      )}
    </div>
  );
}

export default NowPlaying;
