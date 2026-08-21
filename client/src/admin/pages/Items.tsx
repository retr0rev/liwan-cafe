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
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-emerald">الأصناف</h1>
        <Button onClick={() => setEditing({})}>إضافة صنف</Button>
      </div>

      <Table headers={['الاسم', 'الفئة', 'السعر', 'الحالة', 'علامات', 'إجراءات']}>
        {items.map((i) => (
          <tr key={i.id} className="border-b border-gold/5">
            <td className="px-4 py-3">
              <div className="flex items-center gap-2">
                {i.image_url && (
                  <img src={i.image_url} className="h-8 w-8 rounded object-cover" alt="" />
                )}
                {i.name_en}
              </div>
            </td>
            <td className="px-4 py-3">{catName(i.category_id)}</td>
            <td className="px-4 py-3">${Number(i.price).toFixed(2)}</td>
            <td className="px-4 py-3">
              <button
                onClick={() => toggleAvailable(i)}
                className={`rounded-full px-3 py-1 text-xs font-semibold ${
                  i.is_available ? 'bg-emerald/15 text-emerald' : 'bg-red-100 text-red-600'
                }`}
              >
                {i.is_available ? 'متوفر' : 'غير متوفر'}
              </button>
            </td>
            <td className="px-4 py-3">
              <div className="flex flex-wrap gap-1">
                {(['is_popular', 'is_new', 'is_vegetarian', 'is_spicy'] as const).map((f) => (
                  <button
                    key={f}
                    onClick={() => toggleFlag(i, f)}
                    className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                      i[f] ? 'bg-chocolate/15 text-ink' : 'bg-emerald/5 text-ink/40'
                    }`}
                  >
                    {f.replace('is_', '')}
                  </button>
                ))}
              </div>
            </td>
            <td className="px-4 py-3">
              <div className="flex gap-1">
                <button onClick={() => setEditing(i)} className="rounded px-2 text-emerald hover:bg-emerald/5">
                  تعديل
                </button>
                <button onClick={() => setDeleting(i)} className="rounded px-2 text-red-600 hover:bg-red-50">
                  حذف
                </button>
              </div>
            </td>
          </tr>
        ))}
      </Table>

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
