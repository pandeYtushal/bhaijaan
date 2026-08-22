import React, { useState, useEffect } from 'react';

function formatTime(seconds) {
  if (!Number.isFinite(seconds) || seconds < 0) return '00:00';
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

export function ProgressBar({ current = 0, duration = 0, onSeek }) {
  const [isDragging, setIsDragging] = useState(false);
  const [dragValue, setDragValue] = useState(current);

  useEffect(() => {
    if (!isDragging) {
      setDragValue(current);
    }
  }, [current, isDragging]);

  const activeVal = isDragging ? dragValue : current;
  const pct = duration > 0 ? Math.min(100, Math.max(0, (activeVal / duration) * 100)) : 0;

  const handleSliderChange = (e) => {
    setDragValue(Number(e.target.value));
  };

  const handleMouseDown = () => {
    setIsDragging(true);
  };

  const handleMouseUp = (e) => {
    setIsDragging(false);
    const val = Number(e.target.value);
    onSeek?.(val);
  };

  const handleClickBar = (e) => {
    if (!duration || !onSeek) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const ratio = Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width));
    onSeek(ratio * duration);
  };

  return (
    <div className="tiny-tape-timeline" onClick={handleClickBar} style={{ position: 'relative', cursor: 'pointer' }}>
      <span className="tiny-time">{formatTime(activeVal)}</span>

      <div className="tiny-line" style={{ position: 'relative', flex: 1, height: '6px' }}>
        <div className="tiny-fill" style={{ width: `${pct}%`, height: '100%', pointerEvents: 'none' }} />
        <div className="tiny-dot" style={{ left: `${pct}%`, pointerEvents: 'none' }} />

        <input
          type="range"
          min={0}
          max={duration || 300}
          step={1}
          value={activeVal}
          onChange={handleSliderChange}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onTouchStart={handleMouseDown}
          onTouchEnd={handleMouseUp}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            opacity: 0,
            cursor: 'pointer',
            margin: 0,
            zIndex: 10
          }}
          aria-label="Track timeline progress slider"
        />
      </div>

      <span className="tiny-time">
        {duration > 0 ? formatTime(duration) : '00:00'}
      </span>
    </div>
  );
}

export default ProgressBar;
