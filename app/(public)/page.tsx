import { ContentHeron } from "@/components/@landing/hero";

export default function PublicPage() {
  return (
    <section className="w-full overflow-y-hidden! h-[80vh] flex items-center justify-center">
      <ContentHeron />

      {/* <section className="bg-magic-light w-full">
        <Ranking />
      </section> */}
      {/* <section className="bg-magic-dark w-full">
        <Destaques />
      </section> */}
      {/* <section className="bg-magic-light w-full">
        <Desafios />
      </section> */}
      {/* <section className="bg-magic-dark w-full">
        <ArtistasParaContratar />
      </section> */}
      {/* <section className="bg-magic-light w-full">
        <Apoiadores />
      </section> */}
      {/* <section className="bg-magic-dark w-full">
        <RecentesBlog />
      </section> */}
    </section>
  );
}
