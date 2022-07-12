import React from 'react';
import {
  TouchableOpacity,
  Text
} from 'react-native';

const PlaylistButton = ({name, directory, navigation}) => (
  <TouchableOpacity
    style={{
      width: "100%",
      height: 30
    }}
    onPress={() => {
      alert(directory);
      navigation.navigate("SongView");
    }}>
    <Text
      style={{
        fontFamily: "iosevka-regular",
        fontSize: 20,
        color: "#7393B3",
        paddingLeft: 5
      }}
      >{name}</Text>
  </TouchableOpacity>
);

export default PlaylistButton;
