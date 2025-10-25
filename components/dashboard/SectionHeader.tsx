'use client';

import { LucideIcon } from 'lucide-react';
import { motion } from 'framer-motion';

interface SectionHeaderProps {
  title: string;
  description?: string;
  icon?: LucideIcon;
}

export default function SectionHeader({ title, description, icon: Icon }: SectionHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      className="mb-6"
    >
      <div className="flex items-center gap-3">
        {Icon && (
          <div className="p-2 bg-gradient-to-br from-[#C41E3A] to-[#9DC03E] rounded-lg shadow-uleam">
            <Icon className="h-5 w-5 text-white" />
          </div>
        )}
        <div>
          <h2 className="text-2xl font-bold text-foreground">{title}</h2>
          {description && (
            <p className="text-sm text-muted-foreground mt-1">{description}</p>
          )}
        </div>
      </div>
      <div className="mt-3 h-1 bg-gradient-to-r from-[#C41E3A] via-[#9DC03E] to-transparent rounded-full" />
    </motion.div>
  );
}
