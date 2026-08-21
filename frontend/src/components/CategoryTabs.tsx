import { useI18n } from '../i18n/I18nContext';
import type { Category } from '@liwan/shared';

export function CategoryTabs({
  categories,
  active,
}: {
  categories: Category[];
  active: number;
}) {
  const { lang } = useI18n();
  const scrollTo = (id: number) => {
    const el = document.getElementById(`cat-${id}`);
    el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };
  return (
    <div className="sticky top-14 z-30 -mx-4 overflow-x-auto px-4 py-2 bg-cream/90 backdrop-blur border-b border-gold/10">
      <div className="flex gap-2 whitespace-nowrap">
        {categories.map((c) => (
          <button
            key={c.id}
            onClick={() => scrollTo(c.id)}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
              active === c.id ? 'bg-emerald text-cream shadow-sm' : 'bg-white/70 text-ink border border-gold/20'
            }`}
          >
            {lang === 'ar' ? c.name_ar : c.name_en}
          </button>
        ))}
      </div>
    </div>
  );
}
