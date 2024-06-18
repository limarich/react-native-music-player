import { Track } from "react-native-track-player";

export interface CustomTrackProps extends Track {
  id: number;
}

export const Musics: CustomTrackProps[] = [
  {
    title: "Thunderstruck",
    artist: "AC/DC",
    artwork: require("../assets/acdc-black.jpg"),
    id: 1,
    url: require("../assets/A1-Thunderstruck_01.mp3"),
    duration: 4 * 60 + 50,
  },
  {
    title: "Thunder",
    artist: "Imagine Dragons",
    artwork: require("../assets/imagine-dragons-evolve.jpg"),
    id: 2,
    url: require("../assets/Imagine Dragons - Thunder.mp3"),
    duration: 3 * 60 + 24,
  },
];
