// Button for: shuffle, previous, play, next, back, and more options
import React from 'react';
import {
  TouchableOpacity,
  Image
} from 'react-native';

const SongControlButton = ({ src, sizerStyle, imageStyle }) => (
  <TouchableOpacity style={sizerStyle} >
    <Image source={{ uri: src }} style={imageStyle} />
  </TouchableOpacity>
);

export default SongControlButton;
