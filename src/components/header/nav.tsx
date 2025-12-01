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
            <li key={item.href} className="relative group">
              <Link
                href={item.href}
                className={`
                  text-base transition-all duration-300 
                  ${
                    active
                      ? "text-primary font-medium"
                      : "text-muted-foreground group-hover:text-foreground"
                  }
                  group-hover:scale-[1.05]
                `}
              >
                {item.label}
              </Link>

              {/* underline deslizante */}
              <span
                className={`
                  pointer-events-none absolute left-0 -bottom-1 h-[2px] bg-primary rounded-full 
                  transition-all duration-300 ease-out
                  w-0 group-hover:w-full 
                  ${active ? "w-full" : "w-0"}
                `}
              />
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
