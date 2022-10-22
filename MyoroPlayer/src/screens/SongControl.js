import React from "react";
import {
  View,
  Image,
  TouchableOpacity,
  Text,
  Easing,
  Dimensions,
  StyleSheet
} from "react-native";
import TextTicker from "react-native-text-ticker";
import Slider from "@react-native-community/slider";
import fs from "react-native-fs";
import TrackPlayer, { State } from "react-native-track-player";
import BackgroundThread, { BackgroundThreadPriority } from "@gennadysx/react-native-background-thread";

import TopBar from "../components/TopBar.js";
import Button from "../components/Button.js";

import {
  toggleShuffle,
  getTags,
  getDirectoriesFromSavedPlaylists
} from "../Functions.js";
import { playSong, getCurrentSong, previousSong, nextSong } from "../Player.js";
import Base64 from "../Base64.js";

var currentlyPlaying = null;

const SongControl = ({ navigation, route }) => {
  const [ playlistScrolling, setPlaylistScrolling ] = React.useState(false);
  const [ songScrolling, setSongScrolling ] = React.useState(false);

  const [ playlistName, setPlaylistName ] = React.useState("");
  const [ albumCover, setAlbumCover ] = React.useState("asset:/img/DefaultAlbumCover.png");
  const [ songName, setSongName ] = React.useState("");

  const [ sliderMaximumValue, setSliderMaximumValue ] = React.useState(100);
  const [ sliderCurrentValue, setSliderCurrentValue ] = React.useState(50);

  const [ seekBackwardAmount, setSeekBackwardAmount ] = React.useState("5");
  const [ seekForwardAmount, setSeekForwardAmount ] = React.useState("5");

  const [ shuffleSrc, setShuffleSrc ] = React.useState("asset:/img/Shuffle.png");
  const [ playSrc, setPlaySrc ] = React.useState("asset:/img/Play.png");

  React.useEffect(() => {
    // Slider & launching app from background mode again
    const interval = setInterval(async () => {
      const duration = await TrackPlayer.getDuration();
      setSliderMaximumValue(duration);
      const position = await TrackPlayer.getPosition();
      setSliderCurrentValue(position);

      // If the user comes back from background mode & song has changed
      const currentSong = await getCurrentSong();
      if (currentSong != currentlyPlaying)
        BackgroundThread.run(() => {
          prepareUI(currentSong);
        }, BackgroundThreadPriority.MIN);
    }, 1000);

    const onload = navigation.addListener("focus", async () => {
      // Either route.params.directory or no dir (current TrackPlayer track)
      // No dir is caused by the user clicking the MiniPlayer to return to SongControl
      let directory;
      const currentSong = await getCurrentSong();
      if (route.params == undefined) directory = currentSong;
      else                           directory = route.params.directory;

      BackgroundThread.run(() => {
        prepareUI(directory);
      }, BackgroundThreadPriority.MIN);

      if (route.params != undefined)
        if (currentSong != route.params.directory)
          playSong(route.params.directory, "Direct", false);

      route.params = undefined;
    });

    return () => {
      clearInterval(interval);
      return onload;
    };
  }, [route.params]);

  async function prepareUI (path) {
    currentlyPlaying = path;

    // Getting what playlist it is from
    const directories = await getDirectoriesFromSavedPlaylists();
    let playlistName = null;
    for (var i = 0; i < directories.length; i++) {
      if (directories[i].length < path.length
        && directories[i] == path.substr(0, directories[i].length)) {
        playlistName = path.substr(0, directories[i].length);
        for (var o = (playlistName.length - 1); o >= 0; o--) {
          if (playlistName[o] == '/') {
            playlistName = playlistName.substr(o + 1);
            break;
          }
        }
      }
    }

    // Getting ID3 tags (if there are any)
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

    // Setting playlist name, album cover, & song name
    if (playlistName.length > 18) setPlaylistScrolling(true);
    else                          setPlaylistScrolling(false);
    setPlaylistName(playlistName);
    if (songName.length > 18)     setSongScrolling(true);
    else                          setSongScrolling(false);
    setSongName(songName);
    setAlbumCover(albumCover);

    // Making sure shuffle is set correctly
    const shuffle = fs.DocumentDirectoryPath + "/.shuffle";
    fs.readFile(shuffle).then((shuffleValue) => {
      if (shuffleValue == "0") setShuffleSrc("asset:/img/Shuffle.png");
      else                     setShuffleSrc("asset:/img/ShuffleHover.png");
    }).catch((error) => { console.log(error); });

    // Making sure seek values are set correctly
    const seekValues = fs.DocumentDirectoryPath + "/.seekValues";
    fs.readFile(seekValues).then((contents) => {
      const split = contents.split(' ');
      setSeekBackwardAmount(split[0]);
      setSeekForwardAmount(split[1]);
    }).catch((error) => { console.log(error); });

    // Making sure play button is set correctly
    setTimeout(async () => {
      const state = await TrackPlayer.getState();
      if (state == State.Playing) setPlaySrc("asset:/img/Pause.png");
      else                        setPlaySrc("asset:/img/Play.png");
    }, 2000);
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
        showSearch={false}
        backOnPress={() => navigation.goBack()}
      />

      {/* Wrapper that holds/centers the page's content */}
      <View style={{ flex: 1, justifyContent: "center" }}>
        <View
          style={{
            width: Dimensions.get("window").width * (3 / 4),
            alignItems: "center",
            alignSelf: "center"
          }}
        >
          {/* Playlist name */}
          {
            !playlistScrolling
            &&
            <Text style={styles.text}>{playlistName}</Text>
          }
          {
            playlistScrolling
            &&
            <TextTicker
              style={[
                styles.text,
                { width: Dimensions.get("window").width * (3 / 4) }
              ]}
              duration={5750}
              repeatSpacer={30}
              easing={Easing.linear}
            >{playlistName}</TextTicker>
          }

          {/* Album cover */}
          <Image
            style={{
              width: Dimensions.get("window").width * (3 / 4),
              height: Dimensions.get("window").width * (3 / 4),
              borderRadius: 10
            }}
            source={{ uri: albumCover }}
          />

          {/* Song name */}
          {
            !songScrolling
            &&
            <Text style={styles.text}>{songName}</Text>
          }
          {
            songScrolling
            &&
            <TextTicker
              style={[
                styles.text,
                { width: Dimensions.get("window").width * (3 / 4) }
              ]}
              duration={5750}
              repeatSpacer={30}
              easing={Easing.linear}
            >{songName}</TextTicker>
          }

          {/* Progress slider */}
          <Slider
            style={{ width: Dimensions.get("window").width * (3 / 4) + 30 }}
            minimumValue={0}
            maximumValue={sliderMaximumValue}
            value={sliderCurrentValue}
            minimumTrackTintColor="#7393B3"
            maximumTrackTintColor="#000000"
            thumbTintColor="#7393B3"
          />

          {/* Shuffle, previous, play/pause, next */}
          <View style={{ flexDirection: "row" }}>
            <Button
              wrapperStyle={styles.buttonWrapper}
              imageStyle={styles.buttonImage}
              src={shuffleSrc}
              onPress={() => toggleShuffle(setShuffleSrc)}
            />
            <Button
              wrapperStyle={styles.buttonWrapper}
              imageStyle={styles.buttonImage}
              src={"asset:/img/Previous.png"}
              onPress={() => {
                const song = previousSong();
                if (song != null) {
                  playSong(song, "Previous", true);
                  BackgroundThread.run(() => {
                    prepareUI(song);
                  }, BackgroundThreadPriority.MIN);
                }
              }}
            />
            <Button
              wrapperStyle={styles.buttonWrapper}
              imageStyle={styles.buttonImage}
              src={playSrc}
              onPress={async () => {
                const state = await TrackPlayer.getState();
                if (state == State.Playing) {
                  TrackPlayer.pause();
                  setPlaySrc("asset:/img/Play.png");
                } else {
                  TrackPlayer.play();
                  setPlaySrc("asset:/img/Pause.png");
                }
              }}
            />
            <Button
              wrapperStyle={styles.buttonWrapper}
              imageStyle={styles.buttonImage}
              src={"asset:/img/Next.png"}
              onPress={async () => {
                const song = await nextSong();
                if (song != null) {
                  playSong(song, "Direct", false);
                  BackgroundThread.run(() => {
                    prepareUI(song);
                  }, BackgroundThreadPriority.MIN);
                }
              }}
            />
          </View>

          {/* Seek backward/forward */}
          <View style={{ flexDirection: "row" }}>
            <TouchableOpacity
              style={styles.buttonWrapper}
              onPress={async () => {
                const position = await TrackPlayer.getPosition();
                const newPosition = position - parseInt(seekBackwardAmount);
                if (newPosition > 0) await TrackPlayer.seekTo(newPosition);
                else                 await TrackPlayer.seekTo(0);
              }}
              onLongPress={() => {
                let newValues;

                switch (seekBackwardAmount) {
                  case "5":
                    newValues = "10 " + seekForwardAmount;
                    setSeekBackwardAmount("10");
                    break;
                  case "10":
                    newValues = "15 " + seekForwardAmount;
                    setSeekBackwardAmount("15");
                    break;
                  case "15":
                    newValues = "5 " + seekForwardAmount;
                    setSeekBackwardAmount("5");
                    break;
                }

                const seekValues = fs.DocumentDirectoryPath + "/.seekValues";
                fs.writeFile(seekValues, newValues, "utf8")
                .then((success) => { return; })
                .catch((error) => { console.log(error); });
              }}
            >
              <Image
                style={styles.buttonImage}
                source={{ uri: "asset:/img/SeekBackward.png" }}
              />
              <Text
                style={[
                  styles.text,
                  {
                    position: "absolute",
                    alignSelf: "center",
                    paddingBottom: 2
                  }
                ]}
              >{seekBackwardAmount}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.buttonWrapper}
              onPress={async () => {
                const position = await TrackPlayer.getPosition();
                const duration = await TrackPlayer.getDuration();
                const newPosition = position + parseInt(seekForwardAmount);
                if (newPosition < duration) await TrackPlayer.seekTo(newPosition);
              }}
              onLongPress={() => {
                let newValues;

                switch (seekForwardAmount) {
                  case "5":
                    newValues = seekBackwardAmount + " 10";
                    setSeekForwardAmount("10");
                    break;
                  case "10":
                    newValues = seekBackwardAmount + " 15";
                    setSeekForwardAmount("15");
                    break;
                  case "15":
                    newValues = seekBackwardAmount + " 5";
                    setSeekForwardAmount("5");
                    break;
                }

                const seekValues = fs.DocumentDirectoryPath + "/.seekValues";
                fs.writeFile(seekValues, newValues, "utf8")
                .then((success) => { return; })
                .catch((error) => { console.log(error); });
              }}
            >
              <Image
                style={styles.buttonImage}
                source={{ uri: "asset:/img/SeekForward.png" }}
              />
              <Text
                style={[
                  styles.text,
                  {
                    position: "absolute",
                    alignSelf: "center",
                    paddingBottom: 2
                  }
                ]}
              >{seekForwardAmount}</Text>
            </TouchableOpacity>
          </View>

        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  text: {
    fontFamily: "Roboto-Regular",
    fontSize: 30,
    color: "#7393B3",
    marginTop: 5,
    marginBottom: 5
  },
  buttonWrapper: {
    width: (Dimensions.get("window").width * (3 / 4)) / 4,
    height: (Dimensions.get("window").width * (3 / 4)) / 4,
    justifyContent: "center"
  },
  buttonImage: {
    width: (Dimensions.get("window").width * (3 / 4)) / 4,
    height: (Dimensions.get("window").width * (3 / 4)) / 4,
    alignSelf: "center"
  }
});

export default React.memo(SongControl);
