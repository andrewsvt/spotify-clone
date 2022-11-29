import { atom } from 'recoil';

export const currentUserState = atom<SpotifyApi.CurrentUsersProfileResponse | null>({
  key: 'currentUserState',
  default: null,
});
