import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

type NoticiaProps = {
  image: string;
  title: string;
  excerpt: string;
  url?: string;
};

export function RecentesBlog() {
  const noticias: NoticiaProps[] = [
    {
      image: "https://placehold.co/600x400/EEE/31343C?text=Imagem",
      title: "Novas regras dos Desafios",
      excerpt:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      url: "#",
    },
    {
      image: "https://placehold.co/800x600/EEE/31343C?text=Imagem",
      title: "Desafios de Novembro",
      excerpt:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      url: "#",
    },
    {
      image: "https://placehold.co/800x600/EEE/31343C?text=Imagem",
      title: "Título da Notícia 3",
      excerpt:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      url: "#",
    },
  ];

  return (
    <section className="w-full py-8 sm:py-12 lg:py-16 min-h-[calc(50vh)]">
      <article className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl lg:text-4xl font-medium text-center leading-tight mb-8">
          Últimas notícias
        </h2>

        <Carousel
          opts={{
            loop: true,
            align: "start",
          }}
          className="w-full"
        >
          <CarouselContent className="-ml-2 sm:-ml-4">
            {noticias.map((noticia, index) => (
              <CarouselItem key={index} className="pl-2 sm:pl-4">
                <div className="w-full flex flex-col lg:flex-row gap-6 lg:gap-8">
                  <div className="w-full lg:w-1/2 rounded-xl overflow-hidden bg-gray-200 dark:bg-zinc-800 min-h-[300px] sm:min-h-[400px] lg:min-h-[500px] relative">
                    <img
                      src={noticia.image}
                      alt={noticia.title}
                      className="w-full h-full object-cover rounded-xl"
                    />
                  </div>

                  <div className="w-full lg:w-1/2 bg-zinc-800 dark:bg-zinc-900 rounded-xl p-6 sm:p-8 flex flex-col justify-between min-h-[300px] sm:min-h-[400px] lg:min-h-[500px]">
                    <div className="flex flex-col gap-6">
                      <h3 className="text-2xl lg:text-3xl font-medium text-white leading-tight">
                        {noticia.title}
                      </h3>

                      <p className="text-gray-400 text-base lg:text-lg leading-relaxed">
                        {noticia.excerpt}
                      </p>
                    </div>

                    <div className="mt-8">
                      <Button
                        variant="secondary"
                        size="default"
                        className="w-full sm:w-auto"
                        asChild
                      >
                        <a href={noticia.url || "#"}>ler mais</a>
                      </Button>
                    </div>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <div className="flex justify-center mt-6 gap-2">
            <CarouselPrevious className="relative left-0 top-0 translate-y-0" />
            <CarouselNext className="relative right-0 top-0 translate-y-0" />
          </div>
        </Carousel>
      </article>
    </section>
  );
}

