'use client';

import { Button } from '@/components/ui/button';
import { Link as LinkType } from '@/lib/db/schema/links';
import { cn } from '@/lib/utils';
import { ExternalLink } from 'lucide-react';
import { motion } from 'motion/react';
import { SocialIcon } from 'react-social-icons';


interface LinkCardProps {
  link: LinkType;
  index: number;
}

// ... imports

const getIcon = (url: string) => {
  return (
    <SocialIcon
      bgColor='transparent'
      url={url}
      as="div"
      style={{ width: 44, height: 44 }}
    />
  );
};

export function LinkCard({ link, index }: LinkCardProps) {
  return (
    <Button
      asChild
      variant="secondary"
      className="w-full h-auto p-4 mb-4 rounded-xl justify-start relative overflow-hidden group"
    >
      <motion.a
        href={link.url}
        target="_blank"
        rel="noopener noreferrer"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: index * 0.1 }}
        whileHover={{ scale: 1.02, y: -2 }}
        whileTap={{ scale: 0.98 }}
      >
        {/* Glossy shine effect */}
        <div className="absolute inset-0 w-full h-full bg-linear-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:animate-shine" />

        {/* Icon Container */}
        <div className={cn(
          "flex items-center justify-center w-12 h-12 rounded-lg mr-4",
          "bg-white/5 text-primary/80 group-hover:text-primary group-hover:bg-white/10",
          "transition-colors duration-300"
        )}>
          {getIcon(link.url)}
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col items-start min-w-0">
          <span className="text-lg font-semibold truncate w-full line-clamp-1">
            {link.name}
          </span>

        </div>

        {/* Arrow Icon */}
        <div className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
          <ExternalLink className="w-5 h-5" />
        </div>
      </motion.a>
    </Button>
  );
}
