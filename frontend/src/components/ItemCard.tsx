import { useRef } from 'react';
import anime from 'animejs';
import { useI18n } from '../i18n/I18nContext';
import { Badge } from './Badge';
import type { MenuItem } from '@liwan/shared';

export function ItemCard({ item, index }: { item: MenuItem; index: number }) {
  const { lang, t } = useI18n();
  const ref = useRef<HTMLElement>(null);

  const enter = () =>
    anime({ targets: ref.current, scale: 1.02, duration: 250, easing: 'easeOutCubic' });
  const leave = () =>
    anime({ targets: ref.current, scale: 1, duration: 250, easing: 'easeOutCubic' });

  const name = lang === 'ar' ? item.name_ar : item.name_en;
  const desc = lang === 'ar' ? item.description_ar : item.description_en;

  return (
    <article
      ref={ref}
      onMouseEnter={enter}
      onMouseLeave={leave}
      className="flex gap-4 rounded-2xl bg-white/80 p-3 shadow-sm"
      style={{ animationDelay: `${index * 60}ms` }}
    >
      {item.image_url ? (
        <img
          src={item.image_url}
          alt={name}
          loading="lazy"
          className="h-20 w-20 rounded-xl object-cover"
        />
      ) : (
        <div className="h-20 w-20 rounded-xl bg-green/10" />
      )}
      <div className="flex-1">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-chocolate">{name}</h3>
          <span className="font-bold text-green">${Number(item.price).toFixed(2)}</span>
        </div>
        {desc && <p className="mt-1 text-sm text-chocolate/70 line-clamp-2">{desc}</p>}
        <div className="mt-2 flex flex-wrap gap-1.5">
          {item.is_new && <Badge type="new">{t('labels.new')}</Badge>}
          {item.is_popular && <Badge type="popular">{t('labels.popular')}</Badge>}
          {item.is_spicy && <Badge type="spicy">{t('labels.spicy')}</Badge>}
          {item.is_vegetarian && <Badge type="vegetarian">{t('labels.vegetarian')}</Badge>}
        </div>
      </div>
    </article>
  );
}
