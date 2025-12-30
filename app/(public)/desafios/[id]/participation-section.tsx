'use client';

import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/contexts/auth-context";
import Link from "next/link";

export default function ParticipationSection({ id }: { id: string }) {
  const { user } = useAuth();
  

  return (
    <section className="bg-magic-dark w-full py-12 sm:py-16">
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
      <div className="text-6xl mb-6">🏆</div>
      <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
        Pronto para participar?
      </h2>
      <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
        Faça login para enviar sua participação e concorrer aos prêmios!
      </p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button asChild size="lg" className="h-16 px-12 text-lg rounded-none!">
          <Link href={user ? `/desafios/${id}/participate` : '/login'}>
            {user ? 'Participar' : 'Fazer Login'}
          </Link>
        </Button>
        <Button asChild variant="secondary" size="lg" className="h-16 px-12 text-lg rounded-none!">
          <Link href="/desafios">
            Ver Outros Desafios
          </Link>
        </Button>
      </div>
    </div>
  </section>
  );
}