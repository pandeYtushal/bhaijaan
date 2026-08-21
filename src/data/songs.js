import songsData from './songs-with-spotify.json';

export const SONGS = songsData;

export function findSongById(id) {
  return SONGS.find((s) => s.id === id);
}

export default SONGS;
