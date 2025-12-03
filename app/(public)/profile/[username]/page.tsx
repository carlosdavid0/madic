
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { db } from '@/lib/db';
import { skills, socialMedias, tools, users, userSocial, userTools } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { Metadata } from 'next';
import Image from 'next/image';
import { notFound } from 'next/navigation';

async function getUserByUsername(username: string) {
  try {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.username, username))
      .limit(1);

    if (!user || !user.active) {
      return null;
    }

    // Buscar skills
    const userSkills = await db
      .select()
      .from(skills)
      .where(eq(skills.userId, user.id));

    // Buscar tools com join
    const userToolsData = await db
      .select({
        id: tools.id,
        name: tools.name,
        icon: tools.icon,
      })
      .from(userTools)
      .innerJoin(tools, eq(userTools.toolsId, tools.id))
      .where(eq(userTools.userId, user.id));

    // Buscar social medias com join
    const userSocialData = await db
      .select({
        id: socialMedias.id,
        name: socialMedias.name,
        icon: socialMedias.icon,
      })
      .from(userSocial)
      .innerJoin(socialMedias, eq(userSocial.socialId, socialMedias.id))
      .where(eq(userSocial.userId, user.id));

    return {
      ...user,
      skills: userSkills,
      tools: userToolsData,
      socialMedias: userSocialData,
    };
  } catch (error) {
    console.error('Erro ao buscar usuário:', error);
    return null;
  }
}

export async function generateMetadata({ params }: { params: Promise<{ username: string }> }): Promise<Metadata> {
  const { username } = await params;
  const user = await getUserByUsername(username);
  if (!user) {
    return {
      title: 'Perfil não encontrado',
      description: 'Perfil não encontrado no Madic',
      openGraph: {
        title: 'Perfil não encontrado',
        description: 'Perfil não encontrado no Madic',
        images: [],
      },
    };
  }
  return {
    title: `Perfil de ${user.name}`,
    description: `Perfil de ${user.name} no Madic`,
    openGraph: {
      title: `Perfil de ${user.name}`,
      description: `Perfil de ${user.name} no Madic`,
      images: [user.avatar || ''],
      url: `https://madic.com/profile/${user.username}`,
      type: 'website',
      siteName: 'Madic',
      locale: 'pt-BR',
    },
  };
}
function calculateAge(birthDate: string | null): number | null {
  if (!birthDate) return null;
  const today = new Date();
  const birth = new Date(birthDate);
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  return age;
}

function formatDate(date: Date | null): string {
  if (!date) return '';
  const d = new Date(date);
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  return `${day}.${month}.${year}`;
}

