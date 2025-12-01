import Header from '@/components/header';

// Server Component - garante SSR para este wrapper
// Pode renderizar Client Components filhos (como Header) sem problemas
export function PublicWrapper({ children }: { children: React.ReactNode }) {
  return (
    <main className="">
      <Header />
      {children}
    </main>
  );
}

