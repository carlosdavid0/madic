"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { label: "Home", href: "/" },
  { label: "Sobre", href: "/sobre" },
  { label: "Desafios", href: "/desafios" },
  { label: "Membros", href: "/membros" },
  { label: "Blog", href: "/blog" },
  { label: "Contato", href: "/contato" },
];

export function Nav() {
  const pathname = usePathname();

  return (
    <nav className="flex items-center">
      <ul className="flex gap-8 items-center">
        {navItems.map((item) => {
          const active = pathname === item.href;

          return (
            <li key={item.href} className="relative">
              <Link
                href={item.href}
                className={`
                   transition-colors duration-300
                  ${active ? "text-primary font-semibold" : "text-foreground/70 hover:text-foreground"}
                  peer
                `}
              >
                {item.label}
              </Link>

              {/* underline funcionando 100% */}
              <span
                className={`
                  absolute left-0 -bottom-[3px] h-[2px] bg-primary rounded-full 
                  transition-all duration-300
                  ${active ? "w-full opacity-100" : "w-0 opacity-0 peer-hover:w-full peer-hover:opacity-100"}
                `}
              />
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
