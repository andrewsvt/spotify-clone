import type { NextPage } from 'next';
import { useRecoilState } from 'recoil';
import useSpotify from '../hooks/useSpotify';
import { msToTime } from '../lib/time';
import { currentTrackIdState, isPlayingState } from '../atoms/songAtom';

interface SongProps {
  item: SpotifyApi.PlaylistTrackObject;
  order: number;
}

const Song: NextPage<SongProps> = ({ item, order }) => {
  const { spotifyApi } = useSpotify();

  const [currentTrackId, setCurrentTrackId] = useRecoilState(currentTrackIdState);
  const [isPlaying, setPalying] = useRecoilState(isPlayingState);

  const playSong = () => {
    setCurrentTrackId(item.track!.id);
    setPalying(true);
    spotifyApi.play({
      uris: [item.track!.uri],
    });
  };

  return (
    <div
      onClick={playSong}
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
