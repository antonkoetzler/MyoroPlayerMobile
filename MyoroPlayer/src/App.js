import React from "react";
import type { Node } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import fs from "react-native-fs";

import Main from "./screens/Main.js";
import Playlists from "./screens/Playlists.js";
import SongControl from "./screens/SongControl.js";

import { requestAllPermissions } from "./Functions.js";

const Stack = createNativeStackNavigator();

const App: () => Node = () => {
  React.useEffect(() => {
    requestAllPermissions();

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
  }, []);

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
