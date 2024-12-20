import axios from "axios";
import getEnv from "./env";

const {
  SPOTIFY_API: { TOP_TRACKS_API, ALBUM_TRACK_API_GETTER },
} = getEnv();

const ERROR_ALERT = new Error(
  "Oh no! Something went wrong; probably a malformed request or a network error.\nCheck console for more details."
);

/* Pulls out the relevant data from the API response and puts it in a nicely structured object. */
const formatter = (data) =>
  data.map((val) => {
    const artists = val.artists?.map((artist) => ({ name: artist.name }));
    // returning undefined for now to not confuse students, ideally a fix would be a hosted version of this
    return {
      songTitle: val.name,
      songArtists: artists,
      albumName: val.album?.name,
      imageUrl: val.album?.images[0]?.url ?? undefined,
      duration: val.duration_ms,
      externalUrl: val.external_urls?.spotify ?? undefined,
      previewUrl: val.preview_url ?? undefined,
    };
  });

/* Fetches data from the given endpoint URL with the access token provided. */
const fetcher = async (url, token) => {
  try {
    return await axios(url, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    });
  } catch (error) {
    console.log(error);
  }
};

/* Fetches your top tracks from the Spotify API.
 * Make sure that TOP_TRACKS_API is set correctly in env.js */
export const getMyTopTracks = async (token, limit = 20, offset = 0, timeRange = "medium_term") => {
  try {
    const url = `${TOP_TRACKS_API}?limit=${limit}&offset=${offset}&time_range=${timeRange}`;
    const res = await fetcher(url, token);
    return formatter(res.data.items);
  } catch (e) {
    console.error(e);
    alert(ERROR_ALERT);
    return null;
  }
};

export const getMyTopArtists = async (token, limit = 20, offset = 0, timeRange = "medium_term") => {
  try {
    const url = `${TOP_TRACKS_API.replace("tracks", "artists")}?limit=${limit}&offset=${offset}&time_range=${timeRange}`;
    const res = await fetcher(url, token);
    // Format the response specifically for artists
    return res.data.items.map((artist) => ({
      id: artist.id,
      name: artist.name,
      imageUrl: artist.images?.[0]?.url ?? null, // Use the first image if available
    }));
  } catch (e) {
    console.error(e);
    alert(ERROR_ALERT);
    return [];
  }
};

/* Fetches the given album from the Spotify API.
 * Make sure that ALBUM_TRACK_API_GETTER is set correctly in env.js */
export const getAlbumTracks = async (albumId, token) => {
  try {
    const res = await fetcher(ALBUM_TRACK_API_GETTER(albumId), token);
    const transformedResponse = res.data?.tracks?.items?.map((item) => {
      item.album = { images: res.data?.images, name: res.data?.name };
      return item;
    });
    return formatter(transformedResponse);
  } catch (e) {
    /* console.error(e);
    * alert(ERROR_ALERT); */
    return null;
  }
};
