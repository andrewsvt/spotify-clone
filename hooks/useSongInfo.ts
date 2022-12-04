import { useEffect, useState, useCallback } from 'react';
import { useRecoilValue } from 'recoil';

import { currentTrackIdState } from '../atoms/songAtom';

import useSpotify from './useSpotify';

export default function useSongInfo() {
  const { spotifyApi } = useSpotify();

  const [songInfo, setSongInfo] = useState<SpotifyApi.SingleTrackResponse | null>(null);

  const currentTrackId = useRecoilValue(currentTrackIdState);

  const fetchSongInfo = useCallback(async () => {
    if (currentTrackId) {
      try {
        const response = await spotifyApi.getTrack(currentTrackId);
        if (response.body) {
          setSongInfo(response.body);
        }
      } catch (err) {
        console.log(err);
      }
    }
  }, [currentTrackId]);

  useEffect(() => {
    fetchSongInfo();
  }, [fetchSongInfo, spotifyApi]);

  return songInfo;
}
