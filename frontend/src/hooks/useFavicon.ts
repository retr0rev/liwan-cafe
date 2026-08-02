import { useEffect } from 'react';
import { useMenuData } from './useMenuData';

export function useFavicon() {
  const { settings } = useMenuData();

  useEffect(() => {
    if (!settings.favicon_url) return;
    let link = document.querySelector("link[rel='icon']") as HTMLLinkElement | null;
    if (!link) {
      link = document.createElement('link');
      link.rel = 'icon';
      document.head.appendChild(link);
    }
    link.href = settings.favicon_url;
  }, [settings.favicon_url]);
}
