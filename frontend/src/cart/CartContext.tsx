import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

export type CartItem = { id: number; name_ar: string; name_en: string; price: number; qty: number; image_url?: string | null };

type CartState = {
  items: CartItem[];
  add: (item: Omit<CartItem, 'qty'>) => void;
  remove: (id: number) => void;
  setQty: (id: number, qty: number) => void;
  clear: () => void;
  count: number;
  subtotal: number;
};

const Ctx = createContext<CartState | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => {
    try { return JSON.parse(localStorage.getItem('liwan_cart') || '[]'); } catch { return []; }
  });
  useEffect(() => { localStorage.setItem('liwan_cart', JSON.stringify(items)); }, [items]);
  const add = (item: Omit<CartItem, 'qty'>) => {
    setItems((prev) => {
      const f = prev.find((p) => p.id === item.id);
      if (f) return prev.map((p) => (p.id === item.id ? { ...p, qty: p.qty + 1 } : p));
      return [...prev, { ...item, qty: 1 }];
    });
  };
  const remove = (id: number) => setItems((p) => p.filter((x) => x.id !== id));
  const setQty = (id: number, qty: number) => {
    if (qty <= 0) return remove(id);
    setItems((p) => p.map((x) => (x.id === id ? { ...x, qty } : x)));
  };
  const clear = () => setItems([]);
  const count = items.reduce((s, x) => s + x.qty, 0);
  const subtotal = items.reduce((s, x) => s + Number(x.price) * x.qty, 0);
  return <Ctx.Provider value={{ items, add, remove, setQty, clear, count, subtotal }}>{children}</Ctx.Provider>;
}

export function useCart() {
  const v = useContext(Ctx);
  if (!v) throw new Error('useCart outside provider');
  return v;
}
