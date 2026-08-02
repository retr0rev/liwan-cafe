import type { ButtonHTMLAttributes } from 'react';

type Variant = 'primary' | 'ghost' | 'danger';

const variants: Record<Variant, string> = {
  primary: 'bg-green text-cream hover:bg-green-light',
  ghost: 'bg-transparent text-green border border-green/20 hover:bg-green/5',
  danger: 'bg-red-600 text-white hover:bg-red-700',
};

export function Button({
  variant = 'primary',
  className = '',
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant }) {
  return (
    <button
      className={`rounded-lg px-4 py-2 text-sm font-semibold transition active:scale-95 ${variants[variant]} ${className}`}
      {...props}
    />
  );
}
