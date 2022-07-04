import React from 'react';
import {selectDirectory} from 'react-native-directory-picker';
import fs from 'react-native-fs';

const newPlaylist = () => {
  // Grabbing the folder
  selectDirectory().then((path) => {
    // Opening savedPlaylists.txt to check for duplicates
    fs.readFileAssets("cache/savedPlaylists.txt").then((result) => {
      // Storing every line (playlist/directory) into an array
      let playlists = [];
      while (true) {
        if (result.length == 0) break;
        for (var i = 0; i < result.length; i++) {
          if (result[i] == '\n') {
            playlists.push(result.substr(0, i));
            result = result.substr(i + 1);
            break;
          }
        }
      }

      // Duplicate directory condition
      if (playlists.includes(path)) {
        alert("Duplicate playlist detected");
        return;
      }
    }).catch((error) => { alert(error); });

    // Writing the new directory/playlist to savedPlaylists.txt
    fs.writeFile("cache/savedPlaylists.txt", "Hello", "utf8").then((success) => {
      alert("Success");
    }).catch((error) => { alert(error); });
  });
  //fs.readFileAssets("cache/savedPlaylists.txt").then(result => { alert(result); }).catch(err => { alert(err); });
};

export default newPlaylist;
