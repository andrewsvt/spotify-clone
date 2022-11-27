import { atom } from 'recoil';

export const playlistState = atom<SpotifyApi.SinglePlaylistResponse | undefined>({
  key: 'playlistState',
  default: undefined,
});

export const currentPlaylistIdState = atom<string>({
  key: 'currentPlaylistIdState',
  default: '3P1RRktaaEBcMhdLlBcPyU',
});
