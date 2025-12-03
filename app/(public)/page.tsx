import { Apoiadores } from "@/components/@landing/apoiadores";
import { ArtistasParaContratar } from "@/components/@landing/artistasParaContratar";
import { Desafios } from "@/components/@landing/desafios";
import { Destaques } from "@/components/@landing/destaques";
import { ContentHeron } from "@/components/@landing/hero";
import { Ranking } from "@/components/@landing/ranking";
import { RecentesBlog } from "@/components/@landing/recentesBlog";

export default function PublicPage() {
  return (
    <section className="w-full overflow-x-hidden">
      <ContentHeron />

      <section className="bg-magic-light w-full">
        <Ranking />
      </section>
      <section className="bg-magic-dark w-full">
        <Destaques />
      </section>
      <section className="bg-magic-light w-full">
        <Desafios />
      </section>
      <section className="bg-magic-dark w-full">
        <ArtistasParaContratar />
      </section>
      <section className="bg-magic-light w-full">
        <Apoiadores />
      </section>
      <section className="bg-magic-dark w-full">
        <RecentesBlog />
      </section>
    </section>
  );
}
