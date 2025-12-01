import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

export function Destaques() {
  return (
    <Carousel
      opts={{
        align: "start",
      }}
      className="w-full xl:max-w-5xl max-w-lg select-none"
    >
      <CarouselContent>
        {Array.from({ length: 10 }).map((_, index) => (
          <CarouselItem key={index} className="basis-1/5 md:basis-1/3 xl:basis-1/5">
            <img 
            className="rounded-xl"
            src={`https://placehold.co/600/EEE/31343C?text=${index + 1}`} alt={`Destaque ${index + 1}`} />
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
}