import type { InputHTMLAttributes } from 'react';

export function Input({ className = '', ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={`w-full rounded-lg border border-green/15 bg-white px-3 py-2 text-sm outline-none focus:border-green ${className}`}
      {...props}
    />
  );
}
