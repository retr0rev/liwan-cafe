import { useState, useEffect, useRef } from 'react';
import anime from 'animejs';
import { useI18n } from '../i18n/I18nContext';
import { useCart } from './CartContext';
import { buildWhatsAppMessage, waLink, formatPrice } from './whatsapp';
import { useMenuData } from '../hooks/useMenuData';

export function CartDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { lang, t } = useI18n();
  const { items, setQty, remove, subtotal, clear } = useCart();
  const { settings } = useMenuData();
  const [notes, setNotes] = useState('');
  const waNumber = (settings as Record<string, string>)?.whatsapp_number || (settings as Record<string, string>)?.whatsapp || '';
  const canCheckout = items.length > 0 && waNumber.replace(/\D/g, '').length >= 8;

  const checkout = () => {
    const msg = buildWhatsAppMessage(lang as 'ar' | 'en', items, notes);
    window.open(waLink(waNumber, msg), '_blank');
    clear();
    onClose();
  };

  const drawerRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const isRTL = lang === 'ar';
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; document.documentElement.style.overflow = ''; };
  }, [open]);
  useEffect(() => {
    if (open && drawerRef.current && overlayRef.current) {
      anime({ targets: overlayRef.current, opacity: [0, 1], duration: 220, easing: 'easeOutQuad' });
      anime({ targets: drawerRef.current, translateX: [isRTL ? '-100%' : '100%', '0%'], duration: 380, easing: 'easeOutCubic' });
      anime({ targets: '.cart-item', opacity: [0, 1], translateY: [10, 0], delay: anime.stagger(50, { start: 120 }), duration: 320, easing: 'easeOutQuad' });
    }
  }, [open, items.length, isRTL]);

  if (!open) return null;
  return (
    <div className={`fixed inset-0 z-50 flex ${isRTL ? 'flex-row-reverse' : ''}`}>
      <div ref={overlayRef} className="flex-1 bg-black/30 opacity-0" onClick={onClose} />
      <div ref={drawerRef} className="flex h-[100dvh] w-full flex-col bg-cream shadow-2xl sm:max-w-sm" style={{ transform: `translateX(${isRTL ? '-100%' : '100%'})` }}>
        <div className="flex items-center justify-between border-b border-gold/15 p-4">
          <h2 className="font-display text-xl font-bold text-emerald">{t('cart.title')}</h2>
          <button onClick={onClose} className="rounded-full bg-emerald/10 px-3 py-1 text-emerald">✕</button>
        </div>
        <div className="flex-1 overflow-auto p-4">
          {items.length === 0 ? (
            <p className="py-10 text-center text-ink/60">{t('cart.empty')}</p>
          ) : (
            <div className="space-y-3">
              {items.map((it) => {
                const name = lang === 'ar' ? it.name_ar : it.name_en;
                return (
                  <div key={it.id} className="cart-item flex gap-3 rounded-xl bg-white p-3 shadow-sm border border-gold/10">
                    {it.image_url ? <img src={it.image_url} alt={name} className="h-14 w-14 rounded-lg object-cover" /> : <div className="h-14 w-14 rounded-lg bg-emerald/10" />}
                    <div className="flex-1">
                      <p className="font-semibold text-ink text-sm">{name}</p>
                      <p className="text-sm text-gold font-bold">{formatPrice(Number(it.price), lang)}</p>
                      <div className="mt-1 flex items-center gap-2">
                        <button onClick={() => setQty(it.id, it.qty - 1)} className="rounded-full border border-gold/20 px-2">−</button>
                        <span className="text-sm font-semibold">{it.qty}</span>
                        <button onClick={() => setQty(it.id, it.qty + 1)} className="rounded-full border border-gold/20 px-2">+</button>
                        <button onClick={() => remove(it.id)} className="ms-auto text-xs text-red-600">{t('cart.remove')}</button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
        {items.length > 0 && (
          <div className="border-t border-gold/15 p-4 space-y-3">
            <div className="flex justify-between font-bold text-emerald">
              <span>{t('cart.total')}</span><span>{formatPrice(subtotal, lang)}</span>
            </div>
            <textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder={t('cart.notesPlaceholder')} className="w-full rounded-xl border border-gold/20 p-3 text-sm bg-white" rows={2} />
            {!waNumber && <p className="text-xs text-amber-700">{t('cart.missingNumber')}</p>}
            <button disabled={!canCheckout} onClick={checkout} className="w-full rounded-full bg-emerald py-3 font-bold text-cream disabled:opacity-40 shadow-lg">
              {t('cart.checkout')}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
