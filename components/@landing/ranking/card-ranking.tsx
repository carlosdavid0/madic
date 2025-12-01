import { cn } from "@/lib/utils"

type cardType = "gold" | "silver" | "bronze" | "participant"

type CardRankingProps = {
  type: cardType
  who: {
    name: string
    avatar: string
  }
  position: number
  score: number
}

const typeColor = {
  gold: "border-yellow-500",
  silver: "border-gray-400",
  bronze: "border-orange-700",
  participant: "border-muted-foreground",
}

export function getColors(type: cardType) {
  return typeColor[type]
}

export function CardRanking({ type, who, position, score }: CardRankingProps) {
  return (
    <article
      className={cn(
        "w-full h-16 border-2 rounded-t-xl flex items-center px-4 relative overflow-hidden",
        getColors(type)
      )}
      style={{
        borderBottom: "none",
        maskImage: "linear-gradient(to bottom, black 0%, black 85%, transparent 100%)"
      }}
    >
      <div className="flex items-center gap-3 flex-1">
        <img
          src={who.avatar}
          alt={who.name}
          className="w-8 h-8 rounded-full bg-muted-foreground/40 object-cover"
        />
        <span className="text-white text-sm">{position} - {who.name}</span>
      </div>

      <div className="text-white font-medium text-sm">
        {score}
      </div>
    </article>
  )
}