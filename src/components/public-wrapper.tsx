import Header from '@/src/components/header';

// Server Component - garante SSR para este wrapper
// Pode renderizar Client Components filhos (como Header) sem problemas
export function PublicWrapper({ children }: { children: React.ReactNode }) {
  return (
    <main className="max-w-7xl mx-auto p-4">
      <Header />
      {children}
    </main>
  );
}

