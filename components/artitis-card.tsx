import { Button } from "./ui/button";

type ArtitisCardProps = {
  name: string;
  avatar: string;
  professions: string[];
  rankingPosition: number;
  profileUrl?: string;
};

export function ArtitisCard({
  name,
  avatar,
  professions,
  rankingPosition,
  profileUrl,
}: ArtitisCardProps) {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
      <div className="flex items-center gap-4 flex-1">
        <img
          src={avatar}
          alt={name}
          className="w-16 h-16 rounded-full object-cover shrink-0"
        />
        <div className="flex flex-col">
          <h3 className="text-primary font-bold text-lg">{name}</h3>
          <p className="text-white text-sm">{professions.join(", ")}</p>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-4">
        <span className="text-white text-sm whitespace-nowrap">
          Ranking Geral:
        </span>
        <span className="text-primary font-bold text-xl">
          {rankingPosition}°
        </span>
      </div>

      <Button variant="secondary" size="default" className="w-full sm:w-auto">
        Ir para o perfil
      </Button>
    </div>
  );
}
