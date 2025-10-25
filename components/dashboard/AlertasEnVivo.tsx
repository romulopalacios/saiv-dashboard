'use client';

import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, CheckCircle, Info } from 'lucide-react';
import { useEffect, useState, useRef } from 'react';
import { EventoVehiculo } from '@/lib/types';

interface Alerta {
  id: string;
  mensaje: string;
  timestamp: number;
  severidad: 'alta' | 'media' | 'baja';
  velocidad: number;
  ubicacion: string;
}

interface AlertasEnVivoProps {
  eventos: EventoVehiculo[];
}

export default function AlertasEnVivo({ eventos }: AlertasEnVivoProps) {
  const [alertas, setAlertas] = useState<Alerta[]>([]);
  const eventosAnterioresRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    // Detectar NUEVOS eventos comparando con los anteriores
    if (eventos.length === 0) return;

    const nuevosEventos = eventos.filter(evento => {
      // Si el evento NO estaba en la lista anterior, es NUEVO
      return !eventosAnterioresRef.current.has(evento.id);
    });

    // Agregar solo los eventos NUEVOS como alertas
    if (nuevosEventos.length > 0) {
      const nuevasAlertas: Alerta[] = nuevosEventos.slice(0, 3).map(evento => {
        let severidad: 'alta' | 'media' | 'baja' = 'baja';
        
        // Determinar severidad basada en la infracción y velocidad
        if (evento.esInfraccion && evento.limiteVelocidad) {
          const exceso = evento.velocidad - evento.limiteVelocidad;
          if (exceso > 30) {
            severidad = 'alta';
          } else if (exceso > 15) {
            severidad = 'media';
          } else {
            severidad = 'media';
          }
        }

        // Crear mensaje basado en datos reales disponibles
        let mensaje = '';
        if (evento.esInfraccion && evento.limiteVelocidad) {
          mensaje = `⚠️ Infracción: ${evento.velocidad} km/h en zona de ${evento.limiteVelocidad} km/h`;
        } else if (evento.esInfraccion) {
          mensaje = `⚠️ Velocidad excesiva: ${evento.velocidad} km/h`;
        } else {
          mensaje = `✓ Tránsito normal: ${evento.velocidad} km/h`;
        }

        return {
          id: evento.id,
          mensaje,
          timestamp: evento.timestamp,
          severidad,
          velocidad: evento.velocidad,
          ubicacion: evento.ubicacion?.nombre || 'Ubicación desconocida',
        };
      });

      // Agregar las nuevas alertas al principio, mantener solo las últimas 5
      setAlertas(prev => [...nuevasAlertas, ...prev].slice(0, 5));
    }

    // Actualizar el Set de eventos conocidos
    eventosAnterioresRef.current = new Set(eventos.map(e => e.id));
  }, [eventos]);

  const getAlertaIcon = (severidad: string) => {
    switch (severidad) {
      case 'alta':
        return <AlertTriangle className="h-5 w-5 text-red-500" />;
      case 'media':
        return <Info className="h-5 w-5 text-orange-500" />;
      default:
        return <CheckCircle className="h-5 w-5 text-green-500" />;
    }
  };

  const getAlertaColor = (severidad: string) => {
    switch (severidad) {
      case 'alta':
        return 'destructive';
      case 'media':
        return 'default';
      default:
        return 'secondary';
    }
  };

  return (
    <Card className="p-6 border border-gray-200 dark:border-gray-800 transition-smooth hover-glow shadow-soft hover:shadow-lg bg-white dark:bg-gray-900">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white">
          Alertas en Tiempo Real
        </h3>
        <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-900/30">
          <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse" />
          <span className="text-xs font-medium text-green-600 dark:text-green-400">En vivo</span>
        </div>
      </div>

      <div className="space-y-3">
        <AnimatePresence mode="popLayout">
          {alertas.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12 rounded-lg bg-gray-50 dark:bg-gray-800/30"
            >
              <div className="text-4xl mb-3">📡</div>
              <p className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                Esperando eventos...
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Las alertas aparecerán aquí en tiempo real
              </p>
            </motion.div>
          ) : (
            alertas.map((alerta, index) => (
              <motion.div
                key={alerta.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ delay: index * 0.05 }}
                className="flex items-start gap-3 p-3 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-800/50 hover:bg-gray-50 dark:hover:bg-gray-800 transition-smooth"
              >
                {getAlertaIcon(alerta.severidad)}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {alerta.mensaje}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {new Date(alerta.timestamp).toLocaleTimeString('es-EC')}
                  </p>
                </div>
                <Badge 
                  variant={getAlertaColor(alerta.severidad) as any}
                  className="shrink-0"
                >
                  {alerta.severidad}
                </Badge>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </Card>
  );
}
