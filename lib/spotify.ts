import SpotifyWebApi from "spotify-web-api-node";

const scope = [
  'ugc-image-upload',
  'user-read-playback-state',
  'app-remote-control',
  'user-modify-playback-state',
  'playlist-read-private',
  'user-follow-modify',
  'playlist-read-collaborative',
  'user-follow-read',
  'user-read-currently-playing',
  'user-read-playback-position',
  'user-library-modify',
  'playlist-modify-private',
  'playlist-modify-public',
  'user-read-email',
  'user-top-read',
  'streaming',
  'user-read-recently-played',
  'user-read-private',
  'user-library-read'
].join(',');

const queryParamString = new URLSearchParams({ scope: scope });

const LOGIN_URL = `https://accounts.spotify.com/authorize?${queryParamString.toString()}`;

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.NEXT_PUBLIC_CLIENT_ID,
  clientSecret: process.env.NEXT_PUBLIC_CLIENT_SECRET,
});

export { LOGIN_URL, spotifyApi }