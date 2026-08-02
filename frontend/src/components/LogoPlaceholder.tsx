export function LogoPlaceholder({ className = 'h-10 w-10' }: { className?: string }) {
  return (
    <div
      className={`${className} rounded-xl border-2 border-dashed border-green/40 bg-green/10`}
      aria-label="Logo placeholder"
    />
  );
}
