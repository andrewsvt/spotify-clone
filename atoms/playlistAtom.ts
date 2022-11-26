import { atom } from 'recoil';

export const playlistState = atom<SpotifyApi.SinglePlaylistResponse | null>({
  key: 'playlistState',
  default: null,
});

export const playlistIdState = atom<string | null>({
  key: 'playlistIdState',
  default: null,
});
