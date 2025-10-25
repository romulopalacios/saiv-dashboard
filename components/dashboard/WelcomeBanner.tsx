'use client';

import { motion } from 'framer-motion';
import { Info, X } from 'lucide-react';
import { useState } from 'react';

export default function WelcomeBanner() {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="mb-6"
    >
      <div className="relative rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 border border-blue-200 dark:border-blue-900/30 p-6">
        {/* Botón cerrar */}
        <button
          onClick={() => setIsVisible(false)}
          className="absolute top-4 right-4 p-1.5 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
          aria-label="Cerrar banner"
        >
          <X className="h-4 w-4 text-gray-500 dark:text-gray-400" />
        </button>

        <div className="flex items-start gap-4 pr-8">
          {/* Icono */}
          <div className="flex-shrink-0">
            <div className="p-2.5 rounded-lg bg-blue-100 dark:bg-blue-900/30">
              <Info className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
          </div>

          {/* Contenido */}
          <div className="flex-1">
            <h3 className="text-base font-bold text-gray-900 dark:text-white mb-2">
              Bienvenido al Sistema SIAV
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
              Dashboard de analítica vial en tiempo real con monitoreo IoT y detección inteligente de infracciones.
            </p>
            
            {/* Características en línea */}
            <div className="flex flex-wrap gap-4 text-xs text-gray-500 dark:text-gray-400">
              <span className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-[#C41E3A]"></div>
                Actualización cada 10s
              </span>
              <span className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-[#9DC03E]"></div>
                Conectado vía MQTT
              </span>
              <span className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-[#4A4A4A]"></div>
                Backend Railway + Supabase
              </span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
