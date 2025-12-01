import Header from '@/components/header';
import { Footer } from './footer';

// Server Component - garante SSR para este wrapper
// Pode renderizar Client Components filhos (como Header) sem problemas
export function PublicWrapper({ children }: { children: React.ReactNode }) {
  return (
    <main className="">
      <Header />
      {children}
      <Footer />
    </main>
  );
}

