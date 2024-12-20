import React from "react";
import { View, Text, StyleSheet, Dimensions, Image } from "react-native";
import { Themes } from "./assets/Themes";
import millisToMinutesAndSeconds from "./utils/millisToMinutesAndSeconds";

const screenWidth = Dimensions.get('window').width;

const Song = ({ item, index }) => {
    return (
      <View style={styles.songContainer}>
        <Text style={styles.songIndex}>{index + 1}</Text>
  
        <Image source={{ uri: item.imageUrl }} style={styles.albumImage} />

        <View style={styles.songInfo}>
          <Text style={styles.songTitle} numberOfLines={1}>{item.songTitle}</Text>
          <Text style={styles.songArtist} numberOfLines={1}>
            {item.songArtists.map(artist => artist.name).join(", ")}
          </Text>
        </View>
  
        <View style={styles.albumAndDuration}>
          <Text style={styles.albumName} numberOfLines={1}>{item.albumName}</Text>
          <Text style={styles.duration}>{millisToMinutesAndSeconds(item.duration)}</Text>
        </View>
      </View>
    );
  };
  
  const styles = StyleSheet.create({
    songContainer: {
      flexDirection: "row",
      alignItems: "center",
      width: screenWidth,
      height: 70,
      paddingHorizontal: 10,
      borderBottomColor: Themes.colors.darkGray,
      borderBottomWidth: 1,
    },
    songIndex: {
      fontSize: 14,
      color: Themes.colors.gray,
      width: 25,
      textAlign: "left",
    },
    albumImage: {
      width: 50,
      height: 50,
      marginRight: 10,
      marginLeft: 3,
    },
    songInfo: {
      flex: 3,
      justifyContent: "center",
      paddingRight: 10,
      width: screenWidth / 2,
    },
    songTitle: {
      fontSize: 16,
      fontWeight: "bold",
      color: Themes.colors.white,
    },
    songArtist: {
      fontSize: 14,
      color: Themes.colors.gray,
    },
    albumAndDuration: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      width: screenWidth / 3.5,
    },
    albumName: {
      fontSize: 13,
      color: Themes.colors.white,
      marginRight: 10,
      width: screenWidth / 5,
    },
    duration: {
      fontSize: 12,
      color: Themes.colors.gray,
    },
  });

export default Song;