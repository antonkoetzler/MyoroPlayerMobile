import React from "react";
import {
  View,
  FlatList,
  TextInput,
  StyleSheet,
  Dimensions
} from "react-native";
import BackgroundThread, { BackgroundThreadPriority } from "@gennadysx/react-native-background-thread";
import Dialog from "react-native-dialog";

import TopBar from "../components/TopBar.js";
import Button from "../components/Button.js";
import ListButton from "../components/ListButton.js";
import Modal from "../components/Modal.js";

import { newPlaylist, getSongs } from "../Functions.js";
import { queueSong } from "../Player.js";

var songs = [];       // Holds <FlatList> information
var songsCopy = null; // Holds copy of songs when user searches

const Main = ({ navigation, route }) => {
  const [ addSongs, setAddSongs ] = React.useState(false);

  const [ showSearchbar, setShowSearchbar ] = React.useState(false);
  const [ searchbarText, setSearchbarText ] = React.useState("");

  const [ showDialog, setShowDialog ] = React.useState(false);

  const [ showModal, setShowModal ] = React.useState(false);
  const [ modalSelection, setModalSelection ] = React.useState(null);

  React.useEffect(() => {
    const onload = navigation.addListener("focus", () => {
      if (route.params == undefined) return;

      // BackgroundThread is out of scope of route.params.directory
      const directory = route.params.directory;
      BackgroundThread.run(async () => {
        songs = [];
        songs = await getSongs(directory);
        setAddSongs(!addSongs);
      }, BackgroundThreadPriority.MIN);

      // Allows user to reload playlist by reselecting
      route.params = undefined;
    });

    const onblur = navigation.addListener("blur", () => {
      setSearchbarText("");
      setShowSearchbar(false);
      if (songsCopy != null) {
        songs = songsCopy;
        songsCopy = null;
        setAddSongs(!addSongs);
      }
    });

    return onload, onblur;
  }, [route.params]);

  const renderItem = ({ item }) => (
    <ListButton
      wrapperStyle={[
        {
          width: "100%",
          marginTop: 7,
          marginBottom: 7
        },
        item.invalid && { backgroundColor: "lightpink" }
      ]}
      textStyle={{
        fontFamily: "Roboto-Regular",
        fontSize: 20,
        color: "#7393B3",
        paddingLeft: 12,
        paddingRight: 12
      }}
      text={item.name}
      onPress={() => {
        if (item.invalid)
          setShowDialog(true);
        else
          navigation.navigate("SongControl", { directory: item.directory });
      }}
      onLongPress={() => {
        if (!item.invalid) {
          setModalSelection(item.directory);
          setShowModal(true);
        }
      }}
    />
  );

  function searchSongs (text) {
    songs = songsCopy;
    songs = songs.filter((song) => {
      return song.name.toUpperCase().includes(text.toUpperCase());
    });
    setAddSongs(!addSongs);
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
        showLogo={true}
        showBack={false}
        showSearch={true}
        searchOnPress={() => {
          if (showSearchbar) {
            songs = songsCopy;
            songsCopy = null;
            setSearchbarText("");
            setAddSongs(!addSongs);
          } else songsCopy = songs;

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
          data={songs}
          extraData={addSongs}
          maxToRenderPerBatch={5}
          updateCellsBatchingPeriod={20}
          renderItem={renderItem}
        />
      </View>

      {/* Buttons for opening & creating playlists */}
      <View
        style={{
          width: "100%",
          height: Dimensions.get("window").width / 4,
          borderTopColor: "#7393B3",
          borderTopWidth: 3,
          flexDirection: "row",
          justifyContent: "center"
        }}
      >
        <Button
          wrapperStyle={styles.footerButtonWrapper}
          imageStyle={styles.footerButtonImage}
          src={"asset:/img/OpenPlaylist.png"}
          onPress={() => navigation.navigate("Playlists")}
        />
        <Button
          wrapperStyle={styles.footerButtonWrapper}
          imageStyle={styles.footerButtonImage}
          src={"asset:/img/NewPlaylist.png"}
          onPress={newPlaylist}
        />
      </View>

      {/* Dialog window */}
      <Dialog.Container visible={showDialog}>
        <Dialog.Title>Conflicting File Name</Dialog.Title>
        <Dialog.Description>
          Remove the # characters from the file to be able to play said file
        </Dialog.Description>
        <Dialog.Button label="Okay" onPress={() => setShowDialog(false)} />
      </Dialog.Container>

      {/* Modal */}
      <Modal
        showModal={showModal}
        setShowModal={setShowModal}
        modalSelection={modalSelection}
        isPlaylistScreen={false}
        queueOnPress={() => {
          queueSong(modalSelection);
          setShowModal(false);
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  footerButtonWrapper: {
    width: Dimensions.get("window").width / 4,
    height: Dimensions.get("window").width / 4,
    justifyContent: "center"
  },
  footerButtonImage: {
    width: Dimensions.get("window").width / 4,
    height: Dimensions.get("window").width / 4,
    alignSelf: "center"
  }
});

export default React.memo(Main);
