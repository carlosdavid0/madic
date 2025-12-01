import { Button } from "@/components/ui/button";

export default function Hero() {
  return (
    <section className="w-full max-w-4xl mx-auto px-4">
      <h1 className="text-4xl lg:text-5xl font-normal text-center leading-tight">
        O movimento que <span className="text-primary">impulsiona</span>
        <br />a arte digital{" "}
        <span className="font-medium">no interior do Ceará</span>
      </h1>

      <section className="flex justify-center mt-8 gap-x-4">
        <Button variant={"secondary"} className="text-lg">Conheça</Button>
        <Button className="text-lg">Saiba mais</Button>
      </section>
    </section>
  );
}
