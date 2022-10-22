// Audio / react-native-track-player related file
import TrackPlayer from "react-native-track-player";
import fs from "react-native-fs";

import {
  getDirectoriesFromSavedPlaylists,
  getSongs
} from "./Functions.js";

var queue = [];
var previous = [];

export async function playSong (path, mode, previousCall) {
  // If this isnt a previous call, we may cache the current song
  if (!previousCall) {
    const queue = await TrackPlayer.getQueue();
    const currentSongIndex = await TrackPlayer.getCurrentTrack();
    if (queue.length > 0)
      if (queue[currentSongIndex].id != "Previous")
        previous.push(queue[currentSongIndex].url.substr(8, queue[currentSongIndex].url.length));
  }

  // Getting name of the song
  for (var i = (path.length - 1); i >= 0; i--) {
    if (path[i] == '/') {
      songName = path.substr(i + 1);
      songName = songName.substr(0, songName.length - 4);
      break;
    }
  }

  await TrackPlayer.add({
    id: mode,
    url: "file:///" + path,
    title: songName,
    artist: "",
    album: "",
    artwork: require("./img/DefaultAlbumCover.png")
  });

  // Removing tracks in TrackPlayer
  const queue = await TrackPlayer.getQueue();
  if (queue.length > 1) {
    await TrackPlayer.skipToNext();
    await TrackPlayer.remove(0);
  }

  await TrackPlayer.play();
}

export async function getCurrentSong () {
  const queue = await TrackPlayer.getQueue();
  const currentSong = await TrackPlayer.getCurrentTrack();

  if (queue.length > 0)
    return queue[currentSong].url.substr(8, queue[currentSong].url.length);
  else
    return null;
}

export function previousSong () {
  if (previous.length > 0) {
    const result = previous[previous.length - 1];
    previous.pop();
    return result;
  } else return null;
}

export async function nextSong () {
  // If there is something queued, we play it
  if (queue.length > 0) {
    const result = queue[queue.length - 1];
    queue.pop();
    return result;
  }

  // (L)ast (D)irect (M)ode (S)ong
  // This needs to be found to decide a next song
  var LDMS = null;

  const trackPlayerQueue = await TrackPlayer.getQueue();
  const currentSong = await TrackPlayer.getCurrentTrack();
  if (trackPlayerQueue.length > 0)
    if (trackPlayerQueue[currentSong].mode != "Previous")
      LDMS = trackPlayerQueue[currentSong].url.substr(8, trackPlayerQueue[currentSong].url.length);

  // If the current track is "Previous" mode, we look in previous array
  if (previous.length > 0) {
    LDMS = previous[previous.length - 1];
    previous.pop();
  }

  // Only logic point where we cannot find a next song
  if (LDMS == null) return;

  // Getting what playlist it is from
  const directories = await getDirectoriesFromSavedPlaylists();
  let playlistDirectory = null;
  for (var i = 0; i < directories.length; i++)
    if (directories[i].length < LDMS.length)
      if (directories[i] == LDMS.substr(0, directories[i].length))
        playlistDirectory = directories[i];

  // Getting all the songs in the playlist
  let songs = await getSongs(playlistDirectory);
  songs = songs.filter((song) => { return !song.invalid; });

  // Getting shuffle value
  const shuffle = fs.DocumentDirectoryPath + "/.shuffle";
  const shuffleValue = await fs.readFile(shuffle)
  .then((contents) => { return contents; })
  .catch((error) => { console.log(error); });

  // Deciding next song (finally)
  let currentSongIndex = null;
  for (var i = 0; i < songs.length; i++) {
    if (songs[i].directory == LDMS) {
      currentSongIndex = i;
      break;
    }
  }
  if (shuffleValue == "0") {
    // Last song in the playlist, play the first
    if (currentSongIndex == (songs.length - 1))
      return songs[0].directory;
    else
      return songs[currentSongIndex + 1].directory;
  } else {
    let randomSongIndex = Math.floor(Math.random() * songs.length);
    while (true) {
      if (randomSongIndex != currentSongIndex) break;
      randomSongIndex = Math.floor(Math.random() * songs.length);
    }
    return songs[randomSongIndex].directory;
  }
}

export function queueSong (path) { queue.push(path); }
export function addToPrevious (path) { previous.push(path); }
