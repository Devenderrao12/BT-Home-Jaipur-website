import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { formatPrice } from '@/lib/utils';
import { Plus, Pencil } from 'lucide-react';
import DeletePropertyButton from '@/components/admin/DeletePropertyButton';

export default async function AdminPropertiesPage() {
  const supabase = createClient();
  const { data: properties } = await supabase
    .from('properties')
    .select('*, category:categories(name), images:property_images(url, is_cover)')
    .order('created_at', { ascending: false });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl font-bold">Properties</h1>
        <Link href="/admin/properties/new" className="btn-gold !py-2.5">
          <Plus size={16} /> Add Property
        </Link>
      </div>

      <div className="card-luxury overflow-x-auto">
        <table className="w-full text-sm min-w-[700px]">
          <thead>
            <tr className="text-left text-charcoal-500 border-b border-charcoal-100">
              <th className="p-4">Property</th>
              <th>Category</th>
              <th>Price</th>
              <th>Status</th>
              <th>Featured</th>
              <th className="text-right p-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {(properties || []).map((p: any) => (
              <tr key={p.id} className="border-b border-charcoal-50">
                <td className="p-4 font-medium">{p.title}</td>
                <td>{p.category?.name || '—'}</td>
                <td>{formatPrice(p.price)}</td>
                <td className="capitalize">{p.status.replace('_', ' ')}</td>
                <td>{p.is_featured ? 'Yes' : 'No'}</td>
                <td className="p-4 text-right">
                  <div className="flex justify-end gap-3">
                    <Link href={`/admin/properties/${p.id}/edit`} className="text-charcoal-600 hover:text-gold-700">
                      <Pencil size={16} />
                    </Link>
                    <DeletePropertyButton id={p.id} />
                  </div>
                </td>
              </tr>
            ))}
            {(properties || []).length === 0 && (
              <tr><td colSpan={6} className="p-6 text-center text-charcoal-500">No properties yet. Click &quot;Add Property&quot; to create one.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
