import { Dimensions, StyleSheet, TouchableOpacity, View } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";

const { width } = Dimensions.get("window");
export const ActionBar = () => {
  return (
    <View style={styles.container}>
      <View style={styles.actionsWrapper}>
        <TouchableOpacity
          onPress={() => {
            console.log("opa");
          }}
        >
          <Ionicons name="heart-outline" size={30} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => {}}>
          <Ionicons name="repeat" size={30} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => {}}>
          <Ionicons name="share-outline" size={30} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => {}}>
          <Ionicons name="ellipsis-horizontal" size={30} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: width,
    borderTopColor: "#fcfcfc",
    borderWidth: 1,
    paddingVertical: 16,
    alignItems: "center",
  },
  actionsWrapper: {
    width: "80%",
    justifyContent: "space-between",
    flexDirection: "row",
    alignItems: "center",
  },
});
