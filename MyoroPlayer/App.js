import React from 'react';
import type {Node} from 'react';
import {
  View,
} from 'react-native';

// React Native navigation
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
const Stack = createNativeStackNavigator();

// Navigation screens
import SongView from "./src/SongView.js";
import PlaylistView from "./src/PlaylistView.js";

const App: () => Node = () => {
  return (
    <NavigationContainer>
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="SongView"
        component={SongView}
      />
      <Stack.Screen
        name="PlaylistView"
        component={PlaylistView}
      />
    </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
