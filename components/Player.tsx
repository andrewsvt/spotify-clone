import type { NextPage } from 'next';
import { useCallback } from 'react';

import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import useSongInfo from '../hooks/useSongInfo';
import useSpotify from '../hooks/useSpotify';

import { useRecoilState, useRecoilValue } from 'recoil';
import { currentTrackIdState, isPlayingState } from '../atoms/songAtom';
import { debounce } from 'lodash';

const Player: NextPage = () => {
  const { spotifyApi } = useSpotify();

  const { data: session, status } = useSession();

  const [deviceId, setDeviceId] = useState<[string] | null>(null);
  const [currentTrackId, setCurrentTrackId] = useRecoilState(currentTrackIdState);
  const [isPlaying, setPlaying] = useRecoilState(isPlayingState);

  const [deviceIsActive, setDeviceIsActive] = useState<boolean>(false);
  const [replaying, isReplaying] = useState<boolean>(false);

  const [volume, setVolume] = useState<number>(50);

  const songInfo = useSongInfo();

  const getCurrentDevice = async () => {
    try {
      await spotifyApi.getMyDevices().then((res: any) => {
        setDeviceId([res.body.devices[0].id]);
      });
    } catch (err) {
      console.log(err);
    }
  };

  const fetchCurrentSong = useCallback(async () => {
    try {
      if (!songInfo) {
        spotifyApi.getMyCurrentPlayingTrack().then((res: any) => {
          console.log('now playing ', res.body?.item);
          setCurrentTrackId(res.body?.item?.id);
        });

        spotifyApi.getMyCurrentPlaybackState().then((res) => {
          setPlaying(res.body?.is_playing);
        });
      }
    } catch (err) {
      console.log(err);
    }
  }, [songInfo, spotifyApi]);

  const handlePlayPause = async () => {
    try {
      const response = await spotifyApi.getMyCurrentPlaybackState();

      if (response.body) {
        if (response.body.is_playing) {
          await spotifyApi.pause();
          setPlaying(false);
        } else {
          await spotifyApi.play();
          setPlaying(true);
        }
      }
    } catch (err) {
      console.log(err);
    }
  };

  const debouncedAdjustVolume = useCallback(
    debounce(async (volume) => {
      try {
        await spotifyApi.setVolume(volume);
      } catch (err) {
        console.log(err);
      }
    }, 300),
    [],
  );

  const handleFastForward = useCallback(async () => {
    try {
      await spotifyApi.skipToNext();
      const response = await spotifyApi.getMyCurrentPlaybackState();
      if (response?.body?.item) {
        setCurrentTrackId(response?.body?.item?.id);
      }
    } catch (err) {
      console.log(err);
    }
  }, [spotifyApi]);

  const handleFastBackward = useCallback(async () => {
    try {
      await spotifyApi.skipToPrevious();
      const response = await spotifyApi.getMyCurrentPlaybackState();
      if (response?.body?.item) {
        setCurrentTrackId(response?.body?.item?.id);
      }
    } catch (err) {
      console.log(err);
    }
  }, [spotifyApi]);

  useEffect(() => {
    if (!deviceId) {
      getCurrentDevice();
      console.log('fetching current device...');
    } else if (deviceIsActive === false) {
      spotifyApi.transferMyPlayback(deviceId);
      setDeviceIsActive(true);
      console.log('device has been transfered - ', deviceId, deviceIsActive);
    }
  }, [spotifyApi, session]);

  useEffect(() => {
    if (spotifyApi.getAccessToken() && !currentTrackId) {
      fetchCurrentSong();
    }
  }, [currentTrackId, spotifyApi, session, fetchCurrentSong]);

  useEffect(() => {
    debouncedAdjustVolume(volume);
  }, [volume]);

  return (
    <div className="grid grid-cols-3 items-center px-2 h-[5.5rem] text-xs text-white bg-[#181818] border-t border-[#282828] md:px-5 md:text-base">
      <div className="flex item-center space-x-3">
        <img className="hidden md:inline w-14 h-14" src={songInfo?.album?.images?.[0].url} alt="" />
        <div className="flex justify-center flex-col">
          <h3 className="text-sm">{songInfo?.name}</h3>
          <span className="text-xs text-gray-500">{songInfo?.artists?.[0]?.name}</span>
        </div>
      </div>
      <div className="flex flex-row items-center justify-center space-x-6">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="white"
          className="w-5 h-5 cursor-pointer">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5"
          />
        </svg>
        <svg
          onClick={handleFastBackward}
          xmlns="http://www.w3.org/2000/svg"
          fill="white"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="white"
          className="w-6 h-6 cursor-pointer">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 16.811c0 .864-.933 1.405-1.683.977l-7.108-4.062a1.125 1.125 0 010-1.953l7.108-4.062A1.125 1.125 0 0121 8.688v8.123zM11.25 16.811c0 .864-.933 1.405-1.683.977l-7.108-4.062a1.125 1.125 0 010-1.953L9.567 7.71a1.125 1.125 0 011.683.977v8.123z"
          />
        </svg>
        <div
          onClick={handlePlayPause}
          className="bg-white rounded-full w-8 h-8 flex items-center justify-center cursor-pointer">
          {isPlaying ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={4}
              stroke="#181818"
              className="w-5 h-5">
              <path
                strokeLinecap="square"
                strokeLinejoin="inherit"
                d="M15.75 5.25v13.5m-7.5-13.5v13.5"
              />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="#181818"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="#181818"
              className="w-5 h-5">
              <path
                strokeLinecap="square"
                strokeLinejoin="inherit"
                d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z"
              />
            </svg>
          )}
        </div>
        <svg
          onClick={handleFastForward}
          xmlns="http://www.w3.org/2000/svg"
          fill="white"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="white"
          className="w-6 h-6 cursor-pointer">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3 8.688c0-.864.933-1.405 1.683-.977l7.108 4.062a1.125 1.125 0 010 1.953l-7.108 4.062A1.125 1.125 0 013 16.81V8.688zM12.75 8.688c0-.864.933-1.405 1.683-.977l7.108 4.062a1.125 1.125 0 010 1.953l-7.108 4.062a1.125 1.125 0 01-1.683-.977V8.688z"
          />
        </svg>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="white"
          className="w-5 h-5 cursor-pointer">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19.5 12c0-1.232-.046-2.453-.138-3.662a4.006 4.006 0 00-3.7-3.7 48.678 48.678 0 00-7.324 0 4.006 4.006 0 00-3.7 3.7c-.017.22-.032.441-.046.662M19.5 12l3-3m-3 3l-3-3m-12 3c0 1.232.046 2.453.138 3.662a4.006 4.006 0 003.7 3.7 48.656 48.656 0 007.324 0 4.006 4.006 0 003.7-3.7c.017-.22.032-.441.046-.662M4.5 12l3 3m-3-3l-3 3"
          />
        </svg>
      </div>
      <div className="flex items-center justify-end space-x-3">
        {volume === 0 ? (
          <svg
            onClick={() => setVolume(50)}
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-5 h-5">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M17.25 9.75L19.5 12m0 0l2.25 2.25M19.5 12l2.25-2.25M19.5 12l-2.25 2.25m-10.5-6l4.72-4.72a.75.75 0 011.28.531V19.94a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.506-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.395C2.806 8.757 3.63 8.25 4.51 8.25H6.75z"
            />
          </svg>
        ) : volume < 50 ? (
          <svg
            onClick={() => setVolume(0)}
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-5 h-">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19.114 -5.636a9 9 0 010 0.728M16.463 8.288a5.25 5.25 0 010 7.424M6.75 8.25l4.72-4.72a.75.75 0 011.28.531V19.94a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.506-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.395C2.806 8.757 3.63 8.25 4.51 8.25H6.75z"
            />
          </svg>
        ) : (
          <svg
            onClick={() => setVolume(0)}
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-5 h-5">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5.25 5.25 0 010 7.424M6.75 8.25l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z"
            />
          </svg>
        )}

        <input
          className="w-14 md:w-24"
          type="range"
          value={volume}
          onChange={(e) => setVolume(Number(e.target.value))}
          min={0}
          max={100}></input>
      </div>
    </div>
  );
};

export default Player;
