// Default navigation screen
// Handles: Listing songs, new playlist, open playlist, yt2mp3, and music transfer
import React from 'react';
import {
  View,
  FlatList,
  Dimensions
} from 'react-native';

// Components
import SongViewButton from "./SongViewButton.js";

// Functions
import { newPlaylist, openPlaylist } from "./Functions.js";

const SongView = ({ navigation }) => {
  return (
    <View
      style={{
        width: "100%",
        height: "100%"
      }}
    >
      <FlatList>
      </FlatList>
      <View
        style={{
          flexDirection: "row",
          width: "100%",
          height: Dimensions.get("window").width / 4
        }}
      >
        <SongViewButton src={"asset:/img/OpenPlaylist.png"} onPress={() => navigation.navigate("PlaylistView")} />
        <SongViewButton src={"asset:/img/NewPlaylist.png"} onPress={newPlaylist} />
        <SongViewButton src={"asset:/img/YouTubeToMP3.png"} />
        <SongViewButton src={"asset:/img/MusicTransfer.png"} />
      </View>
    </View>
  );
};

export default SongView;
