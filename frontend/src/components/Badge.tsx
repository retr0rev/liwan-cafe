const styles: Record<string, string> = {
  new: 'bg-green/15 text-green',
  popular: 'bg-chocolate/15 text-chocolate',
  spicy: 'bg-red-100 text-red-700',
  vegetarian: 'bg-green-100 text-green-700',
};

export function Badge({ type, children }: { type: string; children: string }) {
  return (
    <span
      className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${styles[type] || ''}`}
    >
      {children}
    </span>
  );
}
