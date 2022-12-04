import type { NextPage } from 'next';

import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import useSpotify from '../hooks/useSpotify';
import { useRecoilValue, useRecoilState } from 'recoil';

import { shuffle } from 'lodash';
import clsx from 'clsx';

import { currentPlaylistIdState, playlistState } from '../atoms/playlistAtom';
import { currentUserState } from '../atoms/userAtom';

import Layout from './Layout';
import Songs from './Songs';

const colors = [
  'from-indigo-900',
  'from-blue-900',
  'from-red-900',
  'from-yellow-900',
  'from-pink-900',
  'from-purple-900',
];

const Playlist: NextPage = () => {
  const { data: session } = useSession();
  const [color, setColor] = useState<string>();
  const [currentUser, setCurrentUser] = useRecoilState(currentUserState);
  const selectedPlaylistId = useRecoilValue(currentPlaylistIdState);
  const [playlist, setPlaylist] = useRecoilState(playlistState);

  const { spotifyApi } = useSpotify();

  useEffect(() => {
    setColor(shuffle(colors).pop());
    console.log('selectedPlaylistId', selectedPlaylistId);
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

  useEffect(() => {
    if (spotifyApi.getAccessToken()) {
      spotifyApi
        .getMe()
        .then((data) => {
          setCurrentUser(data.body);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [spotifyApi]);

  return (
    <div className="flex flex-grow h-screen overflow-y-scroll flex-col text-white bg-[#121212] pb-24">
      <header className="absolute top-5 right-8">
        <div className="flex items-center bg-black space-x-2 opacity-90 cursor-pointer rounded-full p-1 pr-2">
          {currentUser?.images?.[0] ? (
            <img className="rounded-full w-6 h-6" src={currentUser?.images?.[0].url} alt="" />
          ) : (
            <></>
          )}

          <h2 className="font-bold text-sm">{currentUser?.display_name}</h2>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-4 h-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
          </svg>
        </div>
      </header>
      <section
        className={`flex items-end space-x-7 bg-gradient-to-b to-[#121212] ${color} h-80 p-8 w-full`}>
        {playlist ? (
          <>
            {playlist?.images?.[0]?.url ? (
              <img
                className="h-20 w-20 md:h-52 md:w-52 shadow-2xl select-none pointer-events-none"
                src={playlist?.images?.[0]?.url}
                alt=""
              />
            ) : (
              <div className="h-20 w-20 md:h-52 md:w-52 bg-[#282828] shadow-2xl flex justify-center items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="gray"
                  className="w-16 h-16">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 9l10.5-3m0 6.553v3.75a2.25 2.25 0 01-1.632 2.163l-1.32.377a1.803 1.803 0 11-.99-3.467l2.31-.66a2.25 2.25 0 001.632-2.163zm0 0V2.25L9 5.25v10.303m0 0v3.75a2.25 2.25 0 01-1.632 2.163l-1.32.377a1.803 1.803 0 01-.99-3.467l2.31-.66A2.25 2.25 0 009 15.553z"
                  />
                </svg>
              </div>
            )}
            <div className="flex flex-col space-y-4">
              <span className="font-medium uppercase text-xs">{playlist?.type}</span>
              <h1
                className={clsx('font-bold md:text-4xl m-[-2px] pointer-events-none', {
                  ['lg:text-8xl lg:m-[-4px]']: playlist!.name.length < 20,
                })}>
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
                    Number(playlist?.tracks?.items.length) > 1 ||
                    Number(playlist?.tracks?.items.length) === 0
                      ? 's'
                      : ''
                  }`}
                </span>
              </div>
            </div>
          </>
        ) : (
          <></>
        )}
      </section>
      <div>
        <Songs />
      </div>
    </div>
  );
};

export default Playlist;
