// Navigation screen for opening a playlist
import React from 'react';
import {
  View,
  FlatList,
  Dimensions
} from 'react-native';

// react-native-fs
import fs from 'react-native-fs';

// Components
import TopBarButton from "./TopBarButton.js";
import PlaylistButton from "./PlaylistButton.js";

// Array to store playlist data
var data = [];

const PlaylistView = ({ navigation }) => {
  // React state to add playlists
  const [addData, setAddData] = React.useState(false);

  // Onload
  React.useEffect(() => {
    const onLoad = navigation.addListener("focus", () => {
      data = [];

      // Try to open .savedPlaylists
      let savedPlaylistsPath = fs.DocumentDirectoryPath + "/.savedPlaylists";
      fs.readFile(savedPlaylistsPath).then((contents) => {
        // Gather directories
        let directories = [];
        while (true) {
          if (contents.length == 0) break;
          for (var i = 0; i < contents.length; i++) {
            if (contents[i] == '\n') {
              directories.push(contents.substr(0, i));
              contents = contents.substr(i + 1);
              break;
            }
          }
        }

        // Gather names of the directories
        let names = [];
        for (var i = 0; i < directories.length; i++) {
          for (var o = (directories[i].length - 1); o >= 0; o--) {
            if (directories[i][o] == '/') {
              names.push(directories[i].substr(o + 1));
              break;
            }
          }
        }

        // Add directories and names to data array to display the playlists
        let jsonData = null;
        for (var i = 0; i < names.length; i++) {
          jsonData = { directory: directories[i], name: names[i] };
          data.push(jsonData);
        }

        setAddData(!addData);
      }).catch((error) => {
        // Create .savedPlaylists
        fs.writeFile(savedPlaylistsPath, "", "utf8").then((success) => {
          return;
        }).catch((error) => {
          console.log(error);
        });
      });
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
      {/* Top bar buttons */}
      <View
        style={{
          width: "95%",
          height: 60,
          alignSelf: "center",
          top: 10
        }}
      >
        <TopBarButton
          style={{
            width: 60,
            height: 60,
            position: "absolute",
            left: 0
          }}
          src={"asset:/img/Back.png"}
          onPress={() => navigation.goBack()}
        />
        <TopBarButton
          style={{
            width: 60,
            height: 60,
            position: "absolute",
            right: 0
          }}
          src={"asset:/img/MoreOptions.png"}
        />
      </View>

      {/* Playlists */}
      <View
        style={{
          width: "100%",
          height: Dimensions.get("window").height - 100,
          position: "absolute",
          bottom: 0,
          borderTopColor: "#7393B3",
          borderTopWidth: 2
        }}
      >
        <FlatList
          data={data}
          extraData={addData}
          renderItem={({ item }) => ((<PlaylistButton directory={item.directory} name={item.name} navigation={navigation} />))}
        >
        </FlatList>
      </View>
    </View>
  );
};

export default PlaylistView;
