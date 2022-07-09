import React from 'react';
import {selectDirectory} from 'react-native-directory-picker';
import fs from 'react-native-fs';

const newPlaylist = () => {
  // Grabbing the folder
  selectDirectory().then((path) => {
    // Looking for existing .savedPlaylists
    let cachePath = fs.DocumentDirectoryPath + "/.savedPlaylists";
    fs.readFile(cachePath).then((result) => {
      // Checking for a duplicate add
      let directories = [];
      let temp = 0;
      for (var i = 0; i < result.length; i++) {
        if (result[i] == '\n') {
          directories.push(result.substr(temp, i));
          temp = result.indexOf(result[i]);
        }
      }
      if (directories.includes(path)) {
        alert("Duplicate playlist added");
        return;
      }

      let appendString = path + '\n';
      fs.appendFile(cachePath, appendString, "utf8").then((success) => {
        return;
      }).catch((error) => {
        alert(error);
      });
    }).catch((error) => {
      // Creating .savedPlaylists
      let fileContents = path + '\n';
      fs.writeFile(cachePath, fileContents, "utf8").then((success) => {
        return;
      }).catch((error) => {
        alert(error);
      });
    });
  });
};

export default newPlaylist;
