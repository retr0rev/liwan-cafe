import type { ReactNode } from 'react';
import { useState } from 'react';
import { Nav } from './Nav';
import { Footer } from './Footer';
import { ThreeBackground } from '../three/ThreeBackground';
import { useFavicon } from '../hooks/useFavicon';
import { CartDrawer } from '../cart/CartDrawer';

export function Layout({ children }: { children: ReactNode }) {
  useFavicon();
  const [cartOpen, setCartOpen] = useState(false);
  return (
    <>
      <ThreeBackground />
      <Nav onMenuClick={() => document.getElementById('menu')?.scrollIntoView({ behavior: 'smooth' })} onCartClick={() => setCartOpen(true)} />
      <main>{children}</main>
      <Footer />
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
}
