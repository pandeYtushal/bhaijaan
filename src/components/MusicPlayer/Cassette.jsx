import React from 'react';

export function Cassette({ isPlaying, trackTitle, playbackProgress }) {
  const { current, duration } = playbackProgress || { current: 0, duration: 100 };
  const progress = duration > 0 ? Math.min(1, Math.max(0, current / duration)) : 0;
  
  // Left spool tape thickness (decreases)
  const leftTapeThickness = 12 + (30 * (1 - progress));
  // Right spool tape thickness (increases)
  const rightTapeThickness = 12 + (30 * progress);

  return (
    <div className="compact-cassette" style={{ display: 'block' }}>
      <div className="cassette-shell">
        {/* Corner Pins */}
        <div className="pin top-left" />
        <div className="pin top-right" />
        <div className="pin bottom-left" />
        <div className="pin bottom-right" />

        {/* Vintage Paper Sticker */}
        <div className="paper-sticker">
          <div className="sticker-brand">
            <span>BHAIJAAN</span>
            <span className="side-mark">SIDE A</span>
          </div>
          <div className="sticker-song-title">
            {trackTitle || 'RETRO TAPE'}
          </div>
        </div>

        {/* Tape Reels Window */}
        <div className="cassette-window">
          <div className={`spool-hub left-hub ${isPlaying ? 'spinning' : ''}`}>
            <div className="hub-center" />
            <div className="tape-roll" style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: `${leftTapeThickness}px`,
              height: `${leftTapeThickness}px`,
              borderRadius: '50%',
              backgroundColor: '#1a1a1a',
              zIndex: -1,
              transition: 'width 1s linear, height 1s linear'
            }} />
          </div>
          <div className="tape-line" />
          <div className={`spool-hub right-hub ${isPlaying ? 'spinning' : ''}`}>
            <div className="hub-center" />
            <div className="tape-roll" style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: `${rightTapeThickness}px`,
              height: `${rightTapeThickness}px`,
              borderRadius: '50%',
              backgroundColor: '#1a1a1a',
              zIndex: -1,
              transition: 'width 1s linear, height 1s linear'
            }} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Cassette;
