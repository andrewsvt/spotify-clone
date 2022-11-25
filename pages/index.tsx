import type { NextPage } from 'next';
import Center from '../components/Center';

import Sidebar from '../components/Sidebar';

const Home: NextPage = () => {
  return (
    <div className='bg-black h-screen overflow-hidden'>
      <main className='flex'>
        <Sidebar />
        <Center />
      </main>

      <div>{/* playbar */}</div>
    </div>
  );
};

export default Home;
