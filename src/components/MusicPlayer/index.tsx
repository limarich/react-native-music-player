import {
  Text,
  View,
  StyleSheet,
  Image,
  FlatList,
  Dimensions,
  Animated,
  TouchableOpacity,
} from "react-native";
import { Musics } from "../../data";
import { useEffect, useRef, useState } from "react";
import Slider from "@react-native-community/slider";
import Ionicons from "react-native-vector-icons/Ionicons";

const { width } = Dimensions.get("window");
export const MusicPlayer = () => {
  const scrollX = useRef(new Animated.Value(0)).current;
  const musicSlider = useRef(null);

  const [musicIndex, setMusicIndex] = useState(0);

  useEffect(() => {
    scrollX.addListener(({ value }) => {
      const index = Math.round(value / width);
      setMusicIndex(index);
    });
    return () => {
      scrollX.removeAllListeners();
    };
  }, []);

  const nextMusic = () => {
    musicSlider.current.scrollToOffset({
      offset: (musicIndex + 1) * width,
    });
  };
  const previousMusic = () => {
    musicSlider.current.scrollToOffset({
      offset: (musicIndex - 1) * width,
    });
  };

  return (
    <View style={styles.container}>
      <Animated.FlatList
        ref={musicSlider}
        data={Musics}
        renderItem={renderMusic}
        scrollEnabled
        horizontal
        keyExtractor={(item) => item.author}
        showsHorizontalScrollIndicator={false}
        scrollEventThrottle={16}
        onScroll={Animated.event(
          [
            {
              nativeEvent: {
                contentOffset: { x: scrollX },
              },
            },
          ],
          { useNativeDriver: true }
        )}
      />
      <View style={styles.musicDescription}>
        <Text style={styles.musicName}>{Musics[musicIndex].name}</Text>
        <Text style={styles.musicAuthor}>{Musics[musicIndex].author}</Text>
      </View>
      <View>
        <Slider
          value={2}
          minimumValue={0}
          maximumValue={5}
          thumbTintColor="#c0c0c0"
          minimumTrackTintColor="#c0c0c0"
          maximumTrackTintColor="#c0c0c0"
          onSlidingComplete={() => {}}
          style={styles.musicProgressBar}
        />
        <View style={styles.musicControllers}>
          <TouchableOpacity onPress={previousMusic}>
            <Ionicons name="play-skip-back-outline" size={32} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => {}}>
            <Ionicons name="pause-circle" size={64} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity onPress={nextMusic}>
            <Ionicons name="play-skip-forward-outline" size={32} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const renderMusic = ({ item, index }: any) => {
  return (
    <Animated.View
      style={{
        width: width,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <View style={{ ...styles.imageWrapper }}>
        <Image style={styles.image} source={item.image} />
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  imageWrapper: {
    width: 300,
    height: 300,
    marginBottom: 25,
    shadowColor: "#fff",
    shadowOffset: {
      width: 5,
      height: 5,
    },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 5,
    borderRadius: 15,
  },
  image: {
    width: "100%",
    height: "100%",
    borderRadius: 15,
    marginBottom: 20,
  },
  musicDescription: {
    justifyContent: "center",
    marginBottom: 16,
  },
  musicName: {
    textAlign: "center",
    fontWeight: "600",
    color: "#fcfcfc",
    fontSize: 24,
  },
  musicAuthor: {
    textAlign: "center",
    justifyContent: "center",
    fontWeight: "200",
    color: "#fcfcfc",
    fontSize: 16,
  },
  musicProgressBar: {
    width: 350,
  },
  musicControllers: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 16,
    marginBottom: 24,
  },
});
