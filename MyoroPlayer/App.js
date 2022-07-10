import React from 'react';
import type {Node} from 'react';
import {
  StyleSheet
} from 'react-native';
import fs from 'react-native-fs';

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
const Stack = createNativeStackNavigator();

// Functions/Components we can store in ./src/Functions.js
import SongViewScreen from "./src/SongViewScreen.js";
import PlaylistViewScreen from "./src/PlaylistViewScreen.js";
import PlaylistButton from "./src/PlaylistButton.js";

const App: () => Node = () => {
  return (
    <NavigationContainer>
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen
        name="SongView"
        component={SongViewScreen}
      />
      <Stack.Screen
        name="PlaylistView"
        component={PlaylistViewScreen}
      />
    </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  // Main UI for when a song is playing
  playlistView: {
    width: "100%",
    height: "100%"
  },
});

export default App;
