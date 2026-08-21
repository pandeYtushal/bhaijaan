import React from 'react';
import Cassette from './Cassette';
import NowPlaying from './NowPlaying';
import ProgressBar from './ProgressBar';
import PlayerControls from './PlayerControls';

export function MusicPlayer({
  track,
  playlist,
  isPlaying,
  isLoading,
  playbackProgress,
  isRewinding,
  onToggle,
  onNext,
  onPrevious,
  onSeek,
}) {
  if (!track) return null;

  return (
    <div className={`environment-cassette-player ${isRewinding ? 'is-rewinding' : ''}`}>
      <div className="player-cassette-row">
        {/* Physical Cassette Object */}
        <Cassette isPlaying={isPlaying} trackTitle={track.title} />

        {/* Compact Metadata Column */}
        <NowPlaying
          track={track}
          isPlaying={isPlaying}
          isLoading={isLoading}
          spotifyUrl={playlist?.spotifyUrl}
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
