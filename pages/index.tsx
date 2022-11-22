import type { NextPage } from 'next';

import Sidebar from '../components/Sidebar';

const Home: NextPage = () => {
  return (
    <div className="bg-black h-screen overflow-hidden">
      <main>
        <Sidebar />
        {/* center */}
      </main>

      <div>{/* playbar */}</div>
    </div>
  );
};

export default Home;
