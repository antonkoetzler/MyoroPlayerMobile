import React from 'react';
import type {Node} from 'react';

// React Native navigation
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
const Stack = createNativeStackNavigator();

// Components
import SongView from "./components/SongView.js";

const App: () => Node = () => {
  return (
    <NavigationContainer>
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen
        name="SongView"
        component={SongView}
      />
    </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
