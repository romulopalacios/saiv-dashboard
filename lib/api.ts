// API para conectar con el backend de Railway y Firebase
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://siav-backend-production.up.railway.app';

// Configuración para las llamadas
const fetchConfig: RequestInit = {
  cache: 'no-store',
  headers: {
    'Content-Type': 'application/json',
  },
};

/**
 * Verificar el estado del backend
 */
export async function getBackendStatus() {
  try {
    const response = await fetch(`${API_BASE_URL}/`, fetchConfig);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error('Error fetching backend status:', error);
    return null;
  }
}

/**
 * Obtener eventos recientes desde Firebase a través del backend
 * Ajusta el endpoint según tu implementación real
 */
export async function getEventosRecientes(limit: number = 100) {
  try {
    // Opción 1: Si tienes un endpoint en tu backend
    const response = await fetch(
      `${API_BASE_URL}/api/eventos?limit=${limit}`,
      fetchConfig
    );
    
    if (!response.ok) {
      console.warn(`Backend endpoint not available: ${response.status}`);
      return [];
    }
    
    const data = await response.json();
    
    // Transformar los datos al formato esperado por el frontend
    return Array.isArray(data) ? data.map(transformarEvento) : [];
  } catch (error) {
    console.error('Error fetching eventos:', error);
    return [];
  }
}

/**
 * Obtener estadísticas desde el backend o calcularlas
 */
export async function getEstadisticas() {
  try {
    // Opción 1: Si tienes un endpoint de estadísticas
    const response = await fetch(
      `${API_BASE_URL}/api/estadisticas`,
      fetchConfig
    );
    
    if (response.ok) {
      return await response.json();
    }
    
    // Opción 2: Calcular desde los eventos si no hay endpoint
    const eventos = await getEventosRecientes(100);
    
    if (eventos.length === 0) {
      return {
        totalVehiculos: 0,
        velocidadPromedio: 0,
        totalInfracciones: 0,
        porcentajeInfracciones: 0,
        ultimaActualizacion: new Date().toISOString(),
      };
    }
    
    const infracciones = eventos.filter(e => e.esInfraccion);
    const velocidades = eventos.map(e => e.velocidad);
    const velocidadPromedio = velocidades.reduce((sum, v) => sum + v, 0) / velocidades.length;
    
    return {
      totalVehiculos: eventos.length,
      velocidadPromedio: Math.round(velocidadPromedio),
      totalInfracciones: infracciones.length,
      porcentajeInfracciones: Math.round((infracciones.length / eventos.length) * 100),
      ultimaActualizacion: new Date().toISOString(),
    };
  } catch (error) {
    console.error('Error fetching estadisticas:', error);
    return {
      totalVehiculos: 0,
      velocidadPromedio: 0,
      totalInfracciones: 0,
      porcentajeInfracciones: 0,
      ultimaActualizacion: new Date().toISOString(),
    };
  }
}

/**
 * Obtener datos para gráficos agrupados por hora
 */
export async function getDatosGrafico() {
  try {
    // Opción 1: Si tienes un endpoint específico para gráficos
    const response = await fetch(
      `${API_BASE_URL}/api/graficos`,
      fetchConfig
    );
    
    if (response.ok) {
      return await response.json();
    }
    
    // Opción 2: Procesar eventos para generar datos de gráficos
    const eventos = await getEventosRecientes(200);
    
    if (eventos.length === 0) return [];
    
    const datosPorHora: { 
      [key: string]: { 
        vehiculos: number; 
        infracciones: number; 
        velocidades: number[] 
      } 
    } = {};

    eventos.forEach(evento => {
      const fecha = new Date(evento.timestamp);
      const hora = `${fecha.getHours().toString().padStart(2, '0')}:00`;

      if (!datosPorHora[hora]) {
        datosPorHora[hora] = { vehiculos: 0, infracciones: 0, velocidades: [] };
      }

      datosPorHora[hora].vehiculos++;
      if (evento.esInfraccion) datosPorHora[hora].infracciones++;
      datosPorHora[hora].velocidades.push(evento.velocidad);
    });

    return Object.entries(datosPorHora)
      .map(([hora, datos]) => ({
        hora,
        vehiculos: datos.vehiculos,
        infracciones: datos.infracciones,
        velocidadPromedio: Math.round(
          datos.velocidades.reduce((sum, v) => sum + v, 0) / datos.velocidades.length
        ),
      }))
      .sort((a, b) => a.hora.localeCompare(b.hora))
      .slice(-12); // Últimas 12 horas
  } catch (error) {
    console.error('Error fetching datos de gráfico:', error);
    return [];
  }
}

/**
 * Transformar evento de Firestore al formato del frontend
 * Estructura específica para tu backend SIAV
 */
function transformarEvento(evento: any) {
  // Tu backend ya envía el formato correcto, solo normalizamos timestamps
  return {
    id: evento.id || `evento-${Date.now()}`,
    timestamp: evento.timestamp ? 
      (typeof evento.timestamp === 'string' ? new Date(evento.timestamp).getTime() : evento.timestamp) : 
      Date.now(),
    velocidad: evento.velocidad || 0,
    direccion: evento.direccion || 'N/A',
    ubicacion: evento.ubicacion || {
      lat: -0.9549,
      lng: -80.7288,
      nombre: 'Ubicación desconocida'
    },
    esInfraccion: evento.esInfraccion || false,
    limiteVelocidad: evento.limiteVelocidad || 50,
    fecha: evento.fecha || evento.timestamp || new Date().toISOString(),
    dispositivo_id: evento.dispositivo_id || 'N/A',
  };
}
