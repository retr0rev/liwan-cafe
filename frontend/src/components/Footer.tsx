import { useI18n } from '../i18n/I18nContext';
import { useMenuData } from '../hooks/useMenuData';

export function Footer() {
  const { t } = useI18n();
  const { settings } = useMenuData();
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-green/10 px-4 py-6 text-center text-sm text-chocolate/60">
      <p>
        {settings.footer_text} {year} {t('footer.rights')}
      </p>
    </footer>
  );
}
