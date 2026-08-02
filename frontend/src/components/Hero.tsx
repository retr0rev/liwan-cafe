import { useRef } from 'react';
import { useI18n } from '../i18n/I18nContext';
import { useMenuData } from '../hooks/useMenuData';
import { useReveal } from '../hooks/useReveal';
import { LogoPlaceholder } from './LogoPlaceholder';

export function Hero({ onBrowse }: { onBrowse: () => void }) {
  const { lang, t } = useI18n();
  const { settings } = useMenuData();
  const ref = useRef<HTMLElement>(null);
  useReveal(ref);

  const name = lang === 'ar' ? settings.restaurant_name_ar : settings.restaurant_name_en;
  const desc = lang === 'ar' ? settings.description_ar : settings.description_en;

  return (
    <section
      ref={ref}
      className="flex min-h-[80vh] flex-col items-center justify-center px-4 text-center"
    >
      <LogoPlaceholder className="mb-6 h-24 w-24" />
      <h1 className="mb-3 text-4xl font-bold text-green md:text-5xl">
        {name || t('hero.loading')}
      </h1>
      <p className="mb-8 max-w-md text-lg text-chocolate/80">{desc}</p>
      <div className="flex w-full max-w-xs flex-col gap-3 sm:max-w-none sm:flex-row sm:justify-center">
        <button
          onClick={onBrowse}
          className="rounded-full bg-green px-8 py-3 font-semibold text-cream shadow-lg shadow-green/20 transition active:scale-95"
        >
          {t('hero.browse')}
        </button>
        <button
          onClick={() => settings.maps_url && window.open(settings.maps_url, '_blank')}
          className="rounded-full border-2 border-green/20 bg-transparent px-8 py-3 font-semibold text-green transition active:scale-95"
        >
          {t('hero.location')}
        </button>
      </div>
    </section>
  );
}
