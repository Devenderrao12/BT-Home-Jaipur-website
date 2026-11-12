import { createClient } from '@/lib/supabase/server';
import BlogManager from '@/components/admin/BlogManager';

export default async function AdminBlogPage() {
  const supabase = createClient();
  const { data: posts } = await supabase.from('blog_posts').select('*').order('published_at', { ascending: false });

  return (
    <div>
      <h1 className="font-display text-2xl font-bold mb-6">Blog Posts</h1>
      <BlogManager initialPosts={posts || []} />
    </div>
  );
}
