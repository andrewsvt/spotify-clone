import { atom } from 'recoil';

export const currentTrackState = atom<SpotifyApi.TrackObjectFull | null>({
  key: 'currentTrackState',
  default: null,
});

export const playerState = atom<Spotify.Player | undefined>({
  key: 'playerState',
  default: undefined,
});

export const isPausedState = atom<boolean>({
  key: 'isPausedState',
  default: true,
});

export const isActiveState = atom<boolean>({
  key: 'isActiveState',
  default: false,
});