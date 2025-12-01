"use client";
import { Desafios } from "@/components/@landing/desafios";
import { Destaques } from "@/components/@landing/destaques";
import { ContentHeron } from "@/components/@landing/hero";
import { Ranking } from "@/components/@landing/ranking";

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
    </section>
  );
}
