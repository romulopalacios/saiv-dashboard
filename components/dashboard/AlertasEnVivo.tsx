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
        if (evento.esInfraccion) {
          const exceso = evento.velocidad - evento.limiteVelocidad;
          if (exceso > 30) {
            severidad = 'alta';
          } else if (exceso > 15) {
            severidad = 'media';
          } else {
            severidad = 'media';
          }
        }

        return {
          id: evento.id,
          mensaje: evento.esInfraccion
            ? `⚠️ Infracción: ${evento.velocidad} km/h en zona de ${evento.limiteVelocidad} km/h`
            : `✓ Tránsito normal: ${evento.velocidad} km/h`,
          timestamp: evento.timestamp,
          severidad,
          velocidad: evento.velocidad,
          ubicacion: evento.ubicacion.nombre,
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
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-semibold">Alertas en Tiempo Real</h3>
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse" />
          <span className="text-sm text-muted-foreground">En vivo</span>
        </div>
      </div>

      <div className="space-y-3">
        <AnimatePresence mode="popLayout">
          {alertas.length === 0 ? (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-sm text-muted-foreground text-center py-8"
            >
              Esperando eventos...
            </motion.p>
          ) : (
            alertas.map((alerta, index) => (
              <motion.div
                key={alerta.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ delay: index * 0.05 }}
                className="flex items-start gap-3 p-3 rounded-lg border bg-card hover:bg-accent transition-colors"
              >
                {getAlertaIcon(alerta.severidad)}
                <div className="flex-1">
                  <p className="text-sm font-medium">{alerta.mensaje}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {new Date(alerta.timestamp).toLocaleTimeString('es-EC')}
                  </p>
                </div>
                <Badge variant={getAlertaColor(alerta.severidad) as any}>
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
