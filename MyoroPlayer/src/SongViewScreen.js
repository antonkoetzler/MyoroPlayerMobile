import React from 'react';
import {
  View,
  Dimensions
} from 'react-native';

import MenuButton from "./MenuButton.js";
import newPlaylist from "./Functions.js";

const SongViewScreen = ({ navigation }) => {
  return (
    <View
      style={{
        width: "100%",
        height: "100%"
      }}
    >
      <View
        style={{
          width: "100%",
          height: Dimensions.get("window").height - (Dimensions.get("window").width / 4)
        }}    
      >
      </View>

      <View
        style={{
          flexDirection: "row",
          width: "100%",
          height: Dimensions.get("window").width / 4
        }}
      >
        <MenuButton
          src={"asset:/img/OpenPlaylist.png"}
          style={{
            width: Dimensions.get("window").width / 4,
            height: Dimensions.get("window").width / 4
          }}
          onPress={() => {
            navigation.navigate("PlaylistView");
          }}
        />
        <MenuButton
          src={"asset:/img/NewPlaylist.png"}
          style={{
            width: Dimensions.get("window").width / 4,
            height: Dimensions.get("window").width / 4
          }}
          onPress={newPlaylist}
        />
        <MenuButton
          src={"asset:/img/YouTubeToMP3.png"}
          style={{
            width: Dimensions.get("window").width / 4,
            height: Dimensions.get("window").width / 4
          }}
        />
        <MenuButton
          src={"asset:/img/MusicTransfer.png"}
          style={{
            width: Dimensions.get("window").width / 4,
            height: Dimensions.get("window").width / 4
          }}
        />
      </View>
    </View>
  );
};

export default SongViewScreen
