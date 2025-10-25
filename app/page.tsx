'use client';

import { useEffect, useState, useCallback } from 'react';
import { Car, AlertTriangle, Activity, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';
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
import WelcomeBanner from '@/components/dashboard/WelcomeBanner';
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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Header Rediseñado - Limpio y Profesional */}
      <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            
            {/* Lado Izquierdo: Logo ULEAM + Info Sistema */}
            <div className="flex items-center gap-4">
              {/* Logo ULEAM Real */}
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-br from-[#C41E3A]/20 to-[#9DC03E]/20 rounded-xl blur-lg group-hover:blur-xl transition-all opacity-0 group-hover:opacity-100"></div>
                <div className="relative bg-white dark:bg-gray-800 p-2 rounded-xl border-2 border-gray-200 dark:border-gray-700 hover:border-[#C41E3A] dark:hover:border-[#C41E3A] transition-all">
                  <img 
                    src="/uleam-logo.svg" 
                    alt="ULEAM" 
                    className="h-12 w-12 object-contain"
                  />
                </div>
              </div>

              {/* Separador sutil */}
              <div className="h-12 w-px bg-gradient-to-b from-transparent via-gray-300 dark:via-gray-700 to-transparent"></div>
              
              {/* Información del Sistema */}
              <div>
                <h1 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
                  SIAV Dashboard
                </h1>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    Sistema Inteligente de Analítica Vial
                  </span>
                  <span className="hidden sm:inline text-xs text-gray-300 dark:text-gray-600">•</span>
                  <span className="hidden sm:inline text-xs font-medium text-[#C41E3A]">
                    ULEAM
                  </span>
                </div>
              </div>
            </div>

            {/* Lado Derecho: Controles */}
            <div className="flex items-center gap-3">
              {/* Última actualización - más compacto */}
              <div className="hidden lg:flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
                <div className="text-xs">
                  <span className="text-gray-500 dark:text-gray-400">Actualizado: </span>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {ultimaActualizacion.toLocaleTimeString('es-EC', { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
              
              {/* Estado de conexión */}
              <EstadoConexion onReconectar={cargarDatos} />
              
              {/* Toggle de tema */}
              <ThemeToggle />
            </div>
          </div>
        </div>
        
        {/* Barra de acento inferior - más sutil y elegante */}
        <div className="h-0.5 bg-gradient-to-r from-transparent via-[#C41E3A] to-transparent opacity-50"></div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Banner de Bienvenida */}
        <WelcomeBanner />

        {/* Alerta de Error de Backend */}
        {errorBackend && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-5 glass border-2 border-amber-500/50 rounded-xl shadow-lg"
          >
            <div className="flex items-start gap-4">
              <div className="p-3 bg-amber-500/10 rounded-lg">
                <AlertTriangle className="h-7 w-7 text-amber-500" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-amber-700 dark:text-amber-400 mb-2 flex items-center gap-2">
                  ⚠️ Advertencia de Conexión
                </h3>
                <p className="text-sm text-amber-600 dark:text-amber-300 mb-3 leading-relaxed">
                  {errorMensaje || 'Problema al conectar con el backend. Usando datos en caché.'}
                </p>
                <div className="bg-white/50 dark:bg-gray-800/50 p-4 rounded-lg border border-amber-200/50 dark:border-amber-800/50">
                  <p className="text-xs text-gray-700 dark:text-gray-300 mb-2 font-semibold">
                    📊 Estado del Sistema:
                  </p>
                  <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-1.5">
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                      El backend está usando caché de emergencia
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                      Los datos pueden no estar actualizados
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                      Verifica la conexión a Supabase/Railway
                    </li>
                  </ul>
                </div>
                <button
                  onClick={cargarDatos}
                  className="mt-4 px-4 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white text-sm font-semibold rounded-lg transition-smooth shadow-md hover:shadow-lg"
                >
                  🔄 Reintentar Conexión
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Filtros Avanzados */}
        <FiltrosAvanzados eventos={eventos} onFiltrar={handleFiltrar} />

        {/* KPIs Mejorados con Diseño ULEAM */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ staggerChildren: 0.1 }}
        >
          <StatCard
            title="Detecciones Totales"
            value={estadisticas?.totalVehiculos || 0}
            subtitle="Vehículos monitoreados"
            icon={Car}
            color="blue"
          />
          <StatCard
            title="Infracciones Detectadas"
            value={estadisticas?.totalInfracciones || 0}
            subtitle="Excesos de velocidad"
            icon={AlertTriangle}
            color="uleam"
          />
          <StatCard
            title="Velocidad Promedio"
            value={`${estadisticas?.velocidadPromedio || 0} km/h`}
            subtitle="Media del tráfico"
            icon={Activity}
            color="green"
          />
          <StatCard
            title="Tasa de Infracción"
            value={`${estadisticas?.porcentajeInfracciones || 0}%`}
            subtitle="Porcentaje de excesos"
            icon={TrendingUp}
            color="orange"
          />
        </motion.div>

        {/* Gráficos y Velocímetro */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2">
            <ChartCard
              title="Análisis de Tráfico por Hora"
              description="Distribución horaria de vehículos e infracciones"
              data={datosGrafico}
              type="bar"
              dataKeys={[
                { key: 'vehiculos', color: '#3B82F6', name: 'Vehículos Detectados' },
                { key: 'infracciones', color: '#C41E3A', name: 'Infracciones' },
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
            description="Tendencia de velocidad media del flujo vehicular"
            data={datosGrafico}
            type="line"
            dataKeys={[
              { key: 'velocidadPromedio', color: '#9DC03E', name: 'Velocidad Promedio (km/h)' },
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

        {/* Footer Mejorado con Branding ULEAM */}
        <footer className="mt-16 pb-8">
          <div className="rounded-2xl p-8 border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-soft">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-6">
              {/* Información del Proyecto */}
              <div>
                <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                  <span className="w-1 h-4 bg-gradient-to-b from-[#C41E3A] to-[#9DC03E] rounded-full"></span>
                  Sobre el Proyecto
                </h4>
                <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                  Sistema desarrollado para la Casa Abierta de Tecnologías de la Información,
                  demostrando capacidades de IoT y análisis de datos en tiempo real.
                </p>
              </div>

              {/* Tecnologías */}
              <div>
                <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                  <span className="w-1 h-4 bg-gradient-to-b from-[#C41E3A] to-[#9DC03E] rounded-full"></span>
                  Stack Tecnológico
                </h4>
                <div className="flex flex-wrap gap-2">
                  <span className="px-2 py-1 bg-blue-100 dark:bg-blue-950/30 text-blue-700 dark:text-blue-400 text-xs rounded-md font-medium border border-blue-200 dark:border-blue-900/30">
                    Next.js 16
                  </span>
                  <span className="px-2 py-1 bg-purple-100 dark:bg-purple-950/30 text-purple-700 dark:text-purple-400 text-xs rounded-md font-medium border border-purple-200 dark:border-purple-900/30">
                    Supabase
                  </span>
                  <span className="px-2 py-1 bg-green-100 dark:bg-green-950/30 text-green-700 dark:text-green-400 text-xs rounded-md font-medium border border-green-200 dark:border-green-900/30">
                    Railway
                  </span>
                  <span className="px-2 py-1 bg-orange-100 dark:bg-orange-950/30 text-orange-700 dark:text-orange-400 text-xs rounded-md font-medium border border-orange-200 dark:border-orange-900/30">
                    MQTT
                  </span>
                </div>
              </div>

              {/* Universidad */}
              <div>
                <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                  <span className="w-1 h-4 bg-gradient-to-b from-[#C41E3A] to-[#9DC03E] rounded-full"></span>
                  Universidad ULEAM
                </h4>
                <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                  Universidad Laica "Eloy Alfaro" de Manabí<br />
                  Facultad de Tecnologías de la Información<br />
                  Sistemas Distribuidos • 2025
                </p>
              </div>
            </div>

            {/* Copyright */}
            <div className="pt-6 border-t border-gray-200 dark:border-gray-800 text-center">
              <p className="text-xs text-gray-500 dark:text-gray-400">
                © 2025 ULEAM - Sistema Inteligente de Analítica Vial • 
                Desarrollado con <span className="text-[#C41E3A]">❤</span> para la Casa Abierta
              </p>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
