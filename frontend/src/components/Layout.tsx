import type { ReactNode } from 'react';
import { Nav } from './Nav';
import { Footer } from './Footer';
import { ThreeBackground } from '../three/ThreeBackground';
import { useFavicon } from '../hooks/useFavicon';

export function Layout({ children }: { children: ReactNode }) {
  useFavicon();
  return (
    <>
      <ThreeBackground />
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
