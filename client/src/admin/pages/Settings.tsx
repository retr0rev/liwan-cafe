import { useCallback, useEffect, useState } from 'react';
import { api } from '../../api/client';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';

const FIELDS: { key: string; label: string }[] = [
  { key: 'restaurant_name_ar', label: 'اسم المطعم (عربي)' },
  { key: 'restaurant_name_en', label: 'اسم المطعم (إنجليزي)' },
  { key: 'description_ar', label: 'الوصف (عربي)' },
  { key: 'description_en', label: 'الوصف (إنجليزي)' },
  { key: 'hours_ar', label: 'ساعات العمل (عربي)' },
  { key: 'hours_en', label: 'ساعات العمل (إنجليزي)' },
  { key: 'phone', label: 'الهاتف' },
  { key: 'whatsapp_number', label: 'رقم واتساب للطلبات (9639...)' },
  { key: 'instagram', label: 'إنستغرام' },
  { key: 'facebook', label: 'فيسبوك' },
  { key: 'tiktok', label: 'تيك توك' },
  { key: 'maps_url', label: 'رابط خرائط جوجل' },
  { key: 'address_ar', label: 'العنوان (عربي)' },
  { key: 'address_en', label: 'العنوان (إنجليزي)' },
  { key: 'footer_text', label: 'نص الفوتر' },
];

const IMAGES: { key: 'logo_url' | 'favicon_url'; label: string }[] = [
  { key: 'logo_url', label: 'Logo' },
  { key: 'favicon_url', label: 'Favicon' },
];

export function Settings() {
  const [values, setValues] = useState<Record<string, string>>({});
  const [saved, setSaved] = useState(false);

  const load = useCallback(() => api.getSettings().then(setValues).catch(() => {}), []);
  useEffect(() => {
    load();
  }, [load]);

  const save = async () => {
    await api.updateSettings(values);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const uploadImage = async (key: 'logo_url' | 'favicon_url', file: File | undefined) => {
    if (!file) return;
    const res = await api.uploadSettingImage(key, file);
    setValues((v) => ({ ...v, [key]: res.value }));
  };

  return (
    <div dir="rtl" className="max-w-2xl">
      <h1 className="mb-6 text-2xl font-bold text-emerald">إعدادات المطعم</h1>
      <div className="space-y-3 rounded-2xl bg-white p-6 shadow-sm border border-gold/10">
        <div className="grid gap-6 sm:grid-cols-2">
          {IMAGES.map((img) => (
            <div key={img.key}>
              <label className="mb-1 block text-sm font-medium text-ink/70">
                {img.label}
              </label>
              {values[img.key] ? (
                <img src={values[img.key]} alt={img.label} className="mb-2 h-16 w-16 rounded object-contain" />
              ) : (
                <div className="mb-2 h-16 w-16 rounded-xl border-2 border-dashed border-gold/40 bg-emerald/10" />
              )}
              <input
                type="file"
                accept="image/*"
                onChange={(e) => uploadImage(img.key, e.target.files?.[0])}
                className="block text-sm text-ink/60"
              />
            </div>
          ))}
        </div>
        <div className="border-t border-gold/10 pt-4" />
        {FIELDS.map((f) => (
          <div key={f.key}>
            <label className="mb-1 block text-sm font-medium text-ink/70">
              {f.label}
            </label>
            <Input
              value={values[f.key] || ''}
              onChange={(e) => setValues({ ...values, [f.key]: e.target.value })}
            />
          </div>
        ))}
        <div className="flex items-center gap-3">
          <Button onClick={save}>حفظ الإعدادات</Button>
          {saved && <span className="text-sm text-emerald">تم الحفظ</span>}
        </div>
      </div>
    </div>
  );
}
