import React from 'react';

function formatTime(seconds) {
  if (!Number.isFinite(seconds) || seconds < 0) return '00:00';
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

export function ProgressBar({ current = 0, duration = 0, onSeek }) {
  const pct = duration > 0 ? Math.min(100, (current / duration) * 100) : 0;

  const handleClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!duration || !onSeek) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const ratio = Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width));
    onSeek(ratio * duration);
  };

  return (
    <div className="tiny-tape-timeline" onClick={handleClick}>
      <span className="tiny-time">{formatTime(current)}</span>
      <div className="tiny-line">
        <div className="tiny-fill" style={{ width: `${pct}%` }} />
        <div className="tiny-dot" style={{ left: `${pct}%` }} />
      </div>
      <span className="tiny-time">
        {duration > 0 ? formatTime(duration) : '00:00'}
      </span>
    </div>
  );
}

export default ProgressBar;
