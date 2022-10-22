import React from "react";
import {
  TouchableOpacity,
  View,
  Image,
  StyleSheet,
  Dimensions
} from "react-native";
import TextTicker from "react-native-text-ticker";

import Button from "./Button.js";

const MiniPlayer = ({
  onPress,
  albumCover,
  songName,
  playSrc,
  previousOnPress,
  playOnPress,
  nextOnPress
}) => (
  <TouchableOpacity
    style={{
      width: "100%",
      borderTopColor: "#7393B3",
      borderTopWidth: 3,
      flexDirection: "row",
      alignItems: "center"
    }}
    onPress={onPress}
  >
    <Image
      style={{
        width: 50,
        height: 50,
        borderRadius: 10,
        marginTop: 5,
        marginBottom: 5,
        marginLeft: 10,
        marginRight: 10
      }}
      source={{ uri: albumCover }}
    />

    <TextTicker
      style={{
        width: Dimensions.get("window").width - 220,
        fontFamily: "Roboto-Regular",
        fontSize: 25,
        color: "#7393B3"
      }}
    >{songName}</TextTicker>

    <View style={{ flexDirection: "row" }}>
      <Button
        wrapperStyle={styles.buttonWrapper}
        imageStyle={styles.buttonImage}
        src={"asset:/img/Previous.png"}
        onPress={previousOnPress}
      />
      <Button
        wrapperStyle={styles.buttonWrapper}
        imageStyle={styles.buttonImage}
        src={playSrc}
        onPress={playOnPress}
      />
      <Button
        wrapperStyle={styles.buttonWrapper}
        imageStyle={styles.buttonImage}
        src={"asset:/img/Next.png"}
        onPress={nextOnPress}
      />
    </View>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  buttonWrapper: {
    width: 50,
    height: 50,
    justifyContent: "center"
  },
  buttonImage: {
    width: 40,
    height: 40,
    alignSelf: "center"
  }
});

export default React.memo(MiniPlayer);
