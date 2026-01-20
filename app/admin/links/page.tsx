import { getLinks } from '@/app/actions/links';
import { LinksList } from '@/components/admin/links/LinksList';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Plus } from 'lucide-react';
import Link from 'next/link';

export default async function AdminLinksPage() {
  const links = await getLinks();

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
            <h1 className="text-3xl font-bold tracking-tight">Gerenciar Links</h1>
            <p className="text-muted-foreground mt-1">
                Organize os links que aparecem na sua página pública
            </p>
        </div>
        <div className="flex gap-2">
            <Button variant="outline" size="sm" asChild className="border-white/10 hover:bg-white/5">
                <Link href="/admin">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Voltar
                </Link>
            </Button>
            <Button asChild size="sm">
                <Link href="/admin/links/new">
                    <Plus className="w-4 h-4 mr-2" />
                    Novo Link
                </Link>
            </Button>
        </div>
      </div>

      <div className="rounded-xl border border-white/5 bg-white/[0.02] p-6 backdrop-blur-sm min-h-[400px]">
          <LinksList initialLinks={links} />
      </div>
    </div>
  );
}
