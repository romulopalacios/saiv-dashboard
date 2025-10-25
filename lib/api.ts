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
      const errorText = await response.text();
      console.warn(`Backend endpoint error: ${response.status}`, errorText);
      
      // Si es error de cuota de Firebase, lanzar error específico
      if (errorText.includes('Quota exceeded') || errorText.includes('RESOURCE_EXHAUSTED')) {
        throw new Error('FIREBASE_QUOTA_EXCEEDED');
      }
      
      return [];
    }
    
    const data = await response.json();
    
    // Verificar si hay error en la respuesta JSON
    if (data.error && (data.error.includes('Quota exceeded') || data.error.includes('RESOURCE_EXHAUSTED'))) {
      throw new Error('FIREBASE_QUOTA_EXCEEDED');
    }
    
    // Transformar los datos al formato esperado por el frontend y filtrar nulos
    return Array.isArray(data) 
      ? data.map(transformarEvento).filter((e): e is NonNullable<typeof e> => e !== null)
      : [];
  } catch (error) {
    console.error('Error fetching eventos:', error);
    if ((error as Error).message === 'FIREBASE_QUOTA_EXCEEDED') {
      throw error; // Re-lanzar para que el componente lo maneje
    }
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
      const data = await response.json();
      
      // Verificar si hay error de cuota de Firebase
      if (data.error && (data.error.includes('Quota exceeded') || data.error.includes('RESOURCE_EXHAUSTED'))) {
        throw new Error('FIREBASE_QUOTA_EXCEEDED');
      }
      
      // Compatibilidad con backend viejo (totalVehiculos) y nuevo (totalDetecciones)
      return {
        totalVehiculos: data.totalDetecciones || data.totalVehiculos || 0,
        velocidadPromedio: data.velocidadPromedio || 0,
        totalInfracciones: data.totalInfracciones || 0,
        porcentajeInfracciones: data.porcentajeInfracciones || 0,
        ultimaActualizacion: data.ultimaActualizacion || new Date().toISOString(),
      };
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
 * SOLO usa datos reales del backend, NO inventa nada
 */
function transformarEvento(evento: any) {
  // Validar que el evento tenga los datos mínimos requeridos
  if (!evento || typeof evento !== 'object') {
    console.warn('Evento inválido recibido:', evento);
    return null;
  }

  // Timestamp: usar el del evento o null si no existe
  let timestamp = Date.now();
  if (evento.timestamp) {
    timestamp = typeof evento.timestamp === 'string' 
      ? new Date(evento.timestamp).getTime() 
      : evento.timestamp;
  } else if (evento.recibidoEn) {
    // Firestore Timestamp
    timestamp = evento.recibidoEn._seconds 
      ? evento.recibidoEn._seconds * 1000 
      : new Date(evento.recibidoEn).getTime();
  }

  // Ubicación: usar la del evento o null si no está completa
  let ubicacion = null;
  if (evento.ubicacion && 
      typeof evento.ubicacion.lat === 'number' && 
      typeof evento.ubicacion.lng === 'number') {
    ubicacion = {
      lat: evento.ubicacion.lat,
      lng: evento.ubicacion.lng,
      nombre: evento.ubicacion.nombre || 'Sin nombre',
    };
  }

  return {
    id: evento.id || `${timestamp}`,
    timestamp,
    velocidad: typeof evento.velocidad === 'number' ? evento.velocidad : 0,
    direccion: evento.direccion || null,
    ubicacion,
    esInfraccion: Boolean(evento.esInfraccion),
    limiteVelocidad: typeof evento.limiteVelocidad === 'number' ? evento.limiteVelocidad : null,
    fecha: evento.fecha || new Date(timestamp).toISOString(),
    dispositivo_id: evento.dispositivo_id || null,
  };
}
