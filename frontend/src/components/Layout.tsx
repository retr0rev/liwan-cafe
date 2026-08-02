import type { ReactNode } from 'react';
import { Nav } from './Nav';
import { Footer } from './Footer';
import { useFavicon } from '../hooks/useFavicon';

export function Layout({ children }: { children: ReactNode }) {
  useFavicon();
  return (
    <>
      <Nav
        onMenuClick={() =>
          document.getElementById('menu')?.scrollIntoView({ behavior: 'smooth' })
        }
      />
      <main>{children}</main>
      <Footer />
    </>
  );
}
