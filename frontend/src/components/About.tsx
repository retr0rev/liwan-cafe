import { useI18n } from '../i18n/I18nContext';
import { useMenuData } from '../hooks/useMenuData';

export function About() {
  const { lang, t } = useI18n();
  const { settings } = useMenuData();
  const desc = lang === 'ar' ? settings.description_ar : settings.description_en;
  const hours = lang === 'ar' ? settings.hours_ar : settings.hours_en;
  const address = lang === 'ar' ? settings.address_ar : settings.address_en;

  return (
    <section id="about" className="scroll-mt-16 px-4 py-10">
      <div className="mx-auto max-w-2xl space-y-6">
        <h2 className="text-3xl font-bold text-green">{t('about.title')}</h2>
        {desc && <p className="leading-relaxed text-chocolate/80">{desc}</p>}
        <div className="rounded-2xl bg-white/80 p-5 shadow-sm">
          <h3 className="mb-2 font-semibold text-chocolate">{t('about.hours')}</h3>
          <p className="text-chocolate/80">{hours}</p>
        </div>
        <div className="rounded-2xl bg-white/80 p-5 shadow-sm">
          <h3 className="mb-2 font-semibold text-chocolate">{t('about.contact')}</h3>
          {settings.phone && <p className="text-chocolate/80">{settings.phone}</p>}
          {address && <p className="text-chocolate/80">{address}</p>}
        </div>
        <div className="flex flex-wrap gap-3">
          {[
            { key: 'instagram', label: 'Instagram' },
            { key: 'facebook', label: 'Facebook' },
            { key: 'tiktok', label: 'TikTok' },
            { key: 'whatsapp', label: 'WhatsApp' },
          ].map(
            ({ key, label }) =>
              settings[key] && (
                <a
                  key={key}
                  href={settings[key].startsWith('http') ? settings[key] : `https://${settings[key]}`}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-full bg-green px-5 py-2 text-sm font-semibold text-cream transition active:scale-95"
                >
                  {label}
                </a>
              )
          )}
        </div>
      </div>
    </section>
  );
}
