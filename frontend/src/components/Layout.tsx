import type { ReactNode } from 'react';
import { Nav } from './Nav';
import { Footer } from './Footer';

export function Layout({ children }: { children: ReactNode }) {
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
