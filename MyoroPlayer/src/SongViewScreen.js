import React from 'react';
import {
  View,
  Dimensions,
  FlatList,
  StyleSheet
} from 'react-native';
import fs from 'react-native-fs';

import MenuButton from "./MenuButton.js";
import SongButton from "./SongButton.js";
import newPlaylist from "./Functions.js";

var songs = [];

const SongViewScreen = ({ route, navigation }) => {
  const [addSong, setAddSong] = React.useState(false);

  function getSongs(files) {
    for (var i = 0; i < files.length; i++) {
      if (files[i].isDirectory() && files[i].name != "thumbnails") {
        fs.readDir(files[i].path).then((subFolderFiles) => {
          getSongs(subFolderFiles);
        }).catch((error) => {
          alert(error);
        });
      }
      else if (files[i].isFile()) {
        let extension = null;
        for (var o = (files[i].name.length - 1); o >= 0; o--) {
          if (files[i].name[o] == '.') {
            extension = files[i].name.substr(o + 1);
            break;
          }
        }

        if (extension.toUpperCase() == "MP3") {
          let jsonData = { name: files[i].name.substr(0, files[i].name.length - 4), directory: files[i].path };
          songs.push(jsonData);
        }
      }
    }
  }

  // Loading the songs if a playlist is selected
  React.useEffect(() => {
    const onLoad = navigation.addListener("focus", () => {
      if (route.params != undefined) {
        songs = [];
        fs.readDir(route.params.playlistDirectory).then((files) => {
          getSongs(files);
          setAddSong(!addSong);
        }).catch((error) => {
          alert(error);
        });
      }
    });
    return onLoad;
  });

  return (
    <View
      style={{
        width: "100%",
        height: "100%"
      }}
    >
      <FlatList
        style={{
          width: "100%",
          height: Dimensions.get("window").height - (Dimensions.get("window").width / 4)
        }}    
        data={songs}
        extraData={addSong}
        renderItem={({ item }) => ((
          <SongButton
            name={item.name}
            directory={item.directory}
            onPress={() => {
              navigation.navigate("SongControl", { name: item.name, directory: item.directory });
            }}
          />
        ))}
      >
      </FlatList>

      <View
        style={{
          flexDirection: "row",
          width: "100%",
          height: Dimensions.get("window").width / 4
        }}
      >
        <MenuButton
          src={"asset:/img/OpenPlaylist.png"}
          style={styles.menuButton}
          onPress={() => {
            navigation.navigate("PlaylistView");
          }}
        />
        <MenuButton
          src={"asset:/img/NewPlaylist.png"}
          style={styles.menuButton}
          onPress={newPlaylist}
        />
        <MenuButton
          src={"asset:/img/YouTubeToMP3.png"}
          style={styles.menuButton}
        />
        <MenuButton
          src={"asset:/img/MusicTransfer.png"}
          style={styles.menuButton}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  menuButton: {
    justifyContent: "center",
    width: Dimensions.get("window").width / 4,
    height: Dimensions.get("window").width / 4
  }
});

export default SongViewScreen;
