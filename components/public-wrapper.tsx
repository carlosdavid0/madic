import Header from '@/components/header';
import { Footer } from './footer';

// Server Component - garante SSR para este wrapper
// Pode renderizar Client Components filhos (como Header) sem problemas
export function PublicWrapper({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-screen flex flex-col">
      <Header />
      <div className="flex-1 justify-center">
        {children}
      </div>
      <Footer />
    </main>
  );
}

