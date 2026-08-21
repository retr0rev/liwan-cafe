const styles: Record<string, string> = {
  new: 'bg-emerald/10 text-emerald border border-emerald/20',
  popular: 'bg-gold/15 text-gold border border-gold/30',
  spicy: 'bg-red-100 text-red-700',
  vegetarian: 'bg-emerald/10 text-emerald',
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
