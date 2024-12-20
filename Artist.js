import React from "react";
import { View, Text, StyleSheet, Image, Dimensions } from "react-native";
import { Themes } from "./assets/Themes";

const screenWidth = Dimensions.get('window').width;

const Artist = ({ item, index }) => {
  return (
    <View style={styles.artistContainer}>
      <Text style={styles.artistIndex}>{index + 1}</Text>
      {item.imageUrl ? (
        <Image source={{ uri: item.imageUrl }} style={styles.artistImage} />
      ) : (
        <View style={styles.placeholderImage} />
      )}
      <Text style={styles.artistName} numberOfLines={1}>{item.name}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  artistContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: screenWidth, // Full screen width
    paddingVertical: 10, // Vertical padding for spacing
    borderBottomColor: Themes.colors.darkGray,
    borderBottomWidth: 1, // Divider line takes up the full width
    paddingHorizontal: 10, // Padding for the container
  },
  artistIndex: {
    fontSize: 14,
    color: Themes.colors.gray,
    width: 30, // Fixed width for consistent alignment
    textAlign: "center",
  },
  artistImage: {
    width: 50,
    height: 50,
    borderRadius: 25, // Circular image
    marginRight: 15, // Spacing between image and text
  },
  placeholderImage: {
    width: 50,
    height: 50,
    backgroundColor: Themes.colors.darkGray,
    borderRadius: 25,
    marginRight: 15,
  },
  artistName: {
    fontSize: 16,
    fontWeight: "bold",
    color: Themes.colors.white,
    flex: 1, // Take up remaining space
  },
});

export default Artist;
