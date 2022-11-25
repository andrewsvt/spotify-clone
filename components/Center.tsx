import type { NextPage } from 'next';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { shuffle } from 'lodash';

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

  useEffect(() => {
    setColor(shuffle(colors).pop());
  }, []);

  return (
    <div className='flex flex-grow text-white bg-[#121212] '>
      <header className='absolute top-5 right-8'>
        <div className='flex items-center bg-black space-x-3 opacity-90 cursor-pointer rounded-full p-1 pr-2'>
          <img
            className='rounded-full w-7 h-7'
            src='https://i.scdn.co/image/ab6775700000ee854dec4400792d01f4e2aa7438'
            alt=''
          ></img>
          <h2 className='font-medium'>Esendex</h2>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            fill='none'
            viewBox='0 0 24 24'
            strokeWidth={1.5}
            stroke='currentColor'
            className='w-5 h-5'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              d='M19.5 8.25l-7.5 7.5-7.5-7.5'
            />
          </svg>
        </div>
      </header>
      <section
        className={`flex itrms-end space-x-7 bg-gradient-to-b to-[#121212] ${color} h-80 p-8 w-full`}
      ></section>
    </div>
  );
};

export default Center;
