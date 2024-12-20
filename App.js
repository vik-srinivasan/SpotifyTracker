import { useState, useEffect } from "react";
import { Pressable, StyleSheet, SafeAreaView, Text, FlatList, Image, View, ActivityIndicator } from "react-native";
import { useSpotifyAuth } from "./utils";
import { Themes } from "./assets/Themes";
import Song from "./Song";
import Artist from "./Artist";
import { getMyTopTracks, getMyTopArtists } from "./utils/apiOptions";

export default function App() {
  const { token, getSpotifyAuth } = useSpotifyAuth();
  const [data, setData] = useState([]);
  const [offset, setOffset] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [timeRange, setTimeRange] = useState("medium_term");
  const [type, setType] = useState("tracks"); // "tracks" or "artists"
  const [fetchKey, setFetchKey] = useState(0); // Key to force re-fetch
  const limit = 20;

  const fetchData = async () => {
    if (!hasMore || isLoading) return;
    setIsLoading(true);

    try {
      const apiFunction = type === "tracks" ? getMyTopTracks : getMyTopArtists;
      const newData = await apiFunction(token, limit, offset, timeRange);
      setData(offset === 0 ? newData : (prevData) => [...prevData, ...newData]);
      setOffset((prevOffset) => prevOffset + limit);
      if (newData.length < limit) setHasMore(false);
    } catch (error) {
      console.error(error);
      setHasMore(false);
    }
    setIsLoading(false);
  };

  const handleTimeRangeChange = (newRange) => {
    setTimeRange(newRange);
    setData([]); // Clear data for a new fetch
    setOffset(0);
    setHasMore(true);
    setFetchKey((prevKey) => prevKey + 1); // Trigger re-fetch
  };

  const handleTypeChange = (newType) => {
    setType(newType);
    setData([]); // Clear data for a new fetch
    setOffset(0);
    setHasMore(true);
    setFetchKey((prevKey) => prevKey + 1); // Trigger re-fetch
  };

  useEffect(() => {
    if (token) {
      fetchData();
    }
  }, [token, timeRange, type, fetchKey]); // Include fetchKey in dependencies

  return (
    <SafeAreaView style={styles.container}>
      {token ? (
        <>
          <View style={styles.header}>
            <Image source={require("./assets/spotify-logo.png")} style={styles.headerLogo} />
            <Text style={styles.headerText}>My Top {type === "tracks" ? "Tracks" : "Artists"}</Text>

            <View style={styles.toggleButtons}>
              <Pressable
                style={[styles.toggleButton, type === "tracks" && styles.activeButton]}
                onPress={() => handleTypeChange("tracks")}
              >
                <Text style={styles.toggleText}>Songs</Text>
              </Pressable>
              <Pressable
                style={[styles.toggleButton, type === "artists" && styles.activeButton]}
                onPress={() => handleTypeChange("artists")}
              >
                <Text style={styles.toggleText}>Artists</Text>
              </Pressable>
            </View>
            <View style={styles.filterButtons}>
              <Pressable
                style={[styles.filterButton, timeRange === "long_term" && styles.activeButton]}
                onPress={() => handleTimeRangeChange("long_term")}
              >
                <Text style={styles.filterText}>~2 Years</Text>
              </Pressable>
              <Pressable
                style={[styles.filterButton, timeRange === "medium_term" && styles.activeButton]}
                onPress={() => handleTimeRangeChange("medium_term")}
              >
                <Text style={styles.filterText}>~6 Months</Text>
              </Pressable>
              <Pressable
                style={[styles.filterButton, timeRange === "short_term" && styles.activeButton]}
                onPress={() => handleTimeRangeChange("short_term")}
              >
                <Text style={styles.filterText}>~1 Month</Text>
              </Pressable>
            </View>
          </View>
          <FlatList
            data={data}
            keyExtractor={(item, index) => item.id ? item.id : index.toString()}
            renderItem={({ item, index }) =>
              type === "tracks" ? <Song item={item} index={index} /> : <Artist item={item} index={index} />
            }
            onEndReached={fetchData}
            ListFooterComponent={isLoading && <ActivityIndicator size="large" color={Themes.colors.spotify} />}
          />
        </>
      ) : (
        <Pressable style={styles.authButton} onPress={() => getSpotifyAuth()}>
          <Image source={require("./assets/spotify-logo.png")} style={styles.spotifyLogo} />
          <Text style={styles.authText}>CONNECT WITH SPOTIFY</Text>
        </Pressable>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Themes.colors.background,
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
  },
  header: {
    flexDirection: "column",
    alignItems: "center",
    padding: 10,
  },
  headerLogo: {
    width: 24,
    height: 24,
    marginBottom: 5,
  },
  headerText: {
    fontSize: 20,
    fontWeight: "bold",
    color: Themes.colors.white,
  },
  authButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Themes.colors.spotify,
    padding: 8,
    borderRadius: 25,
  },
  authText: {
    color: Themes.colors.white,
    fontSize: 14,
    fontWeight: "bold",
    marginLeft: 5,
  },
  spotifyLogo: {
    width: 24,
    height: 24,
  },
  toggleButtons: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 10,
  },
  toggleButton: {
    padding: 10,
    borderRadius: 20,
    backgroundColor: Themes.colors.darkGray,
    marginHorizontal: 5,
  },
  activeButton: {
    backgroundColor: Themes.colors.spotify, // Highlight selected button
  },
  toggleText: {
    color: Themes.colors.white,
    fontWeight: "bold",
  },
  filterButtons: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 15,
  },
  filterButton: {
    padding: 10,
    borderRadius: 20,
    backgroundColor: Themes.colors.darkGray, // Default gray background
    marginHorizontal: 5,
  },
  filterText: {
    color: Themes.colors.white,
    fontWeight: "bold",
  },
});
