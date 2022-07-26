import React from 'react';
import {
  View,
  Dimensions
} from 'react-native';

const SongView = ({}) => {
  return (
    <View
      style={{
        width: "100%",
        height: "100%",
        backgroundColor: "#EDE6D6"
      }}
    >
      <View
        style={{
          width: "100%",
          height: Dimensions.get("window").height - (Dimensions.get("window").width / 4),
          backgroundColor: "coral"
        }}
      >
      </View>
      <View
        style={{
          width: "100%",
          height: Dimensions.get("window").width / 4,
          backgroundColor: "pink"
        }}
      >
      </View>
    </View>
  );
};

export default SongView;
