import { AuthProvider } from "@/lib/contexts/auth-context";
import { QueryProvider } from "@/lib/providers/query-provider";
import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";

const visbyFont = localFont({
  src: [
    {
      path: "../public/VISBYCF-THIN.otf",
      weight: "100",
      style: "normal",
    },
    {
      path: "../public/VISBYCF-THINOBLIQUE.otf",
      weight: "100",
      style: "italic",
    },
    {
      path: "../public/VISBYCF-LIGHT.otf",
      weight: "300",
      style: "normal",
    },
    {
      path: "../public/VISBYCF-LIGHTOBLIQUE.otf",
      weight: "300",
      style: "italic",
    },
    {
      path: "../public/VISBYCF-REGULAR.otf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../public/VISBYCF-REGULAROBLIQUE.otf",
      weight: "400",
      style: "italic",
    },
    {
      path: "../public/VISBYCF-MEDIUM.otf",
      weight: "500",
      style: "normal",
    },
    {
      path: "../public/VISBYCF-MEDIUMOBLIQUE.otf",
      weight: "500",
      style: "italic",
    },
    {
      path: "../public/VISBYCF-DEMIBOLD.otf",
      weight: "600",
      style: "normal",
    },
    {
      path: "../public/VISBYCF-DEMIBOLDOBLIQUE.otf",
      weight: "600",
      style: "italic",
    },
    {
      path: "../public/VISBYCF-BOLD.otf",
      weight: "700",
      style: "normal",
    },
    {
      path: "../public/VISBYCF-BOLDOBLIQUE.otf",
      weight: "700",
      style: "italic",
    },
    {
      path: "../public/VISBYCF-EXTRABOLD.otf",
      weight: "800",
      style: "normal",
    },
    {
      path: "../public/VISBYCF-EXTRABOLDOBLIQUE.otf",
      weight: "800",
      style: "italic",
    },
    {
      path: "../public/VISBYCF-HEAVY.otf",
      weight: "900",
      style: "normal",
    },
    {
      path: "../public/VISBYCF-HEAVYOBLIQUE.otf",
      weight: "900",
      style: "italic",
    },
  ],
  variable: "--font-visby",
});

export const metadata: Metadata = {
  title: "Madic | Movimento artístico digital no interior do Ceará",
  description: "Madic é uma plataforma de arte digital que busca impulsionar o movimento artístico digital no interior do Ceará",
  openGraph: {
    title: "Madic | Movimento artístico digital no interior do Ceará",
    description: "Madic é uma plataforma de arte digital que busca impulsionar a arte digital no interior do Ceará",
    images: [],
    url: "https://madic.com",
    type: "website",
    siteName: "Madic",
    locale: "pt-BR",
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-br">
      <body className={`antialiased ${visbyFont.variable} bg-magic select-none`}>
        <QueryProvider>
          <AuthProvider>{children}</AuthProvider>
        </QueryProvider>
      </body>
    </html>
  );
}