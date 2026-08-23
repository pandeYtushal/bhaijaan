import React from 'react';
import { Play, Pause, SkipBack, SkipForward } from 'lucide-react';

export function PlayerControls({ isPlaying, onToggle, onNext, onPrevious }) {
  return (
    <div className="minimal-controls">
      <button
        type="button"
        className="ctrl-btn prev-btn"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onPrevious?.();
        }}
        aria-label="Previous Track"
      >
        <SkipBack size={18} />
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
        {isPlaying ? <Pause size={20} /> : <Play size={20} style={{ marginLeft: '2px' }} />}
      </button>

      <button
        type="button"
        className="ctrl-btn next-btn"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onNext?.();
        }}
        aria-label="Next Track"
      >
        <SkipForward size={18} />
      </button>
    </div>
  );
}

export default PlayerControls;
