import { useCallback, useEffect, useState } from 'react';
import { api } from '../../api/client';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';

const FIELDS: { key: string; label: string }[] = [
  { key: 'restaurant_name_en', label: 'Restaurant Name (EN)' },
  { key: 'restaurant_name_ar', label: 'Restaurant Name (AR)' },
  { key: 'description_en', label: 'Description (EN)' },
  { key: 'description_ar', label: 'Description (AR)' },
  { key: 'hours_en', label: 'Hours (EN)' },
  { key: 'hours_ar', label: 'Hours (AR)' },
  { key: 'phone', label: 'Phone' },
  { key: 'whatsapp', label: 'WhatsApp' },
  { key: 'instagram', label: 'Instagram URL' },
  { key: 'facebook', label: 'Facebook URL' },
  { key: 'tiktok', label: 'TikTok URL' },
  { key: 'maps_url', label: 'Google Maps URL' },
  { key: 'address_en', label: 'Address (EN)' },
  { key: 'address_ar', label: 'Address (AR)' },
  { key: 'footer_text', label: 'Footer Text' },
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
    <div className="max-w-2xl">
      <h1 className="mb-6 text-2xl font-bold text-green">Restaurant Settings</h1>
      <div className="space-y-3 rounded-2xl bg-white p-6 shadow-sm">
        <div className="grid gap-6 sm:grid-cols-2">
          {IMAGES.map((img) => (
            <div key={img.key}>
              <label className="mb-1 block text-sm font-medium text-chocolate/70">
                {img.label}
              </label>
              {values[img.key] ? (
                <img src={values[img.key]} alt={img.label} className="mb-2 h-16 w-16 rounded object-contain" />
              ) : (
                <div className="mb-2 h-16 w-16 rounded-xl border-2 border-dashed border-green/40 bg-green/10" />
              )}
              <input
                type="file"
                accept="image/*"
                onChange={(e) => uploadImage(img.key, e.target.files?.[0])}
                className="block text-sm text-chocolate/60"
              />
            </div>
          ))}
        </div>
        <div className="border-t border-green/10 pt-4" />
        {FIELDS.map((f) => (
          <div key={f.key}>
            <label className="mb-1 block text-sm font-medium text-chocolate/70">
              {f.label}
            </label>
            <Input
              value={values[f.key] || ''}
              onChange={(e) => setValues({ ...values, [f.key]: e.target.value })}
            />
          </div>
        ))}
        <div className="flex items-center gap-3">
          <Button onClick={save}>Save Settings</Button>
          {saved && <span className="text-sm text-green">Saved</span>}
        </div>
      </div>
    </div>
  );
}
