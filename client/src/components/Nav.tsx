import { useEffect, useState } from 'react';
import { useI18n } from '../i18n/I18nContext';
import { LogoPlaceholder } from './LogoPlaceholder';
import { useCart } from '../cart/CartContext';

export function Nav({ onMenuClick, onCartClick }: { onMenuClick: () => void; onCartClick: () => void }) {
  const { lang, setLang, t } = useI18n();
  const { count } = useCart();
  const [active, setActive] = useState('');

  useEffect(() => {
    const ids = ['menu', 'about'];
    const obs = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(e.target.id);
      },
      { rootMargin: '-40% 0px -55% 0px' }
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
  }, []);

  return (
    <header className="sticky top-0 z-50 bg-cream/90 backdrop-blur border-b border-gold/15">
      <nav className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        <LogoPlaceholder />
        <div className="flex items-center gap-2">
          <button
            onClick={() => setLang(lang === 'ar' ? 'en' : 'ar')}
            className="rounded-full px-3 py-2 text-sm font-semibold text-emerald transition active:scale-95"
          >
            {lang === 'ar' ? 'EN' : 'عربي'}
          </button>
          <button
            onClick={onMenuClick}
            className="rounded-full px-3 py-2 text-sm font-semibold text-emerald transition active:scale-95"
          >
            {t('nav.menu')}
          </button>
          <button onClick={onCartClick} className="relative rounded-full bg-emerald px-4 py-2 text-sm font-bold text-cream">
            🛒 {count > 0 && <span className="absolute -end-1 -top-1 rounded-full bg-gold px-1.5 text-xs text-ink">{count}</span>}
          </button>
        </div>
      </nav>
    </header>
  );
}
