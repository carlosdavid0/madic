/**
 * Layout para página de completar perfil
 * A lógica de redirecionamento é tratada no middleware para evitar
 * problemas com a Performance API do Next.js/Turbopack
 */
export default function CompleteProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

