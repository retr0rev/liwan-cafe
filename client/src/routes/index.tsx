import { createRoute } from '@tanstack/react-router';
import { rootRoute } from './__root';
import { Layout } from '../components/Layout';
import { Hero } from '../components/Hero';
import { MostPopular } from '../components/MostPopular';
import { MenuSection } from '../components/MenuSection';
import { About } from '../components/About';

export const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: Index,
});

function Index() {
  return (
    <Layout>
      <Hero onBrowse={() => document.getElementById('menu')?.scrollIntoView({ behavior: 'smooth' })} />
      <MostPopular />
      <MenuSection activeCategory={0} />
      <About />
    </Layout>
  );
}
