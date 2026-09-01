import React from 'react';
import NowPlaying from './NowPlaying';
import ProgressBar from './ProgressBar';
import PlayerControls from './PlayerControls';

export function MusicPlayer({
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

  return (
    <div className={`environment-cassette-player ${isRewinding ? 'is-rewinding' : ''}`}>
      {/* Song info — just text floating */}
      <NowPlaying
        playlist={playlist}
        track={track}
        isPlaying={isPlaying}
        isLoading={isLoading}
      />

      {/* A single quiet line */}
      <ProgressBar
        current={playbackProgress.current}
        duration={playbackProgress.duration}
        onSeek={onSeek}
      />

      {/* Breath-like controls */}
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
