"use client";
import { ContentHeron } from "@/components/@landing/hero";
import { Ranking } from "@/components/@landing/ranking";

export default function PublicPage() {
  return (
   <section>
    <ContentHeron />

    <section className="bg-magic-dark">
      <Ranking />
    </section>
   </section>
  );
}
