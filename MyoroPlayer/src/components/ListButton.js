// Button for songs & playlists
// <TouchableOpacity> wrapper & <Text> child
import React from "react";
import { TouchableOpacity, Text } from "react-native";

const ListButton = ({
  wrapperStyle,
  textStyle,
  text,
  onPress,
  onLongPress
}) => (
  <TouchableOpacity
    style={wrapperStyle}
    onPress={onPress}
    onLongPress={onLongPress}
  >
    <Text style={textStyle}>{text}</Text>
  </TouchableOpacity>
);

export default React.memo(ListButton);
