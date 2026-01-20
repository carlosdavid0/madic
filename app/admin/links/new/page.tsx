import { LinkForm } from '@/components/admin/links/LinkForm';

export default function NewLinkPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-center">Create New Link</h1>
      <LinkForm />
    </div>
  );
}
