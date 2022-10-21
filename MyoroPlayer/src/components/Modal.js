import React from "react";
import {
  Modal,
  View,
  TouchableWithoutFeedback,
  StyleSheet
} from "react-native";

import ListButton from "./ListButton.js";


const ModalComponent = ({
  showModal,
  setShowModal,
  modalSelection,
  isPlaylistScreen,
  deletePlaylistOnPress,
  queueOnPress
}) => (
  <Modal
    animationType="slide"
    transparent={true}
    visible={showModal}
    onRequestClose={() => setShowModal(false)}
  >
    <TouchableWithoutFeedback onPress={() => setShowModal(false)}>
      <View style={{ flex: 1 }}></View>
    </TouchableWithoutFeedback>

    <View>
      {
        isPlaylistScreen
        &&
        <View style={styles.divider}></View>
      }
      {
        isPlaylistScreen
        &&
        <ListButton
          wrapperStyle={styles.buttonWrapper}
          textStyle={styles.buttonText}
          text={"Delete Playlist"}
          onPress={deletePlaylistOnPress}
        />
      }

      {
        !isPlaylistScreen
        &&
        <View style={styles.divider}></View>
      }
      {
        !isPlaylistScreen
        &&
        <ListButton
          wrapperStyle={styles.buttonWrapper}
          textStyle={styles.buttonText}
          text={"Queue Song"}
          onPress={queueOnPress}
        />
      }
    </View>
  </Modal>
);

const styles = StyleSheet.create({
  divider: {
    width: "100%",
    height: 3,
    backgroundColor: "#7393B3"
  },
  buttonWrapper: {
    width: "100%",
    paddingTop: 7,
    paddingBottom: 7,
    backgroundColor: "#FFFFFF"
  },
  buttonText: {
    fontFamily: "Roboto-Regular",
    fontSize: 25,
    color: "#7393B3",
    alignSelf: "center"
  }
});

export default React.memo(ModalComponent);
