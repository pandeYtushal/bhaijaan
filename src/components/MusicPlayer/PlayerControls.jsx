import React from 'react';

export function PlayerControls({ isPlaying, onToggle, onNext, onPrevious }) {
  return (
    <div className="minimal-controls">
      <button
        type="button"
        className="ctrl-btn"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onPrevious?.();
        }}
        aria-label="Previous"
      >
        ←
      </button>

      <button
        type="button"
        className="ctrl-btn play-btn"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onToggle?.();
        }}
        aria-label={isPlaying ? 'Pause' : 'Play'}
      >
        {isPlaying ? 'Ⅱ' : '▶'}
      </button>

      <button
        type="button"
        className="ctrl-btn"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onNext?.();
        }}
        aria-label="Next"
      >
        →
      </button>
    </div>
  );
}

export default PlayerControls;
