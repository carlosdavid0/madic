import { Button } from "@/components/ui/button";

type DesafioProps = {
  image: string;
  title: string;
  theme: string;
  deadline: string;
  category: string;
  tools: string;
};

export function Desafios() {
  const desafio: DesafioProps = {
    image: "https://picsum.photos/1920/1080",
    title: "Desafio de Novembro",
    theme: "Meio Ambiente",
    deadline: "4 de Dezembro",
    category: "Todos",
    tools: "Todos",
  };

  return (
    <section className="w-full py-8 sm:py-12 lg:py-16 min-h-[calc(50vh)]">
      <article className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl lg:text-4xl font-medium text-center leading-tight mb-8">
          Desafios em andamento
        </h2>

        <div className="w-full flex flex-col lg:flex-row gap-6 lg:gap-8 items-center lg:items-stretch">
          <div className="w-full lg:w-1/2 rounded-xl overflow-hidden">
            <img
              src={desafio.image}
              alt={desafio.title}
              className="w-full h-full object-cover rounded-xl max-h-[600px]"
            />
          </div>

          <div className="w-full lg:w-1/2 bg-white rounded-xl p-6 sm:p-8 flex flex-col justify-between">
            <div className="flex flex-col gap-6 mb-8">
              <h3 className="text-2xl lg:text-3xl font-medium text-magic-dark leading-tight">
                {desafio.title}
              </h3>

              <div className="flex flex-col gap-3 text-magic-dark">
                <div>
                  <span className="font-medium">Tema: </span>
                  <span>{desafio.theme}</span>
                </div>
                <div>
                  <span className="font-medium">Prazo: </span>
                  <span>{desafio.deadline}</span>
                </div>
                <div>
                  <span className="font-medium">Categoria: </span>
                  <span>{desafio.category}</span>
                </div>
                <div>
                  <span className="font-medium">Ferramentas: </span>
                  <span>{desafio.tools}</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <Button variant="secondary" size="default" className="w-full">
                Saiba mais
              </Button>
              <Button variant="default" size="default" className="w-full">
                Participar
              </Button>
            </div>
          </div>
        </div>
      </article>
    </section>
  );
}
