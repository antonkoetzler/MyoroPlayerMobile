// A button component in SongView.js
// Used with new playlist, open playlist, yt2mp3, and file transfer buttons
import React from 'react';
import {
  TouchableOpacity,
  Image,
  Dimensions
} from 'react-native';

const SongViewButton = ({ src, onPress }) => (
  <TouchableOpacity
    style={{
      width: Dimensions.get("window").width / 4,
      height: Dimensions.get("window").width / 4,
      justifyContent: "center"
    }}
    onPress={onPress}
  >
    <Image
      source={{ uri: src }}
      style={{
        width: Dimensions.get("window").width / 4 - 10,
        height: Dimensions.get("window").width / 4 - 10,
        alignSelf: "center"
      }}
    />
  </TouchableOpacity>
);

export default SongViewButton;
