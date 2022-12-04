import type { NextPage, GetServerSideProps } from 'next';

import { getSession } from 'next-auth/react';

import Layout from '../components/Layout';
import Home from '../components/Home';
import Playlist from '../components/Playlist';

const Main: NextPage = () => {
  return (
    <Layout>
      <Playlist />
    </Layout>
  );
};

export default Main;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context);

  return {
    props: {
      session,
    },
  };
};
