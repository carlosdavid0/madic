import { PublicWrapper } from '@/components/public-wrapper';
import Link from 'next/link';

export default function NotFound() {
  return (
    <PublicWrapper>
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)]">
        <div className="text-center space-y-6">
          <h1 className="text-9xl font-bold text-white/90">404</h1>
          <h2 className="text-3xl font-semibold text-white/80">
            Página não encontrada
          </h2>
          <p className="text-lg text-white/60 max-w-md">
            A página que você está procurando não existe ou foi movida.
          </p>
          <Link
            href="/"
            className="inline-block mt-8 px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors duration-200 backdrop-blur-sm border border-white/10"
          >
            Voltar para a página inicial
          </Link>
        </div>
      </div>
    </PublicWrapper>
  );
}

