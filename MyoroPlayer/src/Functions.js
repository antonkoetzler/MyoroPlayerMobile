// JS file to store extra functions
import React from 'react';

// react-native-directory-picker
import { selectDirectory } from 'react-native-directory-picker';

// react-native-get-real-path ~ content uri to path
import RNGRP from 'react-native-get-real-path';

// react-native-fs
import fs from 'react-native-fs';

export const newPlaylist = () => {
  selectDirectory().then((path) => {
    RNGRP.getRealPathFromURI(path).then((path) => {
      // Try to open .savedPlaylists
      let savedPlaylistsPath = fs.DocumentDirectoryPath + "/.savedPlaylists";
      fs.readFile(savedPlaylistsPath).then((contents) => {
        // Check for duplicate directories
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
        } if (directories.includes(path)) return;

        // Adding the path to .savedPlaylists
        let appendString = path + '\n';
        fs.appendFile(savedPlaylistsPath, appendString, "utf8").then((success) => {
          return;
        }).catch((error) => {
          console.log(error);
        });
      }).catch((error) => {
        // .savedPlaylists doesn't exist, we create it here
        let fileContents = path + '\n';
        fs.writeFile(savedPlaylistsPath, fileContents, "utf8").then((success) => {
          return;
        }).catch((error) => {
          console.log(error);
        });
      });
    }).catch((error) => {
      console.log(error);
    });
  });
};
