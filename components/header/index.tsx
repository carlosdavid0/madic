import { getCurrentUser } from '@/lib/auth/get-user';
import { headers } from 'next/headers';
import Image from 'next/image';
import Link from 'next/link';
import { Nav } from './nav';
import { SheetMenu } from './sheet-menu';
import { User } from './user';

export default async function Header() {
  const headersList = await headers();
  const pathname = headersList.get('x-pathname') || '/';

  const user = await getCurrentUser();

  return (
    <header className="flex justify-between items-center w-full py-4 mx-auto max-w-7xl px-4 2xl:px-0 pt-4">
      <Link href="/" className="flex items-center">
        <Image
          src="/logo-amarela.png"
          alt="Logo"
          width={180}
          height={180}
          className="lg:max-w-full max-w-1/2"
        />
      </Link>
      <Nav pathname={pathname} />
      <div className="flex items-center gap-4">
        <User user={user} />
        <SheetMenu pathname={pathname} user={user} />
      </div>
    </header>
  );
}
