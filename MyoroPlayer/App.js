import React from 'react';
import type {Node} from 'react';
import {
  StyleSheet,
  View,
  Text,
  Dimensions,
  FlatList
} from 'react-native';
import fs from 'react-native-fs';

// Functions/Components we can store in ./src/Functions.js
import MenuButton from "./src/MenuButton.js";
import PlaylistButton from "./src/PlaylistButton.js";
import newPlaylist from "./src/Functions.js";

// These are the playlists listed on openPlaylist
var playlistData = [];

const App: () => Node = () => {
  // States
  const [showMain, setShowMain] = React.useState(true);
  const [addPlaylistData, setAddPlaylistData] = React.useState(true);

  // Lists playlists in .savedPlaylists to open
  const openPlaylist = () => {
    // Sets opacity of styles.main to 0
    setShowMain(!showMain);

    let cachePath = fs.DocumentDirectoryPath + "/.savedPlaylists";
    // Checking for .savedPlaylists to list playlists
    fs.readFile(cachePath).then((result) => {
      let directories = [];
      let temp = 0;
      for (var i = 0; i < result.length; i++) {
        if (result[i] == '\n') {
          directories.push(result.substr(temp, i));
          temp = result.indexOf(result[i]);
        }
      }

      // Adding playlists to playlistData so that it'll show up in styles.modal
      let names = [];
      for (var i = 0; i < directories.length; i++) {
        let directory = decodeURIComponent(directories[i]);
        for (var o = (directory.length - 1); o >= 0; o--) {
          if (directory[o] == ':') {
            names.push(directory.substr(o + 1));
            break;
          }
        }
      }

      // Clearing and populating playlistData to list in playlistView
      playlistData = [];
      let jsonData = null;
      for (var i = 0; i < names.length; i++) {
        jsonData = { directory: directories[i], name: names[i] };
        playlistData.push(jsonData);
      }
      setAddPlaylistData(!addPlaylistData);
    }).catch((error) => {
      // Creating .savedPlaylists if it doesn't exist
      fs.writeFile(cachePath, "", "utf8").then((success) => {
        alert("No existing playlists");
        return;
      }).catch((error) => {
        alert(error);
      });
    });
  };

  return (
    <View style={{width: "100%", height: "100%"}}>

    <View style={showMain ? styles.main : {display: "none"}}>
      <View style={styles.songlist}>
      </View>

      <View style={styles.menuButtons}>
        <MenuButton style={styles.menuButton} src={"asset:/img/OpenPlaylist.png"} onPress={openPlaylist} />
        <MenuButton style={styles.menuButton} src={"asset:/img/NewPlaylist.png"} onPress={newPlaylist} />
        <MenuButton style={styles.menuButton} src={"asset:/img/YouTubeToMP3.png"} />
        <MenuButton style={styles.menuButton} src={"asset:/img/MusicTransfer.png"} />
      </View>
    </View>

    <FlatList
      style={showMain ? {display: "none"} : styles.playlistView}
      data={playlistData}
      extraData={addPlaylistData}
      renderItem={({ item }) => ((<PlaylistButton name={item.name} />))}
    />

    </View>
  );
};

const styles = StyleSheet.create({
  main: {
    width: "100%",
    height: "100%",
  },
  songlist: {
    width: "100%",
    height: Dimensions.get("window").height - (Dimensions.get("window").width / 4)
  },
  menuButtons: {
    flexDirection: "row",
    width: "100%",
    height: Dimensions.get("window").width / 4
  },
  menuButton: {
    width: Dimensions.get("window").width / 4,
    height: Dimensions.get("window").width / 4,
  },
  // Main UI for when a song is playing
  playlistView: {
    width: "100%",
    height: "100%"
  },
});

export default App;
