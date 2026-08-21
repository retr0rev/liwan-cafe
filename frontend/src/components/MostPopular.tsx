import { useI18n } from '../i18n/I18nContext';
import { useMenuData } from '../hooks/useMenuData';
import { ItemCard } from './ItemCard';

export function MostPopular() {
  const { t } = useI18n();
  const { items } = useMenuData();
  const popular = items.filter((i) => i.is_popular && i.is_available);
  if (popular.length === 0) return null;
  return (
    <section className="px-4 py-10">
      <h2 className="mb-6 text-center font-display text-3xl font-bold text-emerald">{t('menu.popular') || 'Most Popular'}</h2>
      <div className="mx-auto grid max-w-5xl gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {popular.slice(0, 6).map((item, i) => <ItemCard key={item.id} item={item} index={i} />)}
      </div>
    </section>
  );
}
