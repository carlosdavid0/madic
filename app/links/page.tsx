import { getPublicLinks } from '@/app/actions/links';
import { LinkList } from '@/components/links/link-list';
import { cn } from '@/lib/utils';
import Image from 'next/image';

export const metadata = {
  title: 'Links | Madic',
  description: 'Connect with me',
};

export default async function LinksPage() {
  const links = await getPublicLinks();

  return (
    <div className={cn(
      "min-h-screen w-full flex flex-col items-center py-16 px-4 relative overflow-hidden",
      "bg-magic" // Using existing bg-magic but we might want to ensure it looks good with content
    )}>
      
      {/* Content Container */}
      <div className="w-full max-w-lg z-10 flex flex-col gap-8">
        
        {/* Header Profile Section */}
        <div className="flex flex-col items-center text-center space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <Image
            src="/logo-amarela.png"
            alt="Logo"
            width={180}
            height={180}
            className="lg:max-w-full max-w-1/2"
          />

          <p className="text-white/70 max-w-sm mx-auto font-medium">
          Movimento artístico digital no interior do Ceará
          </p>
        </div>

        <LinkList links={links} />

        <div className="mt-8 text-center text-white/30 text-sm animate-in fade-in duration-1000 delay-500">
          © {new Date().getFullYear()} Madic. Todos os direitos reservados.
        </div>

      </div>
    </div>
  );
}
