export const translations = {
  en: {
    nav: { menu: 'Menu', about: 'About', location: 'Location' },
    hero: { browse: 'Browse Menu', location: 'Location', loading: 'Loading…' },
    menu: { title: 'Our Menu', all: 'All' },
    item: { notAvailable: 'Unavailable' },
    labels: { new: 'New', popular: 'Popular', spicy: 'Spicy', vegetarian: 'Vegetarian' },
    about: {
      title: 'About Us',
      hours: 'Working Hours',
      contact: 'Contact',
      follow: 'Follow Us',
    },
    footer: { rights: 'All rights reserved.' },
  },
  ar: {
    nav: { menu: 'القائمة', about: 'من نحن', location: 'الموقع' },
    hero: { browse: 'تصفح القائمة', location: 'الموقع', loading: 'جارٍ التحميل…' },
    menu: { title: 'قائمتنا', all: 'الكل' },
    item: { notAvailable: 'غير متوفر' },
    labels: { new: 'جديد', popular: 'الأكثر مبيعاً', spicy: 'حار', vegetarian: 'نباتي' },
    about: {
      title: 'من نحن',
      hours: 'ساعات العمل',
      contact: 'تواصل معنا',
      follow: 'تابعنا',
    },
    footer: { rights: 'جميع الحقوق محفوظة.' },
  },
} as const;

export type Lang = 'en' | 'ar';
