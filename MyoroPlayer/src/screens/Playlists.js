import React from "react";
import {
  View,
  FlatList,
  TextInput,
  Dimensions
} from "react-native";
import fs from "react-native-fs";

import TopBar from "../components/TopBar.js";
import ListButton from "../components/ListButton.js";
import Modal from "../components/Modal.js";

import { getDirectoriesFromSavedPlaylists } from "../Functions.js";

var playlists = [];       // Holds <FlatList> information
var playlistsCopy = null; // Holds copy of playlists when user is searching

const Playlists = ({ navigation }) => {
  const [ addPlaylists, setAddPlaylists ] = React.useState(false);
  const [ showSearchbar, setShowSearchbar ] = React.useState(false);
  const [ searchbarText, setSearchbarText ] = React.useState("");
  const [ showModal, setShowModal ] = React.useState(false);
  const [ modalSelection, setModalSelection ] = React.useState(null);

  React.useEffect(() => {
    const onload = navigation.addListener("focus", async () => {
      playlists = [];

      // Loop through directories to get playlist's names
      directories = await getDirectoriesFromSavedPlaylists();
      for (var i = 0; i < directories.length; i++) {
        for (var o = (directories[i].length - 1); o >= 0; o--) {
          if (directories[i][o] == '/') {
            // Adding JSON data to playlists array
            const jsonData = {
              directory: directories[i],
              name: directories[i].substr(o + 1)
            };
            playlists.push(jsonData);

            break;
          }
        }
      }

      setAddPlaylists(!addPlaylists);
    });

    return onload;
  }, []);

  const renderItem = ({ item }) => (
    <ListButton
      wrapperStyle={{
        width: "100%",
        marginTop: 7,
        marginBottom: 7
      }}
      textStyle={{
        fontFamily: "Roboto-Regular",
        fontSize: 25,
        color: "#7393B3",
        paddingLeft: 12,
        paddingRight: 12
      }}
      text={item.name}
      onPress={() => navigation.navigate("Main", { directory: item.directory })}
      onLongPress={() => {
        setModalSelection(item.directory);
        setShowModal(true);
      }}
    />
  );

  function searchSongs (text) {
    playlists = playlistsCopy;
    playlists = playlists.filter((playlist) => {
      return playlist.name.toUpperCase().includes(text.toUpperCase());
    });
    setAddPlaylists(!addPlaylists);
  }

  function deletePlaylist (directory) {
    // Removing from .savedPlaylists
    const savedPlaylists = fs.DocumentDirectoryPath + "/.savedPlaylists";
    fs.readFile(savedPlaylists).then((contents) => {
      let newContents = "";
      while (true) {
        if (contents.length == 0) break;
        for (var i = 0; i < contents.length; i++) {
          if (contents[i] == '\n') {
            const current = contents.substr(0, i);
            if (current != directory) newContents += current + '\n';
            contents = contents.substr(i + 1);
            break;
          }
        }
      }

      fs.writeFile(savedPlaylists, newContents, "utf8")
      .then((success) => { return; })
      .catch((error) => { console.log(error); });
    }).catch((error) => { console.log(error); });

    // Removing from playlists array
    playlists = playlists.filter((playlist) => {
      return playlist.directory != directory;
    });
    setAddPlaylists(!addPlaylists);
  }

  return (
    <View
      style={{
        width: "100%",
        height: "100%",
        backgroundColor: "#FFFFFF"
      }}
    >
      <TopBar
        showLogo={false}
        showBack={true}
        showSearch={true}
        backOnPress={() => navigation.goBack()}
        searchOnPress={() => {
          if (showSearchbar) {
            playlists = playlistsCopy;
            playlistsCopy = null;
            setSearchbarText("");
            setAddPlaylists(!addPlaylists);
          } else playlistsCopy = playlists;

          setShowSearchbar(!showSearchbar);
        }}
      />

      {/* Searchbar */}
      {
        showSearchbar
        &&
        <TextInput
          style={{
            maxWidth: Dimensions.get("window").width - 200,
            fontFamily: "Roboto-Regular",
            fontSize: 25,
            color: "#7393B3",
            position: "absolute",
            alignSelf: "center",
            top: 1.5
          }}
          autoFocus={true}
          value={searchbarText}
          onChangeText={(text) => {
            setSearchbarText(text);
            searchSongs(text);
          }}
        />
      }

      {/* Wrapper for <FlatList> */}
      <View style={{ flex: 1 }}>
        <FlatList
          data={playlists}
          extraData={addPlaylists}
          maxToRenderPerBatch={5}
          updateCellsBatchingPeriod={20}
          renderItem={renderItem}
        />
      </View>

      {/* Modal */}
      <Modal
        showModal={showModal}
        setShowModal={setShowModal}
        modalSelection={modalSelection}
        isPlaylistScreen={true}
        deletePlaylistOnPress={() => {
          deletePlaylist(modalSelection);
          setShowModal(false);
        }}
      />
    </View>
  );
};

export default React.memo(Playlists);
