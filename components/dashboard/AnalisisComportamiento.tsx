'use client';

import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  TrendingUp, 
  TrendingDown, 
  AlertCircle,
  CheckCircle2,
  Clock,
  MapPin,
  Activity
} from 'lucide-react';
import { motion } from 'framer-motion';
import { EventoVehiculo, Estadisticas } from '@/lib/types';

interface AnalisisComportamientoProps {
  eventos: EventoVehiculo[];
  estadisticas: Estadisticas | null;
}

interface Insight {
  tipo: 'peligro' | 'advertencia' | 'info' | 'exito';
  titulo: string;
  descripcion: string;
  icono: React.ReactNode;
}

export default function AnalisisComportamiento({ eventos, estadisticas }: AnalisisComportamientoProps) {
  if (eventos.length === 0 || !estadisticas) {
    return null;
  }

  const generarInsights = (): Insight[] => {
    const insights: Insight[] = [];

    // Análisis 1: Tasa de infracción alta
    if (estadisticas.porcentajeInfracciones > 60) {
      insights.push({
        tipo: 'peligro',
        titulo: 'Alta tasa de infracciones',
        descripcion: `${estadisticas.porcentajeInfracciones}% de las detecciones son infracciones. Se recomienda aumentar la señalización.`,
        icono: <AlertCircle className="h-5 w-5" />,
      });
    } else if (estadisticas.porcentajeInfracciones < 20) {
      insights.push({
        tipo: 'exito',
        titulo: 'Tráfico ordenado',
        descripcion: `Solo ${estadisticas.porcentajeInfracciones}% de infracciones. El comportamiento vial es excelente.`,
        icono: <CheckCircle2 className="h-5 w-5" />,
      });
    }

    // Análisis 2: Velocidad promedio
    if (estadisticas.velocidadPromedio > 70) {
      insights.push({
        tipo: 'advertencia',
        titulo: 'Velocidad promedio elevada',
        descripcion: `La velocidad promedio es ${estadisticas.velocidadPromedio} km/h. Considere medidas de control.`,
        icono: <Activity className="h-5 w-5" />,
      });
    } else if (estadisticas.velocidadPromedio < 40) {
      insights.push({
        tipo: 'info',
        titulo: 'Tráfico lento',
        descripcion: `Velocidad promedio de ${estadisticas.velocidadPromedio} km/h. Puede indicar congestión.`,
        icono: <TrendingDown className="h-5 w-5" />,
      });
    }

    // Análisis 3: Tendencia temporal (últimas 2 horas vs anteriores)
    const hace2h = Date.now() - (2 * 60 * 60 * 1000);
    const eventosRecientes = eventos.filter(e => e.timestamp >= hace2h);
    const eventosAnteriores = eventos.filter(e => e.timestamp < hace2h);

    if (eventosRecientes.length > 0 && eventosAnteriores.length > 0) {
      const infraccionesRecientes = eventosRecientes.filter(e => e.esInfraccion).length;
      const infraccionesAnteriores = eventosAnteriores.filter(e => e.esInfraccion).length;
      
      const tasaReciente = (infraccionesRecientes / eventosRecientes.length) * 100;
      const tasaAnterior = (infraccionesAnteriores / eventosAnteriores.length) * 100;

      if (tasaReciente > tasaAnterior + 15) {
        insights.push({
          tipo: 'advertencia',
          titulo: 'Aumento de infracciones',
          descripcion: `Las infracciones aumentaron ${Math.round(tasaReciente - tasaAnterior)}% en las últimas 2 horas.`,
          icono: <TrendingUp className="h-5 w-5" />,
        });
      } else if (tasaReciente < tasaAnterior - 15) {
        insights.push({
          tipo: 'exito',
          titulo: 'Mejora en el tráfico',
          descripcion: `Las infracciones disminuyeron ${Math.round(tasaAnterior - tasaReciente)}% en las últimas 2 horas.`,
          icono: <TrendingDown className="h-5 w-5" />,
        });
      }
    }

    // Análisis 4: Distribución por dirección
    const direccionNorte = eventos.filter(e => e.direccion === 'norte').length;
    const direccionSur = eventos.filter(e => e.direccion === 'sur').length;
    
    if (direccionNorte > direccionSur * 2) {
      insights.push({
        tipo: 'info',
        titulo: 'Flujo desbalanceado',
        descripcion: `${Math.round((direccionNorte / eventos.length) * 100)}% del tráfico va hacia el Norte. Considere ajustar semáforos.`,
        icono: <MapPin className="h-5 w-5" />,
      });
    } else if (direccionSur > direccionNorte * 2) {
      insights.push({
        tipo: 'info',
        titulo: 'Flujo desbalanceado',
        descripcion: `${Math.round((direccionSur / eventos.length) * 100)}% del tráfico va hacia el Sur. Considere ajustar semáforos.`,
        icono: <MapPin className="h-5 w-5" />,
      });
    }

    // Análisis 5: Hora pico (últimas 24 horas)
    const hace24h = Date.now() - (24 * 60 * 60 * 1000);
    const eventosUltimas24h = eventos.filter(e => e.timestamp >= hace24h);
    
    if (eventosUltimas24h.length > 0) {
      const eventosPorHora: { [hora: number]: number } = {};
      eventosUltimas24h.forEach(e => {
        const hora = new Date(e.timestamp).getHours();
        eventosPorHora[hora] = (eventosPorHora[hora] || 0) + 1;
      });

      const horaPico = Object.entries(eventosPorHora)
        .sort(([, a], [, b]) => b - a)[0];

      if (horaPico) {
        insights.push({
          tipo: 'info',
          titulo: 'Hora pico identificada',
          descripcion: `Mayor tráfico a las ${horaPico[0]}:00 con ${horaPico[1]} detecciones en esa hora.`,
          icono: <Clock className="h-5 w-5" />,
        });
      }
    }

    return insights;
  };

  const insights = generarInsights();

  const getVariante = (tipo: Insight['tipo']) => {
    switch (tipo) {
      case 'peligro':
        return 'destructive';
      case 'advertencia':
        return 'default';
      case 'exito':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  const getColor = (tipo: Insight['tipo']) => {
    switch (tipo) {
      case 'peligro':
        return 'text-red-500';
      case 'advertencia':
        return 'text-orange-500';
      case 'exito':
        return 'text-green-500';
      default:
        return 'text-blue-500';
    }
  };

  return (
    <Card className="p-6">
      <div className="flex items-center gap-3 mb-4">
        <Activity className="h-5 w-5 text-muted-foreground" />
        <h3 className="text-xl font-semibold">Análisis Inteligente</h3>
        <Badge variant="secondary">{insights.length} insights</Badge>
      </div>

      <div className="space-y-3">
        {insights.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">
            No hay suficientes datos para generar insights
          </p>
        ) : (
          insights.map((insight, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-start gap-3 p-4 rounded-lg border bg-card hover:bg-accent transition-colors"
            >
              <div className={getColor(insight.tipo)}>
                {insight.icono}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-semibold text-sm">{insight.titulo}</h4>
                  <Badge variant={getVariante(insight.tipo) as any} className="h-5 text-xs">
                    {insight.tipo}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  {insight.descripcion}
                </p>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </Card>
  );
}
