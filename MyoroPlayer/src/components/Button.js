// Abstract image button
// <TouchableOpacity> wrapper & <Image> child
import React from "react";
import { TouchableOpacity, Image } from "react-native";

const Button = ({
  wrapperStyle,
  imageStyle,
  src,
  onPress
}) => (
  <TouchableOpacity style={wrapperStyle} onPress={onPress}>
    <Image style={imageStyle} source={{ uri: src }} />
  </TouchableOpacity>
);

export default React.memo(Button);
