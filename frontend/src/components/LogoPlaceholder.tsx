import { useMenuData } from '../hooks/useMenuData';

export function LogoPlaceholder({ className = 'h-10 w-10' }: { className?: string }) {
  const { settings } = useMenuData();
  if (settings.logo_url) {
    return (
      <img src={settings.logo_url} alt="logo" className={`${className} rounded-xl object-contain`} />
    );
  }
  return (
    <div
      className={`${className} rounded-xl border-2 border-dashed border-green/40 bg-green/10`}
      aria-label="Logo placeholder"
    />
  );
}
