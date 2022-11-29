import type { NextPage, GetServerSideProps } from 'next';
import { getSession } from 'next-auth/react';
import Center from '../components/Center';

import Sidebar from '../components/Sidebar';
import Player from '../components/Player';

const Home: NextPage = () => {
  return (
    <div className="bg-black h-screen overflow-hidden">
      <main className="flex">
        <Sidebar />
        <Center />
      </main>
      <footer className="sticky bottom-0">
        <Player />
      </footer>
    </div>
  );
};

export default Home;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context);

  return {
    props: {
      session,
    },
  };
};
