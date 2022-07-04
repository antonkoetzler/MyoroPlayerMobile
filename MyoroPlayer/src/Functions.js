import React from 'react';
import {selectDirectory} from 'react-native-directory-picker';

export default function newPlaylist() {
  selectDirectory().then((path) => {
    alert(path);
  });
}
