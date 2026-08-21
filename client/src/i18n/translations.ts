export const translations = {
  en: {
    nav: { menu: 'Menu', about: 'About', location: 'Location' },
    hero: { browse: 'Browse Menu', location: 'Location', loading: 'Loading…' },
    menu: { title: 'Our Menu', all: 'All', popular: 'Most Popular' },
    item: { notAvailable: 'Unavailable' },
    labels: { new: 'New', popular: 'Popular', spicy: 'Spicy', vegetarian: 'Vegetarian' },
    about: {
      title: 'About Us',
      hours: 'Working Hours',
      contact: 'Contact',
      follow: 'Follow Us',
    },
    footer: { rights: 'All rights reserved.' },
    cart: { title: 'Cart', empty: 'Your cart is empty', total: 'Total', add: 'Add to cart', remove: 'Remove', checkout: 'Order via WhatsApp', notesPlaceholder: 'Name, address, notes…', missingNumber: 'WhatsApp not configured yet' },
  },
  ar: {
    nav: { menu: 'القائمة', about: 'من نحن', location: 'الموقع' },
    hero: { browse: 'تصفح القائمة', location: 'الموقع', loading: 'جارٍ التحميل…' },
    menu: { title: 'قائمتنا', all: 'الكل', popular: 'الأكثر طلباً' },
    item: { notAvailable: 'غير متوفر' },
    labels: { new: 'جديد', popular: 'الأكثر مبيعاً', spicy: 'حار', vegetarian: 'نباتي' },
    about: {
      title: 'من نحن',
      hours: 'ساعات العمل',
      contact: 'تواصل معنا',
      follow: 'تابعنا',
    },
    footer: { rights: 'جميع الحقوق محفوظة.' },
    cart: { title: 'السلة', empty: 'سلتك فارغة', total: 'المجموع', add: 'أضف للسلة', remove: 'حذف', checkout: 'اطلب عبر واتساب', notesPlaceholder: 'الاسم، العنوان، ملاحظات…', missingNumber: 'رقم واتساب غير مضبوط بعد' },
  },
} as const;

export type Lang = 'en' | 'ar';
