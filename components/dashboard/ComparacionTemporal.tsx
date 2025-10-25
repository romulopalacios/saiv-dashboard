'use client';

import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  TrendingUp, 
  TrendingDown, 
  Minus,
  Clock,
  Activity,
  AlertTriangle
} from 'lucide-react';
import { motion } from 'framer-motion';
import { EventoVehiculo } from '@/lib/types';

interface ComparacionTemporalProps {
  eventos: EventoVehiculo[];
}

interface Metrica {
  nombre: string;
  valorActual: number;
  valorAnterior: number;
  unidad: string;
  icono: React.ReactNode;
}

export default function ComparacionTemporal({ eventos }: ComparacionTemporalProps) {
  if (eventos.length < 10) {
    return (
      <Card className="p-6">
        <h3 className="text-xl font-semibold mb-4">Comparación Temporal</h3>
        <p className="text-sm text-muted-foreground text-center py-8">
          Se necesitan más datos para mostrar comparaciones
        </p>
      </Card>
    );
  }

  // Dividir eventos en dos períodos: última hora vs hora anterior
  const hace1h = Date.now() - (1 * 60 * 60 * 1000);
  const hace2h = Date.now() - (2 * 60 * 60 * 1000);

  const eventosRecientes = eventos.filter(e => e.timestamp >= hace1h);
  const eventosAnteriores = eventos.filter(e => e.timestamp >= hace2h && e.timestamp < hace1h);

  if (eventosRecientes.length === 0 || eventosAnteriores.length === 0) {
    return (
      <Card className="p-6">
        <h3 className="text-xl font-semibold mb-4">Comparación Temporal</h3>
        <p className="text-sm text-muted-foreground text-center py-8">
          No hay suficientes datos en ambos períodos
        </p>
      </Card>
    );
  }

  // Calcular métricas para ambos períodos
  const calcularMetricas = (eventos: EventoVehiculo[]) => {
    const infracciones = eventos.filter(e => e.esInfraccion).length;
    const velocidades = eventos.map(e => e.velocidad);
    const velocidadPromedio = velocidades.reduce((a, b) => a + b, 0) / velocidades.length;
    const tasaInfraccion = (infracciones / eventos.length) * 100;

    return {
      detecciones: eventos.length,
      infracciones,
      velocidadPromedio: Math.round(velocidadPromedio),
      tasaInfraccion: Math.round(tasaInfraccion),
    };
  };

  const metricasRecientes = calcularMetricas(eventosRecientes);
  const metricasAnteriores = calcularMetricas(eventosAnteriores);

  const metricas: Metrica[] = [
    {
      nombre: 'Detecciones',
      valorActual: metricasRecientes.detecciones,
      valorAnterior: metricasAnteriores.detecciones,
      unidad: '',
      icono: <Activity className="h-4 w-4" />,
    },
    {
      nombre: 'Infracciones',
      valorActual: metricasRecientes.infracciones,
      valorAnterior: metricasAnteriores.infracciones,
      unidad: '',
      icono: <AlertTriangle className="h-4 w-4" />,
    },
    {
      nombre: 'Velocidad Promedio',
      valorActual: metricasRecientes.velocidadPromedio,
      valorAnterior: metricasAnteriores.velocidadPromedio,
      unidad: 'km/h',
      icono: <Activity className="h-4 w-4" />,
    },
    {
      nombre: 'Tasa Infracción',
      valorActual: metricasRecientes.tasaInfraccion,
      valorAnterior: metricasAnteriores.tasaInfraccion,
      unidad: '%',
      icono: <AlertTriangle className="h-4 w-4" />,
    },
  ];

  const calcularCambio = (actual: number, anterior: number) => {
    if (anterior === 0) return { porcentaje: 0, direccion: 'igual' as const };
    const porcentaje = Math.round(((actual - anterior) / anterior) * 100);
    
    if (porcentaje > 5) return { porcentaje, direccion: 'subida' as const };
    if (porcentaje < -5) return { porcentaje: Math.abs(porcentaje), direccion: 'bajada' as const };
    return { porcentaje: 0, direccion: 'igual' as const };
  };

  const getTendenciaIcon = (direccion: 'subida' | 'bajada' | 'igual') => {
    switch (direccion) {
      case 'subida':
        return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'bajada':
        return <TrendingDown className="h-4 w-4 text-red-500" />;
      default:
        return <Minus className="h-4 w-4 text-gray-500" />;
    }
  };

  const getTendenciaColor = (direccion: 'subida' | 'bajada' | 'igual') => {
    switch (direccion) {
      case 'subida':
        return 'text-green-600';
      case 'bajada':
        return 'text-red-600';
      default:
        return 'text-gray-500';
    }
  };

  return (
    <Card className="p-6">
      <div className="flex items-center gap-3 mb-6">
        <Clock className="h-5 w-5 text-muted-foreground" />
        <div>
          <h3 className="text-xl font-semibold">Comparación Temporal</h3>
          <p className="text-xs text-muted-foreground mt-1">
            Última hora vs hora anterior
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {metricas.map((metrica, index) => {
          const cambio = calcularCambio(metrica.valorActual, metrica.valorAnterior);
          
          return (
            <motion.div
              key={metrica.nombre}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="p-4 rounded-lg border bg-card hover:bg-accent transition-colors"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  {metrica.icono}
                  <span className="text-xs font-medium text-muted-foreground">
                    {metrica.nombre}
                  </span>
                </div>
                {getTendenciaIcon(cambio.direccion)}
              </div>

              <div className="flex items-baseline gap-2 mb-2">
                <span className="text-2xl font-bold">
                  {metrica.valorActual}
                </span>
                <span className="text-sm text-muted-foreground">
                  {metrica.unidad}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">
                  Anterior: {metrica.valorAnterior}{metrica.unidad}
                </span>
                {cambio.direccion !== 'igual' && (
                  <Badge 
                    variant="secondary" 
                    className={`text-xs ${getTendenciaColor(cambio.direccion)}`}
                  >
                    {cambio.direccion === 'subida' ? '+' : '-'}{cambio.porcentaje}%
                  </Badge>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </Card>
  );
}
