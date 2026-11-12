import { createClient } from '@/lib/supabase/server';
import LeadsTable from '@/components/admin/LeadsTable';

export default async function AdminLeadsPage() {
  const supabase = createClient();
  const { data: leads } = await supabase
    .from('leads')
    .select('*, property:properties(title)')
    .order('created_at', { ascending: false });

  return (
    <div>
      <h1 className="font-display text-2xl font-bold mb-6">Lead Management</h1>
      <LeadsTable initialLeads={leads || []} />
    </div>
  );
}
