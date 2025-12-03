"use client";

import { ArtitisCard } from "@/components/artitis-card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import * as React from "react";

type DestaqueProps = {
  image: string;
  artist: {
    name: string;
    avatar: string;
    professions: string[];
    rankingPosition: number;
    profileUrl?: string;
  };
};

export function Destaques() {
  const destaques: DestaqueProps[] = [
    {
      image: "https://placehold.co/1920x1080/EEE/31343C?text=1",
      artist: {
        name: "Carlos David",
        avatar: "https://github.com/carlosdavid0.png",
        professions: ["Designer Gráfico", "Ilustrador"],
        rankingPosition: 1,
      },
    },
    {
      image: "https://placehold.co/1920x1080/EEE/31343C?text=2",
      artist: {
        name: "Carlos David",
        avatar: "https://github.com/carlosdavid0.png",
        professions: ["Designer Gráfico", "Ilustrador", "Social Media Design"],
        rankingPosition: 16,
      },
    },
    {
      image: "https://placehold.co/1920x1080/EEE/31343C?text=3",
      artist: {
        name: "Carlos David",
        avatar: "https://github.com/carlosdavid0.png",
        professions: ["Ilustradora", "Concept Artist"],
        rankingPosition: 5,
      },
    },
  ];

  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [api, setApi] = React.useState<CarouselApi>();

  React.useEffect(() => {
    if (!api) return;

    api.on("select", () => {
      setCurrentIndex(api.selectedScrollSnap());
    });
  }, [api]);

  const destaque = destaques[currentIndex];

  return (
    <section className="w-full py-8 sm:py-12 lg:py-16 min-h-[calc(50vh)]">
      <article className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl lg:text-4xl font-medium text-center leading-tight mb-8">
          Destaque da Semana
        </h2>

        <div className="w-full space-y-6">
          <Carousel
            setApi={setApi}
            plugins={[
              Autoplay({
                delay: 10000,
                stopOnInteraction: true,
              }),
            ]}
            opts={{
              loop: true,
              align: "start",
            }}
            className="w-full"
          >
            <CarouselContent className="-ml-2 sm:-ml-4">
              {destaques.map((item, index) => (
                <CarouselItem key={index} className="pl-2 sm:pl-4">
                  <div className="w-full rounded-xl overflow-hidden max-h-[520px] h-[35vh] sm:h-[45vh] lg:h-[55vh]">
                    <img
                      src={item.image}
                      alt={`Destaque ${index + 1}`}
                      className="w-full h-full object-cover rounded-xl"
                    />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="hidden lg:flex" />
            <CarouselNext className="hidden lg:flex" />
          </Carousel>
          <ArtitisCard name={destaque.artist.name} avatar={destaque.artist.avatar} professions={destaque.artist.professions} rankingPosition={destaque.artist.rankingPosition} />
        </div>
      </article>
    </section>
  );
}
