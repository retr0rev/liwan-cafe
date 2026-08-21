import { useI18n } from '../i18n/I18nContext';
import { useMenuData } from '../hooks/useMenuData';

export function Footer() {
  const { t } = useI18n();
  const { settings } = useMenuData();
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-gold/15 bg-cream-dark/30 px-4 py-6 text-center text-sm text-ink/60">
      <p>
        {settings.footer_text} {year} {t('footer.rights')}
      </p>
    </footer>
  );
}
