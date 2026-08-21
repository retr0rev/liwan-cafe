import { useCallback, useEffect, useState } from 'react';
import { api } from '../../api/client';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Modal } from '../components/ui/Modal';
import { Table } from '../components/ui/Table';

interface Item {
  id: number;
  category_id: number;
  name_ar: string;
  name_en: string;
  description_ar: string | null;
  description_en: string | null;
  price: number;
  image_url: string | null;
  is_available: boolean;
  is_popular: boolean;
  is_new: boolean;
  is_vegetarian: boolean;
  is_spicy: boolean;
  display_order: number;
}

interface Cat {
  id: number;
  name_en: string;
  name_ar: string;
}

export function Items() {
  const [items, setItems] = useState<Item[]>([]);
  const [cats, setCats] = useState<Cat[]>([]);
  const [q, setQ] = useState('');
  const [catFilter, setCatFilter] = useState<number | ''>('');
  const filtered = items.filter((i) => {
    const matchQ = !q || i.name_ar.includes(q) || i.name_en.toLowerCase().includes(q.toLowerCase()) || (i.description_ar || '').includes(q);
    const matchCat = !catFilter || i.category_id === catFilter;
    return matchQ && matchCat;
  });
  const sortedCats = [...cats].sort((a, b) => (a as any).display_order - (b as any).display_order || a.id - b.id);
  const grouped = sortedCats.map((c) => ({ cat: c, items: filtered.filter((i) => i.category_id === c.id).sort((a, b) => a.display_order - b.display_order) })).filter((g) => g.items.length > 0);
  const ungrouped = filtered.filter((i) => !cats.find((c) => c.id === i.category_id));
  const [editing, setEditing] = useState<Partial<Item> | null>(null);
  const [deleting, setDeleting] = useState<Item | null>(null);
  const [file, setFile] = useState<File | null>(null);

  const load = useCallback(() => {
    api.getItems().then(setItems).catch(() => {});
    api.getCategories().then(setCats).catch(() => {});
  }, []);
  useEffect(() => {
    load();
  }, [load]);

  const save = async () => {
    if (!editing) return;
    const body = {
      category_id: editing.category_id,
      name_ar: editing.name_ar || '',
      name_en: editing.name_en || '',
      description_ar: editing.description_ar || null,
      description_en: editing.description_en || null,
      price: Number(editing.price) || 0,
      is_available: !!editing.is_available,
      is_popular: !!editing.is_popular,
      is_new: !!editing.is_new,
      is_vegetarian: !!editing.is_vegetarian,
      is_spicy: !!editing.is_spicy,
      display_order: Number(editing.display_order) || 0,
    };
    if (editing.id) {
      await api.updateItem(editing.id, body);
      if (file) await api.uploadItemImage(editing.id, file);
    } else {
      const created = await api.createItem(body);
      if (file) await api.uploadItemImage(created.id, file);
    }
    setEditing(null);
    setFile(null);
    load();
  };

  const toggleAvailable = async (i: Item) => {
    await api.updateItem(i.id, { is_available: !i.is_available });
    load();
  };

  const toggleFlag = async (
    i: Item,
    key: 'is_popular' | 'is_new' | 'is_vegetarian' | 'is_spicy'
  ) => {
    await api.updateItem(i.id, { [key]: !i[key] });
    load();
  };

  const remove = async () => {
    if (!deleting) return;
    await api.deleteItem(deleting.id);
    setDeleting(null);
    load();
  };

  const catName = (id: number) => cats.find((c) => c.id === id)?.name_en || '—';

  return (
    <div dir="rtl">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-emerald">الأصناف</h1>
        <Button onClick={() => setEditing({})}>إضافة صنف</Button>
      </div>
      <div className="mb-4 grid gap-2 sm:grid-cols-2">
        <Input placeholder="بحث عن صنف..." value={q} onChange={(e) => setQ(e.target.value)} />
        <select value={catFilter} onChange={(e) => setCatFilter(e.target.value ? Number(e.target.value) : '')} className="w-full rounded-lg border border-gold/15 bg-white px-3 py-2 text-sm">
          <option value="">كل الفئات</option>
          {cats.map((c) => (
            <option key={c.id} value={c.id}>{c.name_ar || c.name_en}</option>
          ))}
        </select>
      </div>

      <div className="hidden lg:block space-y-6">
        {grouped.length === 0 && ungrouped.length === 0 && <p className="py-8 text-center text-sm text-ink/50">لا يوجد أصناف</p>}
        {grouped.map(({ cat, items }) => (
          <div key={cat.id}>
            <h3 className="mb-2 flex items-center gap-2 text-sm font-bold text-emerald"><span className="h-2 w-2 rounded-full bg-gold" />{cat.name_ar || cat.name_en} <span className="text-xs font-normal text-ink/50">({items.length})</span></h3>
            <Table headers={['الاسم', 'السعر', 'الحالة', 'علامات', 'إجراءات']}>
              {items.map((i) => (
                <tr key={i.id} className="border-b border-gold/5">
                  <td className="px-4 py-3"><div className="flex items-center gap-2">{i.image_url && <img src={i.image_url} className="h-8 w-8 rounded object-cover" alt="" />}{i.name_ar || i.name_en}</div></td>
                  <td className="px-4 py-3 whitespace-nowrap" dir="ltr">{Number(i.price).toLocaleString('en-US')} ل.س</td>
                  <td className="px-4 py-3"><button onClick={() => toggleAvailable(i)} className={`rounded-full px-3 py-1 text-xs font-semibold ${i.is_available ? 'bg-emerald/15 text-emerald' : 'bg-red-100 text-red-600'}`}>{i.is_available ? 'متوفر' : 'غير متوفر'}</button></td>
                  <td className="px-4 py-3"><div className="flex flex-wrap gap-1">{(['is_popular', 'is_new', 'is_vegetarian', 'is_spicy'] as const).map((f) => (<button key={f} onClick={() => toggleFlag(i, f)} className={`rounded-full px-2 py-0.5 text-xs font-semibold ${i[f] ? 'bg-ink/15 text-ink' : 'bg-emerald/5 text-ink/40'}`}>{f.replace('is_', '')}</button>))}</div></td>
                  <td className="px-4 py-3"><div className="flex gap-1"><button onClick={() => setEditing(i)} className="rounded px-2 text-emerald hover:bg-emerald/5">تعديل</button><button onClick={() => setDeleting(i)} className="rounded px-2 text-red-600 hover:bg-red-50">حذف</button></div></td>
                </tr>
              ))}
            </Table>
          </div>
        ))}
        {ungrouped.length > 0 && (
          <div>
            <h3 className="mb-2 text-sm font-bold text-ink/60">بدون فئة</h3>
            <Table headers={['الاسم', 'السعر', 'الحالة', 'علامات', 'إجراءات']}>
              {ungrouped.map((i) => (
                <tr key={i.id} className="border-b border-gold/5">
                  <td className="px-4 py-3">{i.name_ar || i.name_en}</td>
                  <td className="px-4 py-3 whitespace-nowrap" dir="ltr">{Number(i.price).toLocaleString('en-US')} ل.س</td>
                  <td className="px-4 py-3"><button onClick={() => toggleAvailable(i)} className={`rounded-full px-3 py-1 text-xs font-semibold ${i.is_available ? 'bg-emerald/15 text-emerald' : 'bg-red-100 text-red-600'}`}>{i.is_available ? 'متوفر' : 'غير متوفر'}</button></td>
                  <td className="px-4 py-3"><div className="flex flex-wrap gap-1">{(['is_popular', 'is_new', 'is_vegetarian', 'is_spicy'] as const).map((f) => (<button key={f} onClick={() => toggleFlag(i, f)} className={`rounded-full px-2 py-0.5 text-xs font-semibold ${i[f] ? 'bg-ink/15 text-ink' : 'bg-emerald/5 text-ink/40'}`}>{f.replace('is_', '')}</button>))}</div></td>
                  <td className="px-4 py-3"><div className="flex gap-1"><button onClick={() => setEditing(i)} className="rounded px-2 text-emerald hover:bg-emerald/5">تعديل</button><button onClick={() => setDeleting(i)} className="rounded px-2 text-red-600 hover:bg-red-50">حذف</button></div></td>
                </tr>
              ))}
            </Table>
          </div>
        )}
      </div>

      <div className="space-y-6 lg:hidden">
        {grouped.length === 0 && ungrouped.length === 0 && <p className="py-8 text-center text-sm text-ink/50">لا يوجد أصناف</p>}
        {grouped.map(({ cat, items }) => (
          <div key={cat.id}>
            <h3 className="mb-2 flex items-center gap-2 text-sm font-bold text-emerald"><span className="h-2 w-2 rounded-full bg-gold" />{cat.name_ar || cat.name_en} <span className="text-xs font-normal text-ink/50">({items.length})</span></h3>
            <div className="grid gap-3">
              {items.map((i) => (
                <div key={i.id} className="rounded-2xl bg-white p-4 shadow-sm border border-gold/10">
                  <div className="flex gap-3">
                    {i.image_url ? <img src={i.image_url} alt="" className="h-16 w-16 rounded-xl object-cover shrink-0" /> : <div className="h-16 w-16 rounded-xl bg-emerald/10 shrink-0" />}
                    <div className="min-w-0 flex-1">
                      <p className="font-bold text-ink leading-tight">{i.name_ar || i.name_en}</p>
                      <p className="text-xs text-ink/60 truncate">{i.name_en}</p>
                      <p className="mt-1 text-xs text-ink/50"><span dir="ltr" className="whitespace-nowrap font-bold text-gold">{Number(i.price).toLocaleString('en-US')} ل.س</span></p>
                    </div>
                    <span className={`h-fit rounded-full px-2 py-1 text-xs font-bold ${i.is_available ? 'bg-emerald/10 text-emerald' : 'bg-red-100 text-red-600'}`}>{i.is_available ? 'متوفر' : 'مخفي'}</span>
                  </div>
                  {i.description_ar && <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-ink/60">{i.description_ar}</p>}
                  <div className="mt-3 flex flex-wrap gap-1">
                    {(['is_popular', 'is_new', 'is_vegetarian', 'is_spicy'] as const).map((f) => (
                      <button key={f} onClick={() => toggleFlag(i, f)} className={`rounded-full px-2.5 py-1 text-xs font-semibold border ${i[f] ? 'bg-gold/15 text-ink border-gold/20' : 'bg-white text-ink/40 border-gold/10'}`}>{f.replace('is_', '')}</button>
                    ))}
                  </div>
                  <div className="mt-3 grid grid-cols-2 gap-2">
                    <button onClick={() => setEditing(i)} className="rounded-full bg-emerald py-2.5 text-sm font-bold text-cream">تعديل</button>
                    <button onClick={() => setDeleting(i)} className="rounded-full bg-red-50 py-2.5 text-sm font-bold text-red-600">حذف</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
        {ungrouped.length > 0 && (
          <div>
            <h3 className="mb-2 text-sm font-bold text-ink/60">بدون فئة</h3>
            <div className="grid gap-3">
              {ungrouped.map((i) => (
                <div key={i.id} className="rounded-2xl bg-white p-4 shadow-sm border border-gold/10">
                  <div className="flex gap-3">
                    {i.image_url ? <img src={i.image_url} alt="" className="h-16 w-16 rounded-xl object-cover shrink-0" /> : <div className="h-16 w-16 rounded-xl bg-emerald/10 shrink-0" />}
                    <div className="min-w-0 flex-1">
                      <p className="font-bold text-ink leading-tight">{i.name_ar || i.name_en}</p>
                      <p className="mt-1 text-xs"><span dir="ltr" className="whitespace-nowrap font-bold text-gold">{Number(i.price).toLocaleString('en-US')} ل.س</span></p>
                    </div>
                    <span className={`h-fit rounded-full px-2 py-1 text-xs font-bold ${i.is_available ? 'bg-emerald/10 text-emerald' : 'bg-red-100 text-red-600'}`}>{i.is_available ? 'متوفر' : 'مخفي'}</span>
                  </div>
                  <div className="mt-3 grid grid-cols-2 gap-2">
                    <button onClick={() => setEditing(i)} className="rounded-full bg-emerald py-2.5 text-sm font-bold text-cream">تعديل</button>
                    <button onClick={() => setDeleting(i)} className="rounded-full bg-red-50 py-2.5 text-sm font-bold text-red-600">حذف</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <Modal open={!!editing} onClose={() => setEditing(null)} title={editing?.id ? 'تعديل الصنف' : 'صنف جديد'}>
        <div className="space-y-3">
          <select value={editing?.category_id || ''} onChange={(e) => setEditing({ ...editing, category_id: Number(e.target.value) })} className="w-full rounded-lg border border-gold/15 bg-white px-3 py-2 text-sm">
            <option value="">الفئة</option>
            {cats.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name_ar || c.name_en}
              </option>
            ))}
          </select>
          <Input placeholder="الاسم (إنجليزي)" value={editing?.name_en || ''} onChange={(e) => setEditing({ ...editing, name_en: e.target.value })} />
          <Input placeholder="الاسم (عربي)" value={editing?.name_ar || ''} onChange={(e) => setEditing({ ...editing, name_ar: e.target.value })} />
          <Input placeholder="الوصف (إنجليزي)" value={editing?.description_en || ''} onChange={(e) => setEditing({ ...editing, description_en: e.target.value })} />
          <Input placeholder="الوصف (عربي)" value={editing?.description_ar || ''} onChange={(e) => setEditing({ ...editing, description_ar: e.target.value })} />
          <Input type="number" step="0.01" placeholder="السعر (ل.س)" value={editing?.price ?? ''} onChange={(e) => setEditing({ ...editing, price: Number(e.target.value) })} />
          <Input type="number" placeholder="الترتيب" value={editing?.display_order ?? 0} onChange={(e) => setEditing({ ...editing, display_order: Number(e.target.value) })} />
          <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] || null)} />
          {editing?.image_url && (
            <img src={editing.image_url} className="h-16 w-16 rounded object-cover" alt="" />
          )}
          <div className="grid grid-cols-2 gap-2 text-sm">
            {(
              [
                'is_available',
                'is_popular',
                'is_new',
                'is_vegetarian',
                'is_spicy',
              ] as const
            ).map((f) => (
              <label key={f} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={!!editing?.[f]}
                  onChange={(e) => setEditing({ ...editing, [f]: e.target.checked })}
                />
                {f.replace('is_', '')}
              </label>
            ))}
          </div>
          <Button onClick={save}>{editing?.id ? 'حفظ' : 'إنشاء'}</Button>
        </div>
      </Modal>

      <Modal open={!!deleting} onClose={() => setDeleting(null)} title="حذف الصنف">
        <p className="mb-4 text-sm text-ink/80">حذف "{deleting?.name_ar || deleting?.name_en}"؟</p>
        <Button variant="danger" onClick={remove}>حذف</Button>
      </Modal>
    </div>
  );
}
