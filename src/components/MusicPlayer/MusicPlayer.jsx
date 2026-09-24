/**
 * @file MusicPlayer.jsx
 * @description The core UI wrapper for the music player elements. 
 * Orchestrates the display of NowPlaying text, the Progress Bar, and the Controls.
 */

import React from 'react';
import NowPlaying from './NowPlaying';
import ProgressBar from './ProgressBar';
import PlayerControls from './PlayerControls';

/**
 * Renders the music player interface.
 * 
 * @param {Object} props
 * @param {Object} props.playlist - The currently active playlist object.
 * @param {Object} props.track - The currently active track object.
 * @param {boolean} props.isPlaying - Global playback state.
 * @param {boolean} props.isLoading - Global loading state.
 * @param {Object} props.playbackProgress - Current progress object `{ current, duration }`.
 * @param {boolean} props.isRewinding - Whether the rewind visual effect is active.
 * @param {Function} props.onToggle - Handler to toggle play/pause.
 * @param {Function} props.onNext - Handler to skip to the next track.
 * @param {Function} props.onPrevious - Handler to go back to the previous track.
 * @param {Function} props.onSeek - Handler for scrubbing the progress bar.
 */
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
