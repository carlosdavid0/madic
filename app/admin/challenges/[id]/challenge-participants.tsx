import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { User, Trophy, Award } from 'lucide-react';

interface ChallengeParticipantsProps {
  challengeId: string;
  participants: Array<{
    id: string;
    position: number | null;
    pointsEarned: number | null;
    user: {
      id: string;
      name: string;
      username: string | null;
    } | null;
  }>;
}

export function ChallengeParticipants({
  challengeId,
  participants,
}: ChallengeParticipantsProps) {
  // Ordenar participantes por posição (nulls por último)
  const sortedParticipants = [...participants].sort((a, b) => {
    if (a.position === null && b.position === null) return 0;
    if (a.position === null) return 1;
    if (b.position === null) return -1;
    return a.position - b.position;
  });

  const getPositionBadge = (position: number | null) => {
    if (!position) return null;
    
    const badges = {
      1: { emoji: '🥇', color: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400' },
      2: { emoji: '🥈', color: 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-400' },
      3: { emoji: '🥉', color: 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400' },
    };
    
    const badge = badges[position as keyof typeof badges];
    
    if (badge) {
      return (
        <span className={`px-3 py-1 rounded-full text-sm font-semibold ${badge.color}`}>
          {badge.emoji} {position}º Lugar
        </span>
      );
    }
    
    return (
      <span className="px-3 py-1 rounded-full text-sm font-semibold bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400">
        🎖️ {position}º Lugar
      </span>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          👥 Participantes
        </CardTitle>
        <CardDescription>
          {participants.length === 0 
            ? 'Nenhum participante ainda' 
            : `${participants.length} participante(s) inscrito(s)`
          }
        </CardDescription>
      </CardHeader>
      <CardContent>
        {participants.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <User className="w-16 h-16 mx-auto mb-3 opacity-30" />
            <p className="text-sm">Aguardando participantes...</p>
          </div>
        ) : (
          <div className="space-y-3">
            {sortedParticipants.map((p) => {
              if (!p.user) return null;
              return (
                <div
                  key={p.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 border rounded-lg hover:bg-accent/50 transition-colors"
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <User className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold truncate">{p.user.name}</p>
                      {p.user.username && (
                        <p className="text-sm text-muted-foreground truncate">
                          @{p.user.username}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {p.position ? (
                      <>
                        {getPositionBadge(p.position)}
                        <div className="flex items-center gap-1 text-sm font-semibold">
                          <Award className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                          {p.pointsEarned || 0}pts
                        </div>
                      </>
                    ) : (
                      <span className="text-sm text-muted-foreground px-3 py-1 rounded-full bg-muted">
                        Aguardando classificação
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

