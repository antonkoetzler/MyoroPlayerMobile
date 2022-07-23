// A button component in PlaylistView.js & SongControlView.js
// Used with back and more options buttons at the top of the screen
import React from 'react';
import {
  TouchableOpacity,
  Image
} from 'react-native';

const TopBarButton = ({ style, src, onPress }) => (
  <TouchableOpacity style={style} onPress={onPress}>
    <Image
      source={{ uri: src }}
      style={{
        width: 60,
        height: 60,
        alignSelf: "center"
      }}
    />
  </TouchableOpacity>
);

export default TopBarButton;
