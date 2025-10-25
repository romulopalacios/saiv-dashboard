'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Filter, 
  X, 
  Calendar, 
  MapPin, 
  Activity,
  AlertTriangle,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { EventoVehiculo } from '@/lib/types';

interface FiltrosAvanzadosProps {
  eventos: EventoVehiculo[];
  onFiltrar: (eventosFiltrados: EventoVehiculo[]) => void;
}

interface Filtros {
  soloInfracciones: boolean;
  rangoVelocidad: {
    min: number;
    max: number;
  };
  direccion: 'todas' | 'norte' | 'sur';
  ultimasHoras: number | null; // null = todas
}

export default function FiltrosAvanzados({ eventos, onFiltrar }: FiltrosAvanzadosProps) {
  const [mostrarFiltros, setMostrarFiltros] = useState(false);
  const [filtros, setFiltros] = useState<Filtros>({
    soloInfracciones: false,
    rangoVelocidad: { min: 0, max: 200 },
    direccion: 'todas',
    ultimasHoras: null,
  });
  const [filtrosActivos, setFiltrosActivos] = useState(0);

  // Aplicar filtros cuando cambien
  useEffect(() => {
    let eventosFiltrados = [...eventos];
    let contadorFiltros = 0;

    // Filtro: Solo infracciones
    if (filtros.soloInfracciones) {
      eventosFiltrados = eventosFiltrados.filter(e => e.esInfraccion);
      contadorFiltros++;
    }

    // Filtro: Rango de velocidad
    if (filtros.rangoVelocidad.min > 0 || filtros.rangoVelocidad.max < 200) {
      eventosFiltrados = eventosFiltrados.filter(
        e => e.velocidad >= filtros.rangoVelocidad.min && 
             e.velocidad <= filtros.rangoVelocidad.max
      );
      contadorFiltros++;
    }

    // Filtro: Dirección
    if (filtros.direccion !== 'todas') {
      eventosFiltrados = eventosFiltrados.filter(e => e.direccion === filtros.direccion);
      contadorFiltros++;
    }

    // Filtro: Últimas horas
    if (filtros.ultimasHoras !== null) {
      const tiempoLimite = Date.now() - (filtros.ultimasHoras * 60 * 60 * 1000);
      eventosFiltrados = eventosFiltrados.filter(e => e.timestamp >= tiempoLimite);
      contadorFiltros++;
    }

    setFiltrosActivos(contadorFiltros);
    onFiltrar(eventosFiltrados);
  }, [filtros, eventos, onFiltrar]);

  const limpiarFiltros = () => {
    setFiltros({
      soloInfracciones: false,
      rangoVelocidad: { min: 0, max: 200 },
      direccion: 'todas',
      ultimasHoras: null,
    });
  };

  return (
    <Card className="mb-6">
      <div className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Filter className="h-5 w-5 text-muted-foreground" />
            <h3 className="font-semibold">Filtros Avanzados</h3>
            {filtrosActivos > 0 && (
              <Badge variant="default" className="ml-2">
                {filtrosActivos} activos
              </Badge>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            {filtrosActivos > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={limpiarFiltros}
                className="h-8 text-xs"
              >
                <X className="h-3 w-3 mr-1" />
                Limpiar
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setMostrarFiltros(!mostrarFiltros)}
              className="h-8"
            >
              {mostrarFiltros ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>

        <AnimatePresence>
          {mostrarFiltros && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 mt-4 border-t">
                {/* Filtro: Solo Infracciones */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-medium">
                    <AlertTriangle className="h-4 w-4 text-red-500" />
                    Solo Infracciones
                  </label>
                  <Button
                    variant={filtros.soloInfracciones ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setFiltros(prev => ({ 
                      ...prev, 
                      soloInfracciones: !prev.soloInfracciones 
                    }))}
                    className="w-full"
                  >
                    {filtros.soloInfracciones ? 'Activado' : 'Desactivado'}
                  </Button>
                </div>

                {/* Filtro: Dirección */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-medium">
                    <MapPin className="h-4 w-4 text-blue-500" />
                    Dirección
                  </label>
                  <select
                    value={filtros.direccion}
                    onChange={(e) => setFiltros(prev => ({ 
                      ...prev, 
                      direccion: e.target.value as any 
                    }))}
                    className="w-full h-9 px-3 rounded-md border border-input bg-background text-sm"
                  >
                    <option value="todas">Todas</option>
                    <option value="norte">Norte</option>
                    <option value="sur">Sur</option>
                  </select>
                </div>

                {/* Filtro: Velocidad */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-medium">
                    <Activity className="h-4 w-4 text-green-500" />
                    Velocidad (km/h)
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      placeholder="Min"
                      value={filtros.rangoVelocidad.min}
                      onChange={(e) => setFiltros(prev => ({
                        ...prev,
                        rangoVelocidad: { ...prev.rangoVelocidad, min: Number(e.target.value) }
                      }))}
                      className="w-full h-9 px-2 rounded-md border border-input bg-background text-sm"
                    />
                    <input
                      type="number"
                      placeholder="Max"
                      value={filtros.rangoVelocidad.max}
                      onChange={(e) => setFiltros(prev => ({
                        ...prev,
                        rangoVelocidad: { ...prev.rangoVelocidad, max: Number(e.target.value) }
                      }))}
                      className="w-full h-9 px-2 rounded-md border border-input bg-background text-sm"
                    />
                  </div>
                </div>

                {/* Filtro: Tiempo */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-medium">
                    <Calendar className="h-4 w-4 text-purple-500" />
                    Período
                  </label>
                  <select
                    value={filtros.ultimasHoras ?? 'todas'}
                    onChange={(e) => setFiltros(prev => ({ 
                      ...prev, 
                      ultimasHoras: e.target.value === 'todas' ? null : Number(e.target.value)
                    }))}
                    className="w-full h-9 px-3 rounded-md border border-input bg-background text-sm"
                  >
                    <option value="todas">Todo el tiempo</option>
                    <option value="1">Última hora</option>
                    <option value="6">Últimas 6 horas</option>
                    <option value="24">Últimas 24 horas</option>
                  </select>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Card>
  );
}
