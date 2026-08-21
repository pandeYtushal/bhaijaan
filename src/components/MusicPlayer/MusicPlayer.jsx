import React from 'react';
import Cassette from './Cassette';
import NowPlaying from './NowPlaying';
import ProgressBar from './ProgressBar';
import PlayerControls from './PlayerControls';

export function MusicPlayer({
  mode,
  playlist,
  track,
  isPlaying,
  isLoading,
  playbackProgress,
  isRewinding,
  onToggle,
  onNext,
  onPrevious,
  onSeek,
}) {
  if (!playlist) return null;

  const cassetteTitle = track?.title || playlist?.name || 'BHAIJAAN';

  return (
    <div className={`environment-cassette-player ${isRewinding ? 'is-rewinding' : ''}`}>
      <div className="player-cassette-row">
        {/* Physical Cassette Object */}
        <Cassette isPlaying={isPlaying} trackTitle={cassetteTitle} />

        {/* Compact Metadata Column */}
        <NowPlaying
          mode={mode}
          playlist={playlist}
          track={track}
          isPlaying={isPlaying}
          isLoading={isLoading}
        />
      </div>

      {/* Tiny Analog Tape Counter Line */}
      <ProgressBar
        current={playbackProgress.current}
        duration={playbackProgress.duration}
        onSeek={onSeek}
      />

      {/* Minimal 3-Button Controls */}
      <PlayerControls
        isPlaying={isPlaying}
        onToggle={onToggle}
        onNext={onNext}
        onPrevious={onPrevious}
      />
    </div>
  );
}

export default MusicPlayer;
