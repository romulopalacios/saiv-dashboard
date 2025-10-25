'use client';

import { Card } from '@/components/ui/card';
import { motion } from 'framer-motion';

interface VelocimetroProps {
  velocidadActual: number;
  limiteVelocidad: number;
}

export default function Velocimetro({ velocidadActual, limiteVelocidad }: VelocimetroProps) {
  const porcentaje = Math.min((velocidadActual / 120) * 100, 100);
  const esInfraccion = velocidadActual > limiteVelocidad;

  return (
    <Card className="p-6">
      <h3 className="text-xl font-semibold mb-6 text-center">Velocidad Actual</h3>
      
      <div className="relative w-64 h-64 mx-auto">
        {/* Círculo exterior */}
        <svg className="transform -rotate-90 w-64 h-64">
          <circle
            cx="128"
            cy="128"
            r="112"
            stroke="currentColor"
            strokeWidth="16"
            fill="none"
            className="text-muted opacity-20"
          />
          <motion.circle
            cx="128"
            cy="128"
            r="112"
            stroke={esInfraccion ? '#ef4444' : '#22c55e'}
            strokeWidth="16"
            fill="none"
            strokeDasharray={`${2 * Math.PI * 112}`}
            initial={{ strokeDashoffset: 2 * Math.PI * 112 }}
            animate={{
              strokeDashoffset: 2 * Math.PI * 112 * (1 - porcentaje / 100),
            }}
            transition={{ duration: 1, ease: 'easeOut' }}
            strokeLinecap="round"
          />
        </svg>

        {/* Contenido central */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.5, type: 'spring' }}
          >
            <div className="text-6xl font-bold" style={{ color: esInfraccion ? '#ef4444' : '#22c55e' }}>
              {velocidadActual}
            </div>
            <div className="text-xl text-muted-foreground text-center">km/h</div>
            <div className="text-sm text-muted-foreground text-center mt-2">
              Límite: {limiteVelocidad} km/h
            </div>
          </motion.div>
        </div>
      </div>

      {esInfraccion && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 p-3 bg-red-100 dark:bg-red-950 text-red-800 dark:text-red-200 rounded-lg text-center font-medium"
        >
          ⚠️ Velocidad excesiva detectada
        </motion.div>
      )}
    </Card>
  );
}
