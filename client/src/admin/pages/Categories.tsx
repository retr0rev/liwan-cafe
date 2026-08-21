import { useCallback, useEffect, useState } from 'react';
import { api } from '../../api/client';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Modal } from '../components/ui/Modal';
import { Table } from '../components/ui/Table';

interface Cat {
  id: number;
  name_ar: string;
  name_en: string;
  display_order: number;
  is_active: boolean;
}

export function Categories() {
  const [cats, setCats] = useState<Cat[]>([]);
  const [editing, setEditing] = useState<Partial<Cat> | null>(null);
  const [deleting, setDeleting] = useState<Cat | null>(null);

  const load = useCallback(() => api.getCategories().then(setCats).catch(() => {}), []);
  useEffect(() => {
    load();
  }, [load]);

  const save = async () => {
    if (!editing) return;
    const body = {
      name_ar: editing.name_ar || '',
      name_en: editing.name_en || '',
      display_order: Number(editing.display_order) || 0,
      is_active: !!editing.is_active,
    };
    if (editing.id) await api.updateCategory(editing.id, body);
    else await api.createCategory(body);
    setEditing(null);
    load();
  };

  const toggle = async (c: Cat) => {
    await api.updateCategory(c.id, { is_active: !c.is_active });
    load();
  };

  const remove = async () => {
    if (!deleting) return;
    await api.deleteCategory(deleting.id);
    setDeleting(null);
    load();
  };

  const move = async (c: Cat, dir: -1 | 1) => {
    const sorted = [...cats].sort((a, b) => a.display_order - b.display_order);
    const i = sorted.findIndex((x) => x.id === c.id);
    const j = i + dir;
    if (j < 0 || j >= sorted.length) return;
    const other = sorted[j];
    await api.updateCategory(c.id, { display_order: other.display_order });
    await api.updateCategory(other.id, { display_order: c.display_order });
    load();
  };

  return (
    <div dir="rtl">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-emerald">الفئات</h1>
        <Button onClick={() => setEditing({})}>إضافة فئة</Button>
      </div>

      <div className="hidden lg:block">
        <Table headers={['EN', 'AR', 'الترتيب', 'نشط', 'إجراءات']}>
          {cats.map((c) => (
            <tr key={c.id} className="border-b border-gold/5">
              <td className="px-4 py-3">{c.name_en}</td>
              <td className="px-4 py-3">{c.name_ar}</td>
              <td className="px-4 py-3">{c.display_order}</td>
              <td className="px-4 py-3">
                <button onClick={() => toggle(c)} className={`rounded-full px-3 py-1 text-xs font-semibold ${c.is_active ? 'bg-emerald/15 text-emerald' : 'bg-red-100 text-red-600'}`}>
                  {c.is_active ? 'نشط' : 'معطل'}
                </button>
              </td>
              <td className="px-4 py-3">
                <div className="flex gap-1">
                  <button onClick={() => move(c, -1)} className="rounded px-2 text-ink/60 hover:bg-emerald/5">↑</button>
                  <button onClick={() => move(c, 1)} className="rounded px-2 text-ink/60 hover:bg-emerald/5">↓</button>
                  <button onClick={() => setEditing(c)} className="rounded px-2 text-emerald hover:bg-emerald/5">تعديل</button>
                  <button onClick={() => setDeleting(c)} className="rounded px-2 text-red-600 hover:bg-red-50">حذف</button>
                </div>
              </td>
            </tr>
          ))}
        </Table>
      </div>

      <div className="grid gap-3 lg:hidden">
        {cats.length === 0 && <p className="py-8 text-center text-sm text-ink/50">لا يوجد فئات</p>}
        {cats.map((c) => (
          <div key={c.id} className="rounded-2xl bg-white p-4 shadow-sm border border-gold/10">
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="font-bold text-ink">{c.name_ar}</p>
                <p className="text-sm text-ink/60">{c.name_en}</p>
              </div>
              <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${c.is_active ? 'bg-emerald/10 text-emerald' : 'bg-red-100 text-red-600'}`}>{c.is_active ? 'نشط' : 'معطل'}</span>
            </div>
            <p className="mt-2 text-xs text-ink/50">الترتيب: {c.display_order}</p>
            <div className="mt-3 flex flex-wrap gap-1.5">
              <button onClick={() => setEditing(c)} className="flex-1 rounded-full bg-emerald py-2 text-sm font-bold text-cream">تعديل</button>
              <button onClick={() => setDeleting(c)} className="flex-1 rounded-full bg-red-50 py-2 text-sm font-bold text-red-600">حذف</button>
            </div>
            <div className="mt-2 flex justify-center gap-1">
              <button onClick={() => move(c, -1)} className="rounded-full border border-gold/20 px-3 py-1 text-xs">↑ للأعلى</button>
              <button onClick={() => move(c, 1)} className="rounded-full border border-gold/20 px-3 py-1 text-xs">↓ للأسفل</button>
              <button onClick={() => toggle(c)} className="rounded-full border border-gold/20 px-3 py-1 text-xs">{c.is_active ? 'تعطيل' : 'تفعيل'}</button>
            </div>
          </div>
        ))}
      </div>

      <Modal open={!!editing} onClose={() => setEditing(null)} title={editing?.id ? 'تعديل الفئة' : 'فئة جديدة'}>
        <div className="space-y-3">
          <Input placeholder="الاسم (إنجليزي)" value={editing?.name_en || ''} onChange={(e) => setEditing({ ...editing, name_en: e.target.value })} />
          <Input placeholder="الاسم (عربي)" value={editing?.name_ar || ''} onChange={(e) => setEditing({ ...editing, name_ar: e.target.value })} />
          <Input type="number" placeholder="الترتيب" value={editing?.display_order ?? 0} onChange={(e) => setEditing({ ...editing, display_order: Number(e.target.value) })} />
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={!!editing?.is_active} onChange={(e) => setEditing({ ...editing, is_active: e.target.checked })} />
            نشط
          </label>
          <Button onClick={save}>{editing?.id ? 'حفظ' : 'إنشاء'}</Button>
        </div>
      </Modal>

      <Modal open={!!deleting} onClose={() => setDeleting(null)} title="حذف الفئة">
        <p className="mb-4 text-sm text-ink/80">حذف "{deleting?.name_en}"؟ سيتم حذف جميع الأصناف فيها.</p>
        <Button variant="danger" onClick={remove}>حذف</Button>
      </Modal>
    </div>
  );
}
