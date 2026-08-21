import { useMenuData } from '../hooks/useMenuData';

export function LogoPlaceholder({ className = 'h-10 w-10' }: { className?: string }) {
  const { settings } = useMenuData();
  const src = settings.logo_url || '/logo.jpg';
  return <img src={src} alt="logo" className={`${className} rounded-full object-cover shadow-sm`} />;
}
