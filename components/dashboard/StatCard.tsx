'use client';

import { Card } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  color?: 'blue' | 'green' | 'red' | 'orange' | 'purple' | 'uleam';
  subtitle?: string;
}

export default function StatCard({ 
  title, 
  value, 
  icon: Icon, 
  trend, 
  color = 'blue',
  subtitle 
}: StatCardProps) {
  const colorConfig = {
    blue: {
      gradient: 'from-blue-500 to-blue-600',
      bg: 'bg-blue-50 dark:bg-blue-950/20',
      text: 'text-blue-600 dark:text-blue-400',
      icon: 'text-blue-600 dark:text-blue-400',
      border: 'border-blue-100 dark:border-blue-900/30',
      accent: 'bg-blue-500',
    },
    green: {
      gradient: 'from-green-500 to-green-600',
      bg: 'bg-green-50 dark:bg-green-950/20',
      text: 'text-green-600 dark:text-green-400',
      icon: 'text-green-600 dark:text-green-400',
      border: 'border-green-100 dark:border-green-900/30',
      accent: 'bg-green-500',
    },
    red: {
      gradient: 'from-red-500 to-red-600',
      bg: 'bg-red-50 dark:bg-red-950/20',
      text: 'text-red-600 dark:text-red-400',
      icon: 'text-red-600 dark:text-red-400',
      border: 'border-red-100 dark:border-red-900/30',
      accent: 'bg-red-500',
    },
    orange: {
      gradient: 'from-orange-500 to-orange-600',
      bg: 'bg-orange-50 dark:bg-orange-950/20',
      text: 'text-orange-600 dark:text-orange-400',
      icon: 'text-orange-600 dark:text-orange-400',
      border: 'border-orange-100 dark:border-orange-900/30',
      accent: 'bg-orange-500',
    },
    purple: {
      gradient: 'from-purple-500 to-purple-600',
      bg: 'bg-purple-50 dark:bg-purple-950/20',
      text: 'text-purple-600 dark:text-purple-400',
      icon: 'text-purple-600 dark:text-purple-400',
      border: 'border-purple-100 dark:border-purple-900/30',
      accent: 'bg-purple-500',
    },
    uleam: {
      gradient: 'from-[#C41E3A] to-[#A01828]',
      bg: 'bg-red-50 dark:bg-red-950/20',
      text: 'text-[#C41E3A] dark:text-red-400',
      icon: 'text-[#C41E3A] dark:text-red-400',
      border: 'border-red-100 dark:border-red-900/30',
      accent: 'bg-[#C41E3A]',
    },
  }[color];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
      whileHover={{ 
        y: -4,
        transition: { duration: 0.2 }
      }}
    >
      <Card className={`
        relative overflow-hidden transition-smooth hover-glow
        ${colorConfig.border}
        bg-white dark:bg-gray-900 border
        shadow-soft hover:shadow-lg
      `}>
        {/* Acento de color superior */}
        <div className={`absolute top-0 left-0 right-0 h-1 ${colorConfig.accent}`} />
        
        <div className="relative p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                {title}
              </p>
              {subtitle && (
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                  {subtitle}
                </p>
              )}
            </div>
            
            {/* Icono simplificado */}
            <div className={`
              p-2.5 rounded-lg transition-smooth
              ${colorConfig.bg}
            `}>
              <Icon className={`h-5 w-5 ${colorConfig.icon}`} />
            </div>
          </div>

          <div className="space-y-3">
            {/* Valor principal */}
            <motion.h3 
              className={`text-3xl font-bold ${colorConfig.text}`}
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              {value}
            </motion.h3>

            {/* Indicador de tendencia */}
            {trend && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.3 }}
                className={`
                  inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-semibold
                  ${trend.isPositive 
                    ? 'bg-green-100 dark:bg-green-950/30 text-green-700 dark:text-green-400' 
                    : 'bg-red-100 dark:bg-red-950/30 text-red-700 dark:text-red-400'
                  }
                `}
              >
                {trend.isPositive ? (
                  <TrendingUp className="h-3 w-3" />
                ) : (
                  <TrendingDown className="h-3 w-3" />
                )}
                <span>{Math.abs(trend.value)}%</span>
              </motion.div>
            )}
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
