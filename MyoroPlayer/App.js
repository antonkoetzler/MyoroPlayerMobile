import React from 'react';
import type {Node} from 'react';
import {
  StyleSheet,
  View,
  Text,
  Dimensions
} from 'react-native';

import MenuButton from "./src/MenuButton.js";
import newPlaylist from "./src/Functions.js";

const App: () => Node = () => {
  const [showMain, setShowMain] = React.useState(true);

  const openPlaylist = () => {
    setShowMain(!showMain);
    alert("Hello World");
  };

  return (
    <View style={showMain ? styles.main : {opacity: 0}}>
      <View style={styles.songlist}>
      </View>

      <View style={styles.menuButtons}>
        <MenuButton style={styles.menuButton} src={"asset:/img/OpenPlaylist.png"} onPress={openPlaylist} />
        <MenuButton style={styles.menuButton} src={"asset:/img/NewPlaylist.png"} onPress={newPlaylist} />
        <MenuButton style={styles.menuButton} src={"asset:/img/YouTubeToMP3.png"} />
        <MenuButton style={styles.menuButton} src={"asset:/img/MusicTransfer.png"} />
      </View>
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
});

export default App;