export default async function ProfilePage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;

  console.log('[ProfilePage] Username:', username);

  if (!username) {
    notFound();
  }

  const user = await getUserByUsername(username);

  if (!user) {
    notFound();
  }

  const age = calculateAge(user.age);
  const memberSince = formatDate(user.createdAt);

  return (
      <div className="">
        <div className="container mx-auto max-w-7xl px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Sidebar - Perfil */}
            <div className="lg:col-span-1">
              <Card className="sticky top-8">
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center space-y-6">
                    {/* Avatar */}
                    <div className="relative w-48 h-48 rounded-full overflow-hidden border-4 border-primary">
                      {user.avatar ? (
                        <Image
                          src={user.avatar}
                          alt={user.name}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-muted flex items-center justify-center text-4xl font-bold">
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                      )}
                    </div>

                    {/* Nome */}
                    <h1 className="text-3xl font-bold text-center">{user.name}</h1>

                    {/* Localização e Idade */}
                    <div className="text-center space-y-1">
                      {user.locate && (
                        <p className="text-muted-foreground">{user.locate}</p>
                      )}
                      {age && <p className="text-muted-foreground">{age} Anos</p>}
                    </div>

                    {/* Status Freelancer */}
                    {user.availableFreelancer && (
                      <Button
                        variant="secondary"
                        className="bg-green-600 hover:bg-green-700 text-white w-full"
                      >
                        Disponível para Freelancer
                      </Button>
                    )}

                    {/* Redes Sociais */}
                    {user.socialMedias.length > 0 && (
                      <div className="flex flex-wrap gap-3 justify-center">
                        {user.socialMedias.map((social) => (
                          <a
                            key={social.id}
                            href="#"
                            className="w-10 h-10 rounded-full bg-muted hover:bg-primary/20 flex items-center justify-center transition-colors"
                            title={social.name}
                          >
                            {social.icon ? (
                              <Image
                                src={social.icon}
                                alt={social.name}
                                width={20}
                                height={20}
                              />
                            ) : (
                              <span className="text-xs">{social.name.charAt(0)}</span>
                            )}
                          </a>
                        ))}
                      </div>
                    )}

                    {/* Habilidades */}
                    {user.skills.length > 0 && (
                      <div className="w-full space-y-3">
                        <h2 className="text-lg font-semibold">Habilidades:</h2>
                        <ul className="space-y-2">
                          {user.skills.map((skill) => (
                            <li
                              key={skill.id}
                              className="text-muted-foreground flex items-center before:content-['•'] before:text-primary before:mr-2 before:text-xl"
                            >
                              {skill.skill}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Ferramentas */}
                    {user.tools.length > 0 && (
                      <div className="w-full space-y-3">
                        <h2 className="text-lg font-semibold">
                          Ferramentas mais usadas:
                        </h2>
                        <div className="flex flex-wrap gap-3">
                          {user.tools.map((tool) => (
                            <div
                              key={tool.id}
                              className="w-12 h-12 rounded-lg bg-muted hover:bg-primary/20 flex items-center justify-center transition-colors"
                              title={tool.name}
                            >
                              {tool.icon ? (
                                <Image
                                  src={tool.icon}
                                  alt={tool.name}
                                  width={24}
                                  height={24}
                                />
                              ) : (
                                <span className="text-xs font-semibold">
                                  {tool.name.substring(0, 2).toUpperCase()}
                                </span>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Conteúdo Principal */}
            <div className="lg:col-span-2 space-y-6">
              {/* Estatísticas */}
              <Card>
                <CardHeader>
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                      {memberSince && (
                        <span>Membro desde {memberSince}</span>
                      )}
                      <span>Desafios: 0</span>
                      <span>Pontos: 0</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="bg-primary text-primary-foreground px-6 py-3 rounded-lg font-bold text-2xl border-2 border-primary-foreground/20">
                        #0
                      </div>
                    </div>
                  </div>
                </CardHeader>
              </Card>

              {/* Últimos Envios */}
              <Card>
                <CardHeader>
                  <h2 className="text-xl font-semibold">Últimos envios:</h2>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-4">
                    {[1, 2, 3, 4, 5, 6].map((item) => (
                      <div
                        key={item}
                        className="aspect-square rounded-lg bg-muted overflow-hidden"
                      >
                        <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                          Sem imagem
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center justify-center gap-2 mt-6">
                    <button className="px-3 py-1 rounded hover:bg-muted transition-colors">
                      1
                    </button>
                    <button className="px-3 py-1 rounded hover:bg-muted transition-colors">
                      2
                    </button>
                    <button className="px-3 py-1 rounded hover:bg-muted transition-colors">
                      3
                    </button>
                    <button className="px-3 py-1 rounded hover:bg-muted transition-colors">
                      &gt;
                    </button>
                  </div>
                </CardContent>
              </Card>

              {/* Conquistas */}
              <Card>
                <CardHeader>
                  <h2 className="text-xl font-semibold">Conquistas:</h2>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-8 gap-3">
                    {Array.from({ length: 24 }).map((_, index) => (
                      <div
                        key={index}
                        className="aspect-square rounded-lg bg-muted flex items-center justify-center"
                      >
                        <span className="text-2xl">🏆</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    );
}

