"use client";
import { ContentHeron } from "@/components/@landing/hero";
import { Ranking } from "@/components/@landing/ranking";

export default function PublicPage() {
  return (
    <section className="w-full overflow-x-hidden">
      <ContentHeron />

      <section className="bg-magic-dark w-full">
        <Ranking />
      </section>
    </section>
  );
}
