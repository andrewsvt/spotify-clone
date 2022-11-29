import useSpotify from './useSpotify';
import { useRecoilState } from 'recoil';
import { currentTrackIdState, isPlayingState } from '../atoms/songAtom';
import { useEffect, useState } from 'react';

export default function useSongInfo() {
  const { spotifyApi } = useSpotify();
  const [currentTrackId, setCurrentTrackId] = useRecoilState(currentTrackIdState);
  const [songInfo, setSongInfo] = useState<SpotifyApi.SingleTrackResponse | null>(null);

  const fetchSongInfo = async () => {
    if (currentTrackId) {
      const trackInfo = await fetch(`https://api.spotify.com/v1/tracks/${currentTrackId}`, {
        headers: {
          Authorization: `Bearer ${spotifyApi.getAccessToken()}`,
        },
      }).then((res) => res.json());

      setSongInfo(trackInfo);
    }
  };

  useEffect(() => {
    fetchSongInfo();
  }),
    [currentTrackId, spotifyApi];

  return songInfo;
}
