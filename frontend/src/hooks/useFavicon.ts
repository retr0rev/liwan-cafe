import { useEffect } from 'react';
import { useMenuData } from './useMenuData';
import { useI18n } from '../i18n/I18nContext';

export function useFavicon() {
  const { settings } = useMenuData();
  const { lang } = useI18n();

  useEffect(() => {
    document.title = lang === 'ar'
      ? settings.restaurant_name_ar || 'ليوان'
      : settings.restaurant_name_en || 'Liwan Cafe';
  }, [lang, settings.restaurant_name_ar, settings.restaurant_name_en]);

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
