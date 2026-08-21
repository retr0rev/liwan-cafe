import { useEffect, useRef } from 'react';
import anime from 'animejs';
import { useI18n } from '../i18n/I18nContext';
import { useMenuData } from '../hooks/useMenuData';
import { CategoryTabs } from './CategoryTabs';
import { ItemCard } from './ItemCard';

export function MenuSection({
  activeCategory,
}: {
  activeCategory: number;
}) {
  const { lang, t } = useI18n();
  const { categories, itemsByCategory } = useMenuData();
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (rootRef.current) {
      anime({
        targets: rootRef.current.querySelectorAll('.item-card'),
        opacity: [0, 1],
        translateY: [16, 0],
        duration: 400,
        delay: anime.stagger(60),
        easing: 'easeOutCubic',
      });
    }
  }, [activeCategory]);

  return (
    <section id="menu" ref={rootRef} className="scroll-mt-16 px-4 py-10">
      <h2 className="mb-6 text-center font-display text-3xl font-bold text-emerald">{t('menu.title')}</h2>
      {categories.length > 0 && <CategoryTabs categories={categories} active={activeCategory} />}
      <div className="mx-auto mt-6 max-w-5xl space-y-10">
        {categories.map((cat) => (
          <div key={cat.id} id={`cat-${cat.id}`} className="scroll-mt-32">
            <h3 className="mb-3 font-display text-xl font-semibold text-ink">{lang === 'ar' ? cat.name_ar : cat.name_en}</h3>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {(itemsByCategory[cat.id] || []).map((item, i) => (
                <div key={item.id} className="item-card">
                  <ItemCard item={item} index={i} />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
