import React, { useEffect, useState } from 'react';

export function NowPlaying({ playlist, track, isPlaying, isLoading }) {
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
  const trackTitle = activeTrack?.title || 'O O Jaane Jaana';

  const singersList = Array.isArray(activeTrack?.singers)
    ? activeTrack.singers.join(', ')
    : activeTrack?.singers || activeTrack?.artist || '';

  const filmName = activeTrack?.film || activeTrack?.album || '';
  const releaseYear = activeTrack?.year || '';

  const subtitle = [singersList, filmName, releaseYear].filter(Boolean).join(' · ');

  return (
    <div className={`compact-now-playing ${animating ? 'track-changing' : ''}`}>
      {/* Live indicator */}
      <div className="status-indicator">
        <span className={`status-dot ${isPlaying ? 'is-active' : ''}`} />
      </div>

      {/* Song title */}
      <h2 className="compact-track-title">{trackTitle}</h2>

      {/* Singers · Film · Year */}
      {subtitle && (
        <div className="compact-track-sub">
          <span>{subtitle}</span>
        </div>
      )}
    </div>
  );
}

export default NowPlaying;
