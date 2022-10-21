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

import TopBar from "../components/TopBar.js";
import Button from "../components/Button.js";

const SongControl = ({ navigation, route }) => {
  const [ playlistName, setPlaylistName ] = React.useState("1234567890");
  const [ songName, setSongName ] = React.useState("123");

  const [ sliderMaximumValue, setSliderMaximumValue ] = React.useState(100);
  const [ sliderCurrentValue, setSliderCurrentValue ] = React.useState(50);

  const [ seekBackwardAmount, setSeekBackwardAmount ] = React.useState(5);
  const [ seekForwardAmount, setSeekForwardAmount ] = React.useState(5);

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
          <TextTicker
            style={styles.text}
            duration={5750}
            repeatSpacer={30}
            easing={Easing.linear}
          >{playlistName}</TextTicker>

          {/* Album cover */}
          <Image
            style={{
              width: Dimensions.get("window").width * (3 / 4),
              height: Dimensions.get("window").width * (3 / 4),
              backgroundColor: "#7393B3",
              borderRadius: 10
            }}
          />

          {/* Song name */}
          <TextTicker
            style={styles.text}
            duration={5750}
            repeatSpacer={30}
            easing={Easing.linear}
          >{songName}</TextTicker>

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
              src={"asset:/img/Shuffle.png"}
              onPress={() => alert("Shuffle")}
            />
            <Button
              wrapperStyle={styles.buttonWrapper}
              imageStyle={styles.buttonImage}
              src={"asset:/img/Previous.png"}
              onPress={() => alert("Previous")}
            />
            <Button
              wrapperStyle={styles.buttonWrapper}
              imageStyle={styles.buttonImage}
              src={"asset:/img/Play.png"}
              onPress={() => alert("Play")}
            />
            <Button
              wrapperStyle={styles.buttonWrapper}
              imageStyle={styles.buttonImage}
              src={"asset:/img/Next.png"}
              onPress={() => alert("Next")}
            />
          </View>

          {/* Seek backward/forward */}
          <View style={{ flexDirection: "row" }}>
            <TouchableOpacity style={styles.buttonWrapper}>
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

            <TouchableOpacity style={styles.buttonWrapper}>
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
