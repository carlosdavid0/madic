import { LinkForm } from '@/components/admin/links/LinkForm';
import { db } from '@/lib/db';
import { links } from '@/lib/db/schema/links';
import { eq } from 'drizzle-orm';
import { notFound } from 'next/navigation';

interface EditLinkPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditLinkPage({ params }: EditLinkPageProps) {
  const { id } = await params;
  const link = await db.query.links.findFirst({
    where: eq(links.id, id),
  });

  if (!link) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-center">Edit Link</h1>
      <LinkForm initialData={link} />
    </div>
  );
}
