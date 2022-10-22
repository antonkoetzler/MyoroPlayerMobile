import React from "react";
import type { Node } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import fs from "react-native-fs";
import TrackPlayer, { Capability, useTrackPlayerEvents, Event } from "react-native-track-player";

import Main from "./screens/Main.js";
import Playlists from "./screens/Playlists.js";
import SongControl from "./screens/SongControl.js";

import { requestAllPermissions } from "./Functions.js";
import { nextSong, playSong } from "./Player.js";

const Stack = createNativeStackNavigator();

const App: () => Node = () => {
  React.useEffect(() => {
    requestAllPermissions();
    setupTrackPlayer();

    // Creating .savedPlaylists
    const savedPlaylists = fs.DocumentDirectoryPath + "/.savedPlaylists";
    fs.readFile(savedPlaylists)
    .then((contents) => { return; })
    .catch((error) => {
      fs.writeFile(savedPlaylists, "", "utf8")
      .then((success) => { return; })
      .catch((error) => { console.log(error); });
    });

    // Creating .shuffle
    const shuffle = fs.DocumentDirectoryPath + "/.shuffle";
    fs.readFile(shuffle)
    .then((contents) => { return; })
    .catch((error) => {
      fs.writeFile(shuffle, "0", "utf8")
      .then((success) => { return; })
      .catch((error) => { console.log(error); });
    });

    // Creating .seekValues
    const seekValues = fs.DocumentDirectoryPath + "/.seekValues";
    fs.readFile(seekValues)
    .then((contents) => { return; })
    .catch((error) => {
      fs.writeFile(seekValues, "5 5", "utf8")
      .then((success) => { return; })
      .catch((error) => { console.log(error); })
    });

    return () => TrackPlayer.reset();
  }, []);

  // Autoplay functionality
  useTrackPlayerEvents([ Event.PlaybackState ], async (event) => {
    if (event.state == "stopped") {
      const song = await nextSong();
      if (song != null) playSong(song, "Direct", false);
    }
  });

  const setupTrackPlayer = async () => {
    try {
      await TrackPlayer.getCurrentTrack();
    } catch {
      await TrackPlayer.setupPlayer();
      await TrackPlayer.updateOptions({
        capabilities: [
          Capability.JumpBackward,
          Capability.Play,
          Capability.Pause,
          Capability.JumpForward,
          Capability.Stop
        ],
        compactCapabilities: [
          Capability.JumpBackward,
          Capability.Play,
          Capability.Pause,
          Capability.JumpForward
        ],
        notificationCapabilities: [
          Capability.JumpBackward,
          Capability.Play,
          Capability.Pause,
          Capability.JumpForward,
          Capability.Stop
        ],
        icon: require("./img/Logo.png"),
        playIcon: require("./img/Play.png"),
        pauseIcon: require("./img/Pause.png"),
        rewindIcon: require("./img/Previous.png"),
        forwardIcon: require("./img/Next.png"),
        stopIcon: require("./img/Stop.png"),
        progressUpdateEventInterval: 1,
      });
    }
  };

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {/* Main UI, lists songs */}
        <Stack.Screen
          name="Main"
          component={Main}
        />
        {/* Lists playlists to open */}
        <Stack.Screen
          name="Playlists"
          component={Playlists}
        />
        {/* Shuffle, play/pause, next, previous, etc */}
        <Stack.Screen
          name="SongControl"
          component={SongControl}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
