import React from 'react';
import {
  TouchableOpacity,
  Text
} from 'react-native';

const SongButton = ({ name, directory, onPress }) => (
  <TouchableOpacity
    style={{
      width: "100%",
      height: 50,
      borderBottomColor: "#7393B3",
      borderBottomWidth: 3
    }}
    onPress={onPress}
  >
    <Text
      style={{
        fontFamily: "iosevka-regular",
          fontSize: 30,
          color: "#7393B3",
          paddingLeft: 5
      }}>{name}</Text>
  </TouchableOpacity>
);

export default SongButton;
