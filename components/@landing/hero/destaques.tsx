import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

import Autoplay from "embla-carousel-autoplay";

export function Destaques() {
  return (
    <Carousel
      plugins={[
        Autoplay({
          delay: 2000,
          stopOnInteraction: true,
        }),
      ]}
      opts={{
        loop: true,
        align: "start",
      }}
      className="
        w-full 
        max-w-xs sm:max-w-lg md:max-w-2xl lg:max-w-4xl xl:max-w-5xl 
        select-none mx-auto 
        px-4 sm:px-6 lg:px-8
      "
    >
      <CarouselContent className="-ml-2 sm:-ml-4">
        {Array.from({ length: 10 }).map((_, index) => (
          <CarouselItem
            key={index}
            className="
              basis-1/2 
              sm:basis-1/3 
              md:basis-1/4 
              lg:basis-1/5 
            "
          >
            <img
              className="rounded-xl w-full h-auto"
              src={`https://placehold.co/600/EEE/31343C?text=${index + 1}`}
              alt={`Destaque ${index + 1}`}
            />
          </CarouselItem>
        ))}
      </CarouselContent>

      <CarouselPrevious className="" />
      <CarouselNext className="" />

    </Carousel>
  );
}
