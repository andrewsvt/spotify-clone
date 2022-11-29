import type { NextPage } from 'next';
import { useRecoilValue } from 'recoil';
import { playlistState } from '../atoms/playlistAtom';
import Song from './Song';

const Songs: NextPage = () => {
  const playlist = useRecoilValue(playlistState);
  return (
    <div className="px-8 flex flex-col space-y-1 text-white">
      {playlist?.tracks.items.map((item, i) =>
        item.track?.id ? <Song key={item.track?.id} item={item} order={i} /> : '',
      )}
    </div>
  );
};

export default Songs;
