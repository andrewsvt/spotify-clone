import type { NextPage } from 'next';
import { useEffect } from 'react';
import { getToken } from 'next-auth/jwt';
import { useRecoilState } from 'recoil';
import { currentTrackState, isActiveState, isPausedState, playerState } from '../atoms/songAtom';
import useSpotify from '../hooks/useSpotify';
import { msToTime } from '../lib/time';

interface SongProps {
  item: SpotifyApi.PlaylistTrackObject;
  order: number;
}

const Song: NextPage<SongProps> = ({ item, order }) => {
  const { spotifyApi } = useSpotify();
  const token = spotifyApi.getAccessToken() || '';

  const [currentTrack, setCurrentTrack] = useRecoilState(currentTrackState);
  const [player, setPlayer] = useRecoilState(playerState);
  const [isPaused, setPaused] = useRecoilState(isPausedState);
  const [isActive, setActive] = useRecoilState(isActiveState);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://sdk.scdn.co/spotify-player.js';
    script.async = true;

    document.body.appendChild(script);

    window.onSpotifyWebPlaybackSDKReady = () => {
      const player = new window.Spotify.Player({
        name: 'Web Playback SDK',
        getOAuthToken: (cb) => {
          cb(token);
        },
        volume: 0.5,
      });

      setPlayer(player);

      player.addListener('ready', ({ device_id }) => {
        console.log('Ready with Device ID', device_id);
      });

      player.addListener('not_ready', ({ device_id }) => {
        console.log('Device ID has gone offline', device_id);
      });

      player.addListener('player_state_changed', (state) => {
        if (!state) {
          return;
        }

        setCurrentTrack(item.track);
        setPaused(state.paused);

        player.getCurrentState().then((state) => {
          if (!state) {
            setActive(false);
          } else {
            setActive(true);
          }
        });
      });

      player.connect();
    };
  }, [token]);

  return (
    <div
      onClick={() => player}
      className="grid grid-cols-2 px-4 py-2 rounded-md text-gray-500 font-normal text-sm hover:bg-[#ffffff25]">
      <div className="flex items-center space-x-4">
        <div className="min-w-[1.5rem]">{order + 1}</div>
        <img className="h-10 w-10" src={item.track?.album.images[2].url}></img>
        <div>
          <h2 className="w-36 lg:w-64 text-white text-base truncate">{item.track?.name}</h2>
          <div className="w-36 lg:w-[32rem] space-x-1 truncate">
            {item.track?.artists.map((artist, i) => (
              <span>{`${artist.name}${i + 1 !== item.track?.artists.length ? ',' : ''}`}</span>
            ))}
          </div>
        </div>
      </div>
      <div className="flex items-center justify-between ml-auto md:ml-0">
        <h3 className="w-36 lg:w-[32rem] truncate hidden md:inline">{item.track?.album.name}</h3>
        <div>{msToTime(item.track?.duration_ms)}</div>
      </div>
    </div>
  );
};

export default Song;
