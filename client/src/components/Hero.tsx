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
  const desc = lang === 'ar' ? (settings.hero_tagline_ar || settings.description_ar) : (settings.hero_tagline_en || settings.description_en);

  return (
    <section
      ref={ref}
      className="flex min-h-[80vh] flex-col items-center justify-center px-4 text-center"
    >
      <LogoPlaceholder className="mb-6 h-24 w-24" />
      <h1 className="mb-3 font-display text-4xl font-bold text-emerald md:text-5xl">
        {name || t('hero.loading')}
      </h1>
      <div className="mx-auto mb-6 h-0.5 w-16 rounded-full bg-gold/60" />
      <p className="mb-8 max-w-md text-lg text-ink/70">{desc}</p>
      <div className="flex w-full max-w-xs flex-col gap-3 sm:max-w-none sm:flex-row sm:justify-center">
        <button
          onClick={onBrowse}
          className="rounded-full bg-emerald px-8 py-3 font-semibold text-cream shadow-lg shadow-emerald/20 transition active:scale-95"
        >
          {t('hero.browse')}
        </button>
        <button
          onClick={() => settings.maps_url && window.open(settings.maps_url, '_blank')}
          className="rounded-full border-2 border-gold/30 bg-transparent px-8 py-3 font-semibold text-emerald transition active:scale-95"
        >
          {t('hero.location')}
        </button>
      </div>
    </section>
  );
}
