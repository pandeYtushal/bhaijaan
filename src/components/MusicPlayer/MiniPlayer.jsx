import React from 'react';

export function MiniPlayer({ track, isPlaying, onToggle, onExpand }) {
  if (!track) return null;

  return (
    <div className="mini-player-strip" onClick={onExpand}>
      <div className="mini-info">
        <span className="mini-note">NOW</span>
        <strong className="mini-title">{track.title}</strong>
        <span className="mini-dash">-</span>
        <span className="mini-year">{track.year}</span>
      </div>

      <button
        type="button"
        className="mini-play-btn"
        onClick={(e) => {
          e.stopPropagation();
          onToggle();
        }}
        aria-label={isPlaying ? 'Pause' : 'Play'}
      >
        {isPlaying ? 'PAUSE' : 'PLAY'}
      </button>
    </div>
  );
}

export default MiniPlayer;
