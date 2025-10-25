'use client';

import { useEffect, useState, useCallback } from 'react';
import { Car, AlertTriangle, Activity, TrendingUp } from 'lucide-react';
import StatCard from '@/components/dashboard/StatCard';
import ChartCard from '@/components/dashboard/ChartCard';
import TablaEventos from '@/components/dashboard/TablaEventos';
import MapaInteractivo from '@/components/dashboard/MapaInteractivo';
import AlertasEnVivo from '@/components/dashboard/AlertasEnVivo';
import Velocimetro from '@/components/dashboard/Velocimetro';
import ThemeToggle from '@/components/ThemeToggle';
import EstadoConexion from '@/components/dashboard/EstadoConexion';
import FiltrosAvanzados from '@/components/dashboard/FiltrosAvanzados';
import ExportarDatos from '@/components/dashboard/ExportarDatos';
import AnalisisComportamiento from '@/components/dashboard/AnalisisComportamiento';
import ComparacionTemporal from '@/components/dashboard/ComparacionTemporal';
import { getEventosRecientes, getEstadisticas, getDatosGrafico } from '@/lib/api';
import { EventoVehiculo, Estadisticas, DatosGrafico } from '@/lib/types';

export default function DashboardPage() {
  const [eventos, setEventos] = useState<EventoVehiculo[]>([]);
  const [eventosFiltrados, setEventosFiltrados] = useState<EventoVehiculo[]>([]);
  const [estadisticas, setEstadisticas] = useState<Estadisticas | null>(null);
  const [datosGrafico, setDatosGrafico] = useState<DatosGrafico[]>([]);
  const [loading, setLoading] = useState(true);
  const [ultimaActualizacion, setUltimaActualizacion] = useState<Date>(new Date());
  const [errorBackend, setErrorBackend] = useState(false);
  const [errorMensaje, setErrorMensaje] = useState('');

  const cargarDatos = useCallback(async () => {
    try {
      setErrorBackend(false);
      setErrorMensaje('');
      
      const [eventosData, estadisticasData, graficosData] = await Promise.all([
        getEventosRecientes(100),
        getEstadisticas(),
        getDatosGrafico(),
      ]);

      setEventos(eventosData);
      setEventosFiltrados(eventosData);
      setEstadisticas(estadisticasData);
      setDatosGrafico(graficosData);
      setUltimaActualizacion(new Date());
    } catch (error) {
      console.error('Error cargando datos:', error);
      
      // Detectar diferentes tipos de errores
      const errorMsg = (error as Error).message;
      
      if (errorMsg === 'DATABASE_ERROR') {
        setErrorBackend(true);
        setErrorMensaje('Error de base de datos. El backend está usando el caché de emergencia.');
      } else if (errorMsg === 'BACKEND_TIMEOUT') {
        setErrorBackend(true);
        setErrorMensaje('Timeout al conectar con el backend. Verifica tu conexión.');
      } else if (errorMsg.includes('Failed to fetch')) {
        setErrorBackend(true);
        setErrorMensaje('No se puede conectar con el backend. Verifica que esté en línea.');
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    cargarDatos();

    // Actualizar datos cada 10 segundos
    const interval = setInterval(cargarDatos, 10000);

    return () => clearInterval(interval);
  }, [cargarDatos]);

  const handleFiltrar = useCallback((eventosFiltrados: EventoVehiculo[]) => {
    setEventosFiltrados(eventosFiltrados);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-lg font-medium">Cargando dashboard...</p>
          <p className="text-sm text-muted-foreground mt-2">Conectando con backend...</p>
        </div>
      </div>
    );
  }

  const ultimoEvento = eventosFiltrados[0];

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
            <div className="text-sm text-muted-foreground hidden md:block">
              Actualizado: {ultimaActualizacion.toLocaleTimeString('es-EC')}
            </div>
            <EstadoConexion onReconectar={cargarDatos} />
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Alerta de Error de Backend */}
        {errorBackend && (
          <div className="mb-6 p-4 bg-amber-50 dark:bg-amber-900/20 border-2 border-amber-500 rounded-lg">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-6 w-6 text-amber-500 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h3 className="text-lg font-bold text-amber-700 dark:text-amber-400 mb-2">
                  ⚠️ Advertencia: Error de Conexión
                </h3>
                <p className="text-sm text-amber-600 dark:text-amber-300 mb-3">
                  {errorMensaje || 'Hubo un problema al conectar con el backend.'}
                </p>
                <div className="bg-white dark:bg-gray-800 p-3 rounded border border-amber-200 dark:border-amber-800">
                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                    <strong>Estado:</strong> El backend está usando caché de emergencia. Los datos pueden no estar actualizados.
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    <strong>Soluciones:</strong>
                  </p>
                  <ul className="text-xs text-gray-600 dark:text-gray-400 list-disc list-inside mt-1 space-y-1">
                    <li>Verifica que el backend esté en línea en Railway</li>
                    <li>Revisa la URL del backend en las variables de entorno</li>
                    <li>Verifica la conexión a Supabase desde el backend</li>
                    <li>El backend usa caché automático para mantener funcionando el dashboard</li>
                  </ul>
                </div>
                <button
                  onClick={cargarDatos}
                  className="mt-3 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-sm rounded-lg transition-colors"
                >
                  🔄 Reintentar Conexión
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Filtros Avanzados */}
        <FiltrosAvanzados eventos={eventos} onFiltrar={handleFiltrar} />

        {/* KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Detecciones Totales"
            value={estadisticas?.totalVehiculos || 0}
            icon={Car}
            color="blue"
          />
          <StatCard
            title="Infracciones Detectadas"
            value={estadisticas?.totalInfracciones || 0}
            icon={AlertTriangle}
            color="red"
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

        {/* Comparación Temporal */}
        <div className="mb-8">
          <ComparacionTemporal eventos={eventos} />
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

        {/* Análisis Inteligente y Exportación */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <AnalisisComportamiento eventos={eventosFiltrados} estadisticas={estadisticas} />
          <ExportarDatos eventos={eventosFiltrados} estadisticas={estadisticas} />
        </div>

        {/* Mapa y Alertas */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2">
            <MapaInteractivo eventos={eventosFiltrados} />
          </div>
          <div>
            <AlertasEnVivo eventos={eventos} />
          </div>
        </div>

        {/* Tabla de Eventos */}
        <TablaEventos eventos={eventosFiltrados} />

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
