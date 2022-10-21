import React from "react";
import {
  View,
  Image,
  StyleSheet
} from "react-native";

import Button from "./Button.js";

const TopBar = ({
  showLogo,
  showBack,
  showSearch,
  backOnPress,
  searchOnPress
}) => (
  <View
    style={{
      width: "100%",
      height: 60,
      borderBottomColor: "#7393B3",
      borderBottomWidth: 3
    }}
  >
    {
      showLogo
      &&
      <View style={[ styles.wrapper, { left: 1.5 } ]}>
        <Image
          style={styles.image}
          source={{ uri: "asset:/img/Logo.png" }}
        />
      </View>
    }
    {
      showBack
      &&
      <Button
        wrapperStyle={styles.wrapper}
        imageStyle={[
          styles.image,
          { width: 50, height: 50, left: 1 }
        ]}
        src={"asset:/img/Back.png"}
        onPress={backOnPress}
      />
    }
    {
      showSearch
      &&
      <Button
        wrapperStyle={[
          styles.wrapper,
          { right: 0 }
        ]}
        imageStyle={styles.image}
        src={"asset:/img/Search.png"}
        onPress={searchOnPress}
      />
    }
  </View>
);

const styles = StyleSheet.create({
  wrapper: {
    width: 60,
    height: 60,
    justifyContent: "center",
    position: "absolute"
  },
  image: {
    width: 45,
    height: 45,
    alignSelf: "center"
  }
});

export default React.memo(TopBar);
