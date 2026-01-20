'use client';

import { Link as LinkType } from '@/lib/db/schema/links';
import { motion } from 'motion/react';
import { LinkCard } from './link-card';

interface LinkListProps {
  links: LinkType[];
}

export function LinkList({ links }: LinkListProps) {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="w-full space-y-4"
    >
      {links.map((link, index) => (
        <LinkCard key={link.id} link={link} index={index} />
      ))}
    </motion.div>
  );
}
