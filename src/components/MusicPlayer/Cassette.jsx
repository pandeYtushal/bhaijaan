import React from 'react';

export function Cassette({ isPlaying, trackTitle }) {
  return (
    <div className="compact-cassette">
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
          </div>
          <div className="tape-line" />
          <div className={`spool-hub right-hub ${isPlaying ? 'spinning' : ''}`}>
            <div className="hub-center" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Cassette;
