import { Button } from "@/components/ui/button";

export default function Hero() {
  return (
    <section>
      <h1 className="text-4xl font-normal text-center">
        O movimento que <span className="text-primary">impulsiona</span>
        <br />a arte digital{" "}
        <span className="font-medium">no interior do Ceará</span>
      </h1>

      <section className="flex justify-center mt-8 gap-x-4">
        <Button variant={"secondary"}>Conheça</Button>
        <Button>Saiba mais</Button>
      </section>
    </section>
  );
}
