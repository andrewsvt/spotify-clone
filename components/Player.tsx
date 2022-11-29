import type { NextPage } from 'next';

import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import useSongInfo from '../hooks/useSongInfo';
import useSpotify from '../hooks/useSpotify';

import { useRecoilState } from 'recoil';
import { currentTrackIdState, isPlayingState } from '../atoms/songAtom';

const Player: NextPage = () => {
  const { spotifyApi } = useSpotify();

  const { data: session, status } = useSession();

  const [currentTrackId, setCurrentTrackId] = useRecoilState(currentTrackIdState);
  const [isPlaying, setPalying] = useRecoilState(isPlayingState);
  const [volume, setVolume] = useState<number>(50);

  const songInfo = useSongInfo();

  const fetchCurrentSong = async () => {
    if (!songInfo) {
      spotifyApi.getMyCurrentPlayingTrack().then((data: any) => {
        console.log('now playing ', data.body?.item);
        setCurrentTrackId(data.body?.item?.id);
      });

      spotifyApi.getMyCurrentPlaybackState().then((data) => {
        setPalying(data.body?.is_playing);
      });
    }
  };

  useEffect(() => {
    if (spotifyApi.getAccessToken() && !currentTrackId) {
      fetchCurrentSong();
      // setVolume(50);
    }
  }, [currentTrackId, spotifyApi, session]);

  return (
    <div className="grid grid-cols-3 items-center px-2 h-[5.5rem] text-xs text-white bg-[#181818] border-t border-[#282828] md:px-5 md:text-base">
      <div className="flex item-center space-x-3">
        <img className="hidden md:inline w-14 h-14" src={songInfo?.album?.images?.[0].url} alt="" />
        <div className="flex justify-center flex-col">
          <h3 className="text-sm">{songInfo?.name}</h3>
          <span className="text-xs text-gray-500">{songInfo?.artists?.[0]?.name}</span>
        </div>
      </div>
      <div></div>
      <div></div>
    </div>
  );
};

export default Player;
