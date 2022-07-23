// A button component in PlaylistView.js
// Used to display a playlist
import React from 'react';
import {
  TouchableOpacity,
  Text
} from 'react-native';

const PlaylistButton = ({ directory, name, navigation }) => (
  <TouchableOpacity
    style={{
      width: "100%",
      height: 50,
      marginBottom: 1,
      borderBottomColor: "#7393B3",
      borderBottomWidth: 2
    }}
    onPress={() => navigation.navigate("SongView", { directory: directory })}
  >
    <Text
      style={{
        fontFamily: "iosevka-regular",
        fontSize: 30,
        color: "#7393B3"
      }}
    >{name}</Text>
  </TouchableOpacity>
);

export default PlaylistButton;
