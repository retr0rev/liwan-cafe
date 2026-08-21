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
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-green">Categories</h1>
        <Button onClick={() => setEditing({})}>Add Category</Button>
      </div>

      <Table headers={['EN', 'AR', 'Order', 'Active', 'Actions']}>
        {cats.map((c) => (
          <tr key={c.id} className="border-b border-green/5">
            <td className="px-4 py-3">{c.name_en}</td>
            <td className="px-4 py-3">{c.name_ar}</td>
            <td className="px-4 py-3">{c.display_order}</td>
            <td className="px-4 py-3">
              <button
                onClick={() => toggle(c)}
                className={`rounded-full px-3 py-1 text-xs font-semibold ${
                  c.is_active ? 'bg-green/15 text-green' : 'bg-red-100 text-red-600'
                }`}
              >
                {c.is_active ? 'Active' : 'Disabled'}
              </button>
            </td>
            <td className="px-4 py-3">
              <div className="flex gap-1">
                <button
                  onClick={() => move(c, -1)}
                  className="rounded px-2 text-chocolate/60 hover:bg-green/5"
                >
                  ↑
                </button>
                <button
                  onClick={() => move(c, 1)}
                  className="rounded px-2 text-chocolate/60 hover:bg-green/5"
                >
                  ↓
                </button>
                <button
                  onClick={() => setEditing(c)}
                  className="rounded px-2 text-green hover:bg-green/5"
                >
                  Edit
                </button>
                <button
                  onClick={() => setDeleting(c)}
                  className="rounded px-2 text-red-600 hover:bg-red-50"
                >
                  Delete
                </button>
              </div>
            </td>
          </tr>
        ))}
      </Table>

      <Modal
        open={!!editing}
        onClose={() => setEditing(null)}
        title={editing?.id ? 'Edit Category' : 'New Category'}
      >
        <div className="space-y-3">
          <Input
            placeholder="Name (English)"
            value={editing?.name_en || ''}
            onChange={(e) => setEditing({ ...editing, name_en: e.target.value })}
          />
          <Input
            placeholder="Name (Arabic)"
            value={editing?.name_ar || ''}
            onChange={(e) => setEditing({ ...editing, name_ar: e.target.value })}
          />
          <Input
            type="number"
            placeholder="Display order"
            value={editing?.display_order ?? 0}
            onChange={(e) =>
              setEditing({ ...editing, display_order: Number(e.target.value) })
            }
          />
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={!!editing?.is_active}
              onChange={(e) => setEditing({ ...editing, is_active: e.target.checked })}
            />
            Active
          </label>
          <Button onClick={save}>{editing?.id ? 'Save' : 'Create'}</Button>
        </div>
      </Modal>

      <Modal
        open={!!deleting}
        onClose={() => setDeleting(null)}
        title="Delete Category"
      >
        <p className="mb-4 text-sm text-chocolate/80">
          Delete "{deleting?.name_en}"? All items in it will be removed.
        </p>
        <Button variant="danger" onClick={remove}>
          Delete
        </Button>
      </Modal>
    </div>
  );
}
