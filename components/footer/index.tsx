'use client';
import { LinkPreview } from "@/components/ui/link-preview";

export function Footer() {
  return (
    <footer className="w-full text-white py-8 sm:py-12 lg:py-16 bg-magic-dark border-t border-white/10">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-center gap-4 text-center">
          <div className="text-sm sm:text-base lg:text-lg text-white/80 leading-relaxed">
            concept art by{" "}
            <LinkPreview
              url="https://instagram.com/renancio.m"
              className="text-primary hover:text-primary/80 transition-colors duration-200 font-medium"
            >
              @renancio.m
            </LinkPreview>
          </div>
          <div className="text-sm sm:text-base lg:text-lg text-white/80 leading-relaxed">
            built with ❤️ by{" "}
            <LinkPreview
              className="text-primary hover:text-primary/80 transition-colors duration-200 font-medium"
              url="https://github.com/carlosdavid0"
            >
              @carlosdavid0
            </LinkPreview>
          </div>
        </div>
      </div>
    </footer>
  );
}