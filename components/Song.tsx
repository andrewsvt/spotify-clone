import type { NextPage } from 'next';
import { useRecoilValue } from 'recoil';
import { playlistState } from '../atoms/playlistAtom';
import useSpotify from '../hooks/useSpotify';

interface SongProps {
  item: SpotifyApi.PlaylistTrackObject;
  order: number;
}

const Song: NextPage<SongProps> = ({ item, order }) => {
  const SpotifyApi = useSpotify();
  return (
    <div>
      <div>{order + 1}</div>
      <img src={item.track?.album.images[2].url}></img>
      <div>
        <span>{item.track?.name}</span>
        <div>
          {item.track?.artists.map((artist) => (
            <span>{artist.name}</span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Song;
