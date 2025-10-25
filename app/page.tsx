'use client';

import { useEffect, useState } from 'react';
import { Car, AlertTriangle, Activity, TrendingUp } from 'lucide-react';
import StatCard from '@/components/dashboard/StatCard';
import ChartCard from '@/components/dashboard/ChartCard';
import TablaEventos from '@/components/dashboard/TablaEventos';
import MapaInteractivo from '@/components/dashboard/MapaInteractivo';
import AlertasEnVivo from '@/components/dashboard/AlertasEnVivo';
import Velocimetro from '@/components/dashboard/Velocimetro';
import ThemeToggle from '@/components/ThemeToggle';
import { getEventosRecientes, getEstadisticas, getDatosGrafico } from '@/lib/api';
import { EventoVehiculo, Estadisticas, DatosGrafico } from '@/lib/types';

export default function DashboardPage() {
  const [eventos, setEventos] = useState<EventoVehiculo[]>([]);
  const [estadisticas, setEstadisticas] = useState<Estadisticas | null>(null);
  const [datosGrafico, setDatosGrafico] = useState<DatosGrafico[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const [eventosData, estadisticasData, graficosData] = await Promise.all([
          getEventosRecientes(50),
          getEstadisticas(),
          getDatosGrafico(),
        ]);

        setEventos(eventosData);
        setEstadisticas(estadisticasData);
        setDatosGrafico(graficosData);
      } catch (error) {
        console.error('Error cargando datos:', error);
      } finally {
        setLoading(false);
      }
    };

    cargarDatos();

    // Actualizar datos cada 10 segundos
    const interval = setInterval(cargarDatos, 10000);

    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-lg font-medium">Cargando dashboard...</p>
        </div>
      </div>
    );
  }

  const ultimoEvento = eventos[0];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header */}
      <header className="border-b bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-600 rounded-lg">
              <Car className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                SIAV Dashboard
              </h1>
              <p className="text-sm text-muted-foreground">
                Sistema Inteligente de Analítica Vial
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-sm text-muted-foreground hidden sm:block">
              Universidad Laica Eloy Alfaro de Manabí
            </div>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Vehículos Detectados"
            value={estadisticas?.totalVehiculos || 0}
            icon={Car}
            color="blue"
            trend={{ value: 12, isPositive: true }}
          />
          <StatCard
            title="Infracciones"
            value={estadisticas?.totalInfracciones || 0}
            icon={AlertTriangle}
            color="red"
            trend={{ value: 8, isPositive: false }}
          />
          <StatCard
            title="Velocidad Promedio"
            value={`${estadisticas?.velocidadPromedio || 0} km/h`}
            icon={Activity}
            color="green"
          />
          <StatCard
            title="Tasa de Infracción"
            value={`${estadisticas?.porcentajeInfracciones || 0}%`}
            icon={TrendingUp}
            color="orange"
          />
        </div>

        {/* Gráficos y Velocímetro */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2">
            <ChartCard
              title="Tráfico por Hora"
              data={datosGrafico}
              type="bar"
              dataKeys={[
                { key: 'vehiculos', color: '#3b82f6', name: 'Vehículos' },
                { key: 'infracciones', color: '#ef4444', name: 'Infracciones' },
              ]}
            />
          </div>
          <div>
            <Velocimetro
              velocidadActual={ultimoEvento?.velocidad || 0}
              limiteVelocidad={ultimoEvento?.limiteVelocidad || 50}
            />
          </div>
        </div>

        {/* Gráfico de Velocidad */}
        <div className="mb-8">
          <ChartCard
            title="Velocidad Promedio por Hora"
            data={datosGrafico}
            type="line"
            dataKeys={[
              { key: 'velocidadPromedio', color: '#8b5cf6', name: 'Velocidad Promedio (km/h)' },
            ]}
          />
        </div>

        {/* Mapa y Alertas */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2">
            <MapaInteractivo eventos={eventos} />
          </div>
          <div>
            <AlertasEnVivo eventos={eventos} />
          </div>
        </div>

        {/* Tabla de Eventos */}
        <TablaEventos eventos={eventos} />

        {/* Footer */}
        <footer className="mt-12 text-center text-sm text-muted-foreground pb-8">
          <p>
            Desarrollado para la Casa Abierta de Tecnologías de la Información
          </p>
          <p className="mt-2">
            Backend: Railway • Frontend: Next.js • Database: Firebase
          </p>
        </footer>
      </main>
    </div>
  );
}
