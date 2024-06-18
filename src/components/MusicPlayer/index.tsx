import {
  Text,
  View,
  StyleSheet,
  Image,
  Dimensions,
  Animated,
  TouchableOpacity,
  ListRenderItem,
} from "react-native";
import { CustomTrackProps, Musics } from "../../data";
import { useEffect, useRef, useState } from "react";
import Slider from "@react-native-community/slider";
import Ionicons from "react-native-vector-icons/Ionicons";
import TrackPlayer, {
  Capability,
  PlaybackState,
  State,
  usePlaybackState,
  useProgress,
  Event,
  useTrackPlayerEvents,
  Track,
} from "react-native-track-player";

const { width } = Dimensions.get("window");
const setupPlayer = async () => {
  await TrackPlayer.setupPlayer();

  await TrackPlayer.updateOptions({
    capabilities: [
      Capability.Play,
      Capability.Pause,
      Capability.SkipToNext,
      Capability.SkipToPrevious,
    ],
  });
  await TrackPlayer.add(Musics);
};

const togglePlayback = async (playbackState: PlaybackState) => {
  const currentTrack = await TrackPlayer.getActiveTrackIndex();
  if (currentTrack !== null) {
    if (playbackState.state === State.Paused) {
      await TrackPlayer.play();
    } else {
      await TrackPlayer.pause();
    }
  }
};

const nextTrackMusic = async (trackId: number) => {
  await TrackPlayer.stop();
  await TrackPlayer.skip(trackId);
  await TrackPlayer.play();
};

export const MusicPlayer = () => {
  const scrollX = useRef(new Animated.Value(0)).current;
  const musicSlider = useRef(null);
  const progress = useProgress();
  const playbackState = usePlaybackState();

  const [musicProgress, setMusicProgress] = useState(0);
  const [currentTrack, setCurrentTrack] = useState<CustomTrackProps | null>(
    null
  );
  const [isLastTrack, setIsLastTrack] = useState(false);
  const [isFirstTrack, setIsFirstTrack] = useState(true);

  useEffect(() => {
    setupPlayer();

    async () => {
      const track = await TrackPlayer.getActiveTrack();
      const index = await TrackPlayer.getActiveTrackIndex();
      if (index !== undefined && track !== undefined) {
        setCurrentTrack({
          ...track,
          id: index,
        });
      }
    };
    scrollX.addListener(({ value }) => {
      const index = Math.round(value / width);
      nextTrackMusic(index);
    });
    return () => {
      scrollX.removeAllListeners();
    };
  }, []);

  useEffect(() => {
    setMusicProgress(progress.position);
  }, [progress.position, progress.duration]);

  const nextMusic = async () => {
    await TrackPlayer.skipToNext();
    const index = await TrackPlayer.getActiveTrackIndex();

    if (index !== undefined) {
      musicSlider.current.scrollToOffset({
        offset: index * width,
      });
    }

    await TrackPlayer.play();
  };
  const previousMusic = async () => {
    await TrackPlayer.skipToPrevious();
    const index = await TrackPlayer.getActiveTrackIndex();

    if (index !== undefined) {
      musicSlider.current.scrollToOffset({
        offset: index * width,
      });
    }
    await TrackPlayer.play();
  };

  useTrackPlayerEvents(
    [Event.PlaybackActiveTrackChanged, Event.PlaybackState],
    async (event) => {
      if (
        event.type === Event.PlaybackActiveTrackChanged ||
        event.type === Event.PlaybackState
      ) {
        const track = await TrackPlayer.getActiveTrack();
        const index = await TrackPlayer.getActiveTrackIndex();
        if (index !== undefined && track !== undefined) {
          setCurrentTrack({
            ...track,
            id: index,
          });

          if (index === 0) {
            setIsFirstTrack(true);
          } else {
            setIsFirstTrack(false);
          }

          if (index - (Musics.length - 1) === 0) {
            setIsLastTrack(true);
          } else {
            setIsLastTrack(false);
          }
        }
      }
    }
  );

  return (
    <View style={styles.container}>
      <Animated.FlatList
        ref={musicSlider}
        data={Musics}
        renderItem={renderMusic}
        scrollEnabled
        horizontal
        keyExtractor={(item) => `${item.id}-${item.artist}`}
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
        <Text style={styles.musicName}>{currentTrack?.title ?? ""}</Text>
        <Text style={styles.musicAuthor}>{currentTrack?.artist ?? ""}</Text>
      </View>
      <View>
        <Slider
          value={progress.position}
          maximumValue={progress.duration}
          thumbTintColor="#c0c0c0"
          minimumTrackTintColor="#c0c0c0"
          maximumTrackTintColor="#c0c0c0"
          onSlidingComplete={async (value) => {
            await TrackPlayer.seekTo(value);
            await TrackPlayer.play();
          }}
          onValueChange={(value) => setMusicProgress(value)}
          style={styles.musicProgressBar}
        />
        <View style={styles.musicProgressIndicator}>
          <Text style={{ color: "#fff" }}>
            {new Date(musicProgress * 1000).toISOString().slice(14, 19)}
          </Text>
          <Text style={{ color: "#fff" }}>
            {new Date(progress.duration * 1000).toISOString().slice(14, 19)}
          </Text>
        </View>
        <View style={styles.musicControllers}>
          <TouchableOpacity
            onPress={() => {
              if (!isFirstTrack) previousMusic();
            }}
          >
            <Ionicons
              name="play-skip-back-outline"
              size={32}
              color={isFirstTrack ? "#515151" : "#fff"}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              togglePlayback(playbackState as PlaybackState);
            }}
          >
            <Ionicons
              name={
                State.Playing === playbackState.state
                  ? "pause-circle"
                  : "play-circle"
              }
              size={64}
              color="#fff"
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              if (!isLastTrack) nextMusic();
            }}
          >
            <Ionicons
              name="play-skip-forward-outline"
              size={32}
              color={isLastTrack ? "#515151" : "#fff"}
            />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const renderMusic: ListRenderItem<Track> = ({ item }) => {
  return (
    <Animated.View
      style={{
        width: width,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <View style={styles.imageWrapper}>
        <Image style={styles.image} source={item.artwork} />
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
  musicProgressIndicator: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
});
