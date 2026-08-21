export function formatPrice(price: number, lang: string) {
  const n = Number(price).toLocaleString(lang === 'ar' ? 'ar-EG' : 'en-US');
  return lang === 'ar' ? `${n} ل.س` : `${n} S.P`;
}

export function buildWhatsAppMessage(
  lang: 'ar' | 'en',
  items: { name_ar: string; name_en: string; price: number; qty: number }[],
  notes: string
) {
  const lines = items.map((it) => {
    const name = lang === 'ar' ? it.name_ar : it.name_en;
    const price = formatPrice(it.price * it.qty, lang);
    return `- ${it.qty}x ${name} — ${price}`;
  });
  const total = items.reduce((s, it) => s + Number(it.price) * it.qty, 0);
  const totalStr = formatPrice(total, lang);
  const header = lang === 'ar' ? 'مرحبا ليوان! طلب جديد:' : 'Hello Liwan! New order:';
  const totalLabel = lang === 'ar' ? 'المجموع' : 'Total';
  const notesLabel = lang === 'ar' ? 'ملاحظات' : 'Notes';
  let msg = `${header}\n${lines.join('\n')}\n${totalLabel}: ${totalStr}`;
  if (notes.trim()) msg += `\n${notesLabel}: ${notes.trim()}`;
  return msg;
}

export function waLink(number: string, msg: string) {
  const digits = number.replace(/\D/g, '');
  return `https://wa.me/${digits}?text=${encodeURIComponent(msg)}`;
}
