import { StatusBar } from "expo-status-bar";
import { SafeAreaView, StyleSheet, Text, View } from "react-native";
import { MusicPlayer } from "./src/components/MusicPlayer";
import { ActionBar } from "./src/components/ActionBar";

export default function App() {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      <MusicPlayer />
      <ActionBar />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#16213E",
    alignItems: "center",
    justifyContent: "center",
  },
});
