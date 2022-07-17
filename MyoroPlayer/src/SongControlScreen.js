import React from 'react';
import {
  View,
  Dimensions,
  Text,
  StyleSheet
} from 'react-native';

import SongControlButton from "./SongControlButton.js";

const SongControlScreen = ({ route, navigation }) => {
  React.useEffect(() => {
    const onLoad = navigation.addListener("focus", () => {
      if (route.params != undefined) {
        alert(route.params.name + "\n\n" + route.params.directory);
      }
    });
    return onLoad;
  });

  return (
    <View
      style={{
        width: "100%",
        height: "100%"
      }}
    >
      {/* Sizer for the back & more options buttons */}
      <View
        style={{
          width: "90%",
          height: 60,
          position: "absolute",
          alignSelf: "center",
          top: 10
        }}
      >
        <SongControlButton
          src={"asset:/img/SongControlBack.png"}
          sizerStyle={styles.backButtonSizer}
          imageStyle={styles.backButtonImage}
        />
        <SongControlButton
          src={"asset:/img/SongControlOptions.png"}
          sizerStyle={styles.moreOptionsSizer}
          imageStyle={styles.moreOptionsImage}
        />
      </View>

      {/* Displays which playlist this is being played from */}
      <Text
        style={{
          fontFamily: "iosevka-regular",
          fontSize: 30,
          color: "#7393B3",
          position: "absolute",
          alignSelf: "center",
          top: 80
        }}
      >
        Playlist #1
      </Text>

      {/* Where the album cover will be displayed */}
      <View
        style={{
          width: 300,
          height: 300,
          backgroundColor: "#7393B3",
          position: "absolute",
          alignSelf: "center",
          top: 130
        }}
      >
      </View>

      {/* Displays the song name */}
      <Text
        style={{
          fontFamily: "iosevka-regular",
          fontSize: 30,
          color: "#7393B3",
          position: "absolute",
          alignSelf: "center",
          bottom: 180
        }}
      >
        Madvillian - Raid
      </Text>

      {/* Main music controls (shuffle, previous, play, and next */}
      <View
        style={{
          flexDirection: "row",
          width: 300,
          height: 75,
          position: "absolute",
          bottom: 50,
          alignSelf: "center"
        }}
      >
        <SongControlButton
          src={"asset:/img/Shuffle.png"}
          sizerStyle={styles.mainControlSizer}
          imageStyle={styles.mainControlImage}
        />
        <SongControlButton
          src={"asset:/img/Previous.png"}
          sizerStyle={styles.mainControlSizer}
          imageStyle={styles.mainControlImage}
        />
        <SongControlButton
          src={"asset:/img/Play.png"}
          sizerStyle={styles.mainControlSizer}
          imageStyle={styles.mainControlImage}
        />
        <SongControlButton
          src={"asset:/img/Next.png"}
          sizerStyle={styles.mainControlSizer}
          imageStyle={styles.mainControlImage}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  // Style for: shuffle, previous, play, and next's sizer
  mainControlSizer: {
    width: 75,
    height: 75,
    justifyContent: "center"
  },
  // Style for: shuffle, previous, play, and next's image
  mainControlImage: {
    width: 60,
    height: 60,
    alignSelf: "center"
  },
  backButtonSizer: {
    width: 60,
    height: 60,
    position: "absolute",
    left: 0,
    justifyContent: "center"
  },
  backButtonImage: {
    width: 60,
    height: 60,
    alignSelf: "center"
  },
  moreOptionsSizer: {
    width: 60,
    height: 60,
    position: "absolute",
    right: 0,
    justifyContent: "center"
  },
  moreOptionsImage: {
    width: 60,
    height: 60,
    alignSelf: "center"
  }
});

export default SongControlScreen;
