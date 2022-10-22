import TrackPlayer, { Event } from "react-native-track-player";
import { nextSong, previousSong, playSong } from "./Player.js";

export async function PlaybackService () {
  // Acts as a previous button
  TrackPlayer.addEventListener(Event.RemoteJumpBackward, () => {
    const song = previousSong();
    if (song != null) playSong(song, "Previous", true);
  });

  TrackPlayer.addEventListener(Event.RemotePause, () => {
    TrackPlayer.pause();
  });

  TrackPlayer.addEventListener(Event.RemotePlay, () => {
    TrackPlayer.play();
  });

  // Acts as a next button
  TrackPlayer.addEventListener(Event.RemoteJumpForward, async () => {
    const song = await nextSong();
    if (song != null) playSong(song, "Direct", false);
  });
}
