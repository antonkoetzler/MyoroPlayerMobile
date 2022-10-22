// Where various functions are placed
import { PermissionsAndroid } from "react-native";
import { selectDirectory } from "react-native-directory-picker";
import RNGRP from "react-native-get-real-path";
import fs from "react-native-fs";
import jsmediatags from "@avi-l/jsmediatags";

// Requests
// - READ_EXTERNAL_STORAGE
// - WRITE_EXTERNAL_STORAGE
export async function requestAllPermissions () {
  let ungrantedPermissions = [];
  let granted = undefined;

  granted = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE)
  .then((granted) => { return granted; });
  if (!granted) ungrantedPermissions.push(PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE);

  granted = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE)
  .then((granted) => { return granted; });
  if (!granted) ungrantedPermissions.push(PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE);

  if (ungrantedPermissions.length > 0) PermissionsAndroid.requestMultiple(ungrantedPermissions);
}

export function newPlaylist () {
  selectDirectory().then((uri) => {
    RNGRP.getRealPathFromURI(uri).then(async (path) => {
      // Dealing with SD cards
      if (path == null) {
        uri = decodeURIComponent(uri);

        for (var i = (uri.length - 1); i >= 0; i--) {
          if (uri[i] == ':') {
            let SDCardID = uri.substr(0, i);
            SDCardID = SDCardID.substr(SDCardID.length - 9);
            path = "/storage/" + SDCardID + "/" + uri.substr(i + 1);
            break;
          }
        }
      }

      // Checking for duplicate directories in .savedPlaylists
      const directories = await getDirectoriesFromSavedPlaylists();
      if (directories.includes(path)) return;

      const savedPlaylists = fs.DocumentDirectoryPath + "/.savedPlaylists";
      const appendString = path + '\n';
      fs.appendFile(savedPlaylists, appendString, "utf8")
      .then((success) => { return; })
      .catch((error) => { console.log(error); });
    });
  });
}

export async function getDirectoriesFromSavedPlaylists () {
  const savedPlaylists = fs.DocumentDirectoryPath + "/.savedPlaylists";
  const result = await fs.readFile(savedPlaylists).then((contents) => {
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

    return directories;
  }).catch((error) => { console.log(error); });

  return result;
}

// Grabs all songs including subdirs from a directory
// songs is returned after execution
var songs = [];
export async function getSongs (directory) {
  songs = [];
  await getSongsFromDirectory(directory);
  return songs;
}
// Helper function that recursively gathers songs
async function getSongsFromDirectory (directory) {
  const files = await fs.readDir(directory)
  .then((result) => { return result; })
  .catch((error) => { console.log(error); });

  for (var i = 0; i < files.length; i++) {
    if (files[i].isDirectory() && files[i].name != ".thumbnails") {
      await getSongsFromDirectory(files[i].path);
    } else if (files[i].isFile()) {
      // Checking if the extension is MP3
      const split = files[i].name.split('.');
      if (split[split.length - 1].toUpperCase() == "MP3") {
        let jsonData = {
          directory: files[i].path,
          name: files[i].name.substr(0, files[i].name.length - 4),
          invalid: false
        };

        // Checking if there are # in the file name (causes errors)
        // We mark them as invalid
        if (files[i].name.includes('#')) jsonData.invalid = true;

        songs.push(jsonData);
      }
    }
  }
}

export function toggleShuffle (setState) {
  const shuffle = fs.DocumentDirectoryPath + "/.shuffle";
  fs.readFile(shuffle).then((shuffleValue) => {
    let newShuffleValue;

    if (shuffleValue == "0") {
      newShuffleValue = "1";
      setState("asset:/img/ShuffleHover.png");
    } else {
      newShuffleValue = "0";
      setState("asset:/img/Shuffle.png");
    }

    fs.writeFile(shuffle, newShuffleValue, "utf8")
    .then((success) => { return; })
    .catch((error) => { console.log(error); });
  }).catch((error) => { console.log(error); });
}

export function getTags (path) {
  return new Promise((resolve, reject) => {
    new jsmediatags.Reader(path).read({
      onSuccess: (tag) => { resolve(tag); },
      onError: (error) => { reject(error); }
    });
  });
}
