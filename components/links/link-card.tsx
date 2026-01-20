'use client';

import { Link as LinkType } from '@/lib/db/schema/links';
import { cn } from '@/lib/utils';
import { ExternalLink, Globe, Instagram, Linkedin, Twitter, Youtube } from 'lucide-react';
import { motion } from 'motion/react';

interface LinkCardProps {
  link: LinkType;
  index: number;
}

// ... imports

const getIcon = (url: string, className?: string) => {
  const props = { className };
  if (url.includes('instagram')) return <Instagram {...props} />;
  if (url.includes('twitter') || url.includes('x.com')) return <Twitter {...props} />;
  if (url.includes('linkedin')) return <Linkedin {...props} />;
  if (url.includes('youtube')) return <Youtube {...props} />;
  return <Globe {...props} />;
};

export function LinkCard({ link, index }: LinkCardProps) {
  return (
    <motion.a
      href={link.url}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
      className={cn(
        "group relative flex items-center w-full p-4 mb-4 rounded-xl",
        "bg-white/5 backdrop-blur-md border border-white/10",
        "hover:bg-white/10 hover:border-white/20 hover:shadow-[0_0_20px_rgba(255,255,255,0.05)]",
        "transition-all duration-300 ease-out overflow-hidden"
      )}
    >
      {/* Glossy shine effect */}
      <div className="absolute inset-0 w-full h-full bg-linear-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:animate-shine" />

      {/* Icon Container */}
      <div className={cn(
        "flex items-center justify-center w-12 h-12 rounded-lg mr-4",
        "bg-white/5 text-white/80 group-hover:text-white group-hover:bg-white/10",
        "transition-colors duration-300"
      )}>
        {getIcon(link.url, "w-6 h-6")}
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col items-start min-w-0">
        <span className="text-base font-semibold text-white/90 group-hover:text-white truncate w-full">
          {link.name}
        </span>
        <span className="text-xs text-white/50 group-hover:text-white/70 truncate w-full max-w-[200px]">
          {link.url.replace(/^https?:\/\/(www\.)?/, '')}
        </span>
      </div>

      {/* Arrow Icon */}
      <div className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
        <ExternalLink className="w-5 h-5 text-white/50" />
      </div>
    </motion.a>
  );
}
