import { getLinks } from '@/app/actions/links';
import { LinksList } from '@/components/admin/links/LinksList';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import Link from 'next/link';

export default async function AdminLinksPage() {
  const links = await getLinks();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Manage Links</h1>
        <Button asChild>
          <Link href="/admin/links/new">
            <Plus className="mr-2 h-4 w-4" />
            Add Link
          </Link>
        </Button>
      </div>

      <LinksList initialLinks={links} />
    </div>
  );
}
