import React from 'react';
import {
  View,
  Dimensions,
  FlatList
} from 'react-native';

import fs from 'react-native-fs';

import PlaylistButton from "./PlaylistButton.js";

// Where stored playlists in .savedPlaylists are stored
var playlistData = [];

const PlaylistViewScreen = ({ navigation }) => {
  // State to load data from .savedPlaylists
  const [addData, setAddData] = React.useState(false);

  // Loading the playlists in .savedPlaylists on load
  React.useEffect(() => {
    const onLoad = navigation.addListener("focus", () => {
      playlistData = [];
      let cachePath = fs.DocumentDirectoryPath + "/.savedPlaylists";
      fs.readFile(cachePath).then((result) => {
        // Seperating directories
        let directories = [];
        let temp = 0;
        for (var i = 0; i < result.length; i++) {
          if (result[i] == '\n') {
            directories.push(result.substr(temp, i));
            temp = result.indexOf(result[i]);
          }
        }
        // Grabbing the names of the directories
        let names = [];
        for (var i = 0; i < directories.length; i++) {
          for (var o = (directories[i].length - 1); o >= 0; o--) {
            if (directories[i][o] == '/') {
              names.push(directories[i].substr(o + 1));
              break;
            }
          }
        }
        // Loading directories and names as JSON data into playlistData
        let jsonData = null;
        for (var i = 0; i < names.length; i++) {
          jsonData = { directory: directories[i], name: names[i] };
          playlistData.push(jsonData);
        }
        setAddData(!addData);
      }).catch((error) => {
        alert(error);
      });
    });
    return onLoad;
  });

  return (
    <FlatList
      style={{
        width: "100%",
        height: "100%"
      }}
      data={playlistData}
      extraData={addData}
      renderItem={({ item }) => ((<PlaylistButton name={item.name} directory={item.directory} navigation={navigation} />))}
    />
  );
};

export default PlaylistViewScreen;
