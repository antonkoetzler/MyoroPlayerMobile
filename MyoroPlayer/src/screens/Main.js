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
import TrackPlayer, { State } from "react-native-track-player";

import TopBar from "../components/TopBar.js";
import Button from "../components/Button.js";
import ListButton from "../components/ListButton.js";
import Modal from "../components/Modal.js";
import MiniPlayer from "../components/MiniPlayer.js";

import { newPlaylist, getSongs, getTags } from "../Functions.js";
import {
  queueSong,
  getCurrentSong,
  previousSong,
  nextSong,
  playSong
} from "../Player.js";
import Base64 from "../Base64.js";

var songs = [];       // Holds <FlatList> information
var songsCopy = null; // Holds copy of songs when user searches
var currentlyPlaying = null;

const Main = ({ navigation, route }) => {
  const [ addSongs, setAddSongs ] = React.useState(false);

  const [ showSearchbar, setShowSearchbar ] = React.useState(false);
  const [ searchbarText, setSearchbarText ] = React.useState("");

  const [ showDialog, setShowDialog ] = React.useState(false);

  const [ showModal, setShowModal ] = React.useState(false);
  const [ modalSelection, setModalSelection ] = React.useState(null);

  const [ showMiniPlayer, setShowMiniPlayer ] = React.useState(false);
  const [ miniPlayerSongName, setMiniPlayerSongName ] = React.useState("");
  const [ miniPlayerAlbumCover, setMiniPlayerAlbumCover ] = React.useState("asset:/img/DefaultAlbumCover.png");
  const [ miniPlayerPlaySrc, setMiniPlayerPlaySrc ] = React.useState("asset:/img/Play.png");

  React.useEffect(() => {
    const interval = setInterval(async () => {
      const currentSong = await getCurrentSong();
      if (currentSong != currentlyPlaying)
        BackgroundThread.run(() => {
          setupMiniPlayer(currentSong);
        }, BackgroundThreadPriority.MIN);
    }, 1000);

    const onload = navigation.addListener("focus", async () => {
      const state = await TrackPlayer.getState();
      if (state == State.Ready
        || state == State.Playing
        || state == State.Paused)
        BackgroundThread.run(() => {
          setupMiniPlayer();
        }, BackgroundThreadPriority.MIN);

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

    return () => {
      clearInterval(interval);
      return onload, onblur;
    };
  }, [route.params]);

  async function setupMiniPlayer (path) {
    if (path == undefined) {
      const currentSong = await getCurrentSong();
      if (currentSong != null) path = currentSong;
      else                     return;
    }

    // Getting ID3 tags
    let songName = null;
    let albumCover = "asset:/img/DefaultAlbumCover.png";
    const tag = await getTags(path);
    if (tag.tags.title == undefined) {
      for (var i = (path.length - 1); i >= 0; i--) {
        if (path[i] == '/') {
          songName = path.substr(i + 1);
          songName = songName.substr(0, songName.length - 4);
          break;
        }
      }
    } else {
      songName = tag.tags.title;

      if (tag.tags.picture != undefined) {
        const data = tag.tags.picture.data;
        let base64string = "";
        for (var i = 0; i < data.length; i++)
          base64string += String.fromCharCode(data[i]);
        albumCover = "data: " + tag.tags.picture.format + ";base64," + Base64.btoa(base64string);
      }
    }

    // Setting information onto MiniPlayer
    setMiniPlayerAlbumCover(albumCover);
    setMiniPlayerSongName(songName);

    // Setting correct play button
    const state = await TrackPlayer.getState();
    if (state == State.Playing) setMiniPlayerPlaySrc("asset:/img/Pause.png");
    else                        setMiniPlayerPlaySrc("asset:/img/Play.png");

    setShowMiniPlayer(true);
  }

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

      {/* MiniPlayer */}
      {
        showMiniPlayer
        &&
        <MiniPlayer
          onPress={() => navigation.navigate("SongControl")}
          songName={miniPlayerSongName}
          albumCover={miniPlayerAlbumCover}
          playSrc={miniPlayerPlaySrc}
          previousOnPress={() => {
            const song = previousSong();
            if (song != null) {
              playSong(song, "Previous", true);
              BackgroundThread.run(() => {
                setupMiniPlayer(song);
              }, BackgroundThreadPriority.MIN);
            }
          }}
          playOnPress={async () => {
            const state = await TrackPlayer.getState();
            if (state == State.Playing) {
              await TrackPlayer.pause();
              setMiniPlayerPlaySrc("asset:/img/Play.png");
            } else {
              await TrackPlayer.play();
              setMiniPlayerPlaySrc("asset:/img/Pause.png");
            }
          }}
          nextOnPress={async () => {
            const song = await nextSong();
            if (song != null) {
              playSong(song, "Direct", false);
              BackgroundThread.run(() => {
                setupMiniPlayer(song);
              }, BackgroundThreadPriority.MIN);
            }
          }}
        />
      }

      {/* Buttons for opening & creating playlists */}
      <View
        style={[
          {
            width: "100%",
            height: Dimensions.get("window").width / 4,
            flexDirection: "row",
            justifyContent: "center"
          },
          !showMiniPlayer && {
            borderTopColor: "#7393B3",
            borderTopWidth: 3
          }
        ]}
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
