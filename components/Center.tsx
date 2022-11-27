import type { NextPage } from 'next';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { shuffle } from 'lodash';
import { currentPlaylistIdState, playlistState } from '../atoms/playlistAtom';
import { useRecoilValue, useRecoilState } from 'recoil';
import useSpotify from '../hooks/useSpotify';
import Songs from './Songs';

const colors = [
  'from-indigo-900',
  'from-blue-900',
  'from-green-900',
  'from-red-900',
  'from-yellow-900',
  'from-pink-900',
  'from-purple-900',
];

const Center: NextPage = () => {
  const { data: session } = useSession();
  const [color, setColor] = useState<string>();
  const selectedPlaylistId = useRecoilValue(currentPlaylistIdState);
  const [playlist, setPlaylist] = useRecoilState(playlistState);

  const { spotifyApi } = useSpotify();

  useEffect(() => {
    setColor(shuffle(colors).pop());
  }, [selectedPlaylistId]);

  useEffect(() => {
    if (selectedPlaylistId) {
      spotifyApi
        .getPlaylist(selectedPlaylistId)
        .then((data) => {
          setPlaylist(data.body);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [selectedPlaylistId, spotifyApi]);

  console.log(playlist);

  return (
    <div className="flex flex-grow h-screen overflow-y-scroll flex-col text-white bg-[#121212]">
      <header className="absolute top-5 right-8">
        <div className="flex items-center bg-black space-x-3 opacity-90 cursor-pointer rounded-full p-1 pr-2">
          <img
            className="rounded-full w-7 h-7"
            src="https://i.scdn.co/image/ab6775700000ee854dec4400792d01f4e2aa7438"
            alt=""></img>
          <h2 className="font-medium">Esendex</h2>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
          </svg>
        </div>
      </header>
      <section
        className={`flex items-end space-x-7 bg-gradient-to-b to-[#121212] ${color} h-80 p-8 w-full`}>
        <img
          className="h-52 w-52 shadow-2xl select-none pointer-events-none"
          src={playlist?.images?.[0]?.url}
          alt=""></img>
        <div className="flex flex-col space-y-4">
          <span className="font-medium uppercase text-xs">{playlist?.type}</span>
          <h1 className="font-bold lg:text-8xl md:text-4xl m-[-4px] pointer-events-none">
            {playlist?.name}
          </h1>
          <div className="font-light text-sm flex flex-row items-center space-x-2">
            <span className="font-medium">{playlist?.owner.display_name}</span>
            {playlist?.followers?.total ? (
              <>
                <div className="text-[8px]">•</div>
                <span>
                  {`${playlist?.followers?.total} like${
                    Number(playlist?.followers?.total) > 1 ? 's' : ''
                  }`}
                </span>
              </>
            ) : (
              ''
            )}
            <div className="text-[8px]">•</div>
            <span>
              {`${playlist?.tracks?.items.length} track${
                Number(playlist?.tracks?.items.length) > 1 ? 's' : ''
              }`}
            </span>
          </div>
        </div>
      </section>
      <div>
        <Songs />
      </div>
    </div>
  );
};

export default Center;
