import { NextPage } from 'next';

import React, { useEffect } from 'react';
import useSpotify from '../hooks/useSpotify';

import { currentUserState } from '../atoms/userAtom';
import { useRecoilState } from 'recoil';

const Header: NextPage = () => {
  const { spotifyApi } = useSpotify();

  const [currentUser, setCurrentUser] = useRecoilState(currentUserState);

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
    <header className="absolute top-5 right-8 text-white">
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
  );
};

export default Header;
