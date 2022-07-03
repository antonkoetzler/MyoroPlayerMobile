import React from 'react';
import {
  TouchableOpacity,
  Image,
  Dimensions
} from 'react-native';

const MenuButton = ({style, src, onPress}) => (
  <TouchableOpacity style={style} onPress={onPress}>
    <Image
      source={{ uri: src }}
      style={{
        width: (Dimensions.get("window").width / 4) - 30,
        height: (Dimensions.get("window").width / 4) - 30,
        alignSelf: "center"
      }}
    />
  </TouchableOpacity>
);

export default MenuButton;
