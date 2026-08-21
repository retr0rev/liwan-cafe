import { useI18n } from '../i18n/I18nContext';
import { useMenuData } from '../hooks/useMenuData';

export function About() {
  const { lang, t } = useI18n();
  const { settings } = useMenuData();
  const desc = lang === 'ar' ? (settings.about_ar || settings.description_ar) : (settings.about_en || settings.description_en);
  const hours = lang === 'ar' ? settings.hours_ar : settings.hours_en;
  const address = lang === 'ar' ? settings.address_ar : settings.address_en;

  return (
    <section id="about" className="scroll-mt-16 px-4 py-10">
      <div className="mx-auto max-w-2xl space-y-6">
        <h2 className="font-display text-3xl font-bold text-emerald">{t('about.title')}</h2>
        {desc && <p className="leading-relaxed text-ink/70">{desc}</p>}
        <div className="rounded-2xl bg-white/80 p-5 shadow-sm border border-gold/10">
          <h3 className="mb-2 font-semibold text-ink">{t('about.hours')}</h3>
          <p className="text-ink/70">{hours}</p>
        </div>
        <div className="rounded-2xl bg-white/80 p-5 shadow-sm border border-gold/10">
          <h3 className="mb-2 font-semibold text-ink">{t('about.contact')}</h3>
          {settings.phone && <p className="text-ink/70">{settings.phone}</p>}
          {address && <p className="text-ink/70">{address}</p>}
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
                  className="rounded-full bg-emerald px-5 py-2 text-sm font-semibold text-cream transition active:scale-95"
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
