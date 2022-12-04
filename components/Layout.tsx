import { ReactNode } from 'react';
import Sidebar from './Sidebar';
import Player from './Player';
import Header from './Header';

type LayoutProps = {
  children: ReactNode;
};

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="bg-black h-screen overflow-hidden">
      <main className="flex">
        <Sidebar />
        <Header />
        {children}
      </main>
      <footer className="sticky bottom-0">
        <Player />
      </footer>
    </div>
  );
}
