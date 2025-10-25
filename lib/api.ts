// API para conectar con el backend de Railway (ahora con Supabase)
const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://siav-backend-production.up.railway.app';

// Configuración para las llamadas
const fetchConfig: RequestInit = {
  cache: 'no-store',
  headers: {
    'Content-Type': 'application/json',
  },
};

// Helper para crear fetch con timeout
function fetchWithTimeout(url: string, options: RequestInit = {}, timeoutMs: number = 10000): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
  
  return fetch(url, {
    ...options,
    signal: controller.signal,
  }).finally(() => clearTimeout(timeoutId));
}

/**
 * Verificar el estado del backend
 */
export async function getBackendStatus() {
  try {
    const response = await fetchWithTimeout(`${API_BASE_URL}/`, fetchConfig, 5000);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error('Error fetching backend status:', error);
    return null;
  }
}

/**
 * Obtener eventos recientes desde Supabase a través del backend
 */
export async function getEventosRecientes(limit: number = 100) {
  try {
    const response = await fetchWithTimeout(
      `${API_BASE_URL}/api/eventos?limit=${limit}`,
      fetchConfig,
      8000
    );
    
    if (!response.ok) {
      const errorText = await response.text();
      console.warn(`Backend endpoint error: ${response.status}`, errorText);
      
      // Verificar errores de base de datos
      if (errorText.includes('Quota exceeded') || errorText.includes('RESOURCE_EXHAUSTED')) {
        throw new Error('DATABASE_ERROR');
      }
      
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }
    
    const data = await response.json();
    
    // Verificar si hay error en la respuesta JSON
    if (data.error) {
      console.error('Error en respuesta del backend:', data.error);
      throw new Error('DATABASE_ERROR');
    }
    
    // Los eventos ya vienen transformados del backend
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error('Error fetching eventos:', error);
    
    if ((error as Error).message === 'DATABASE_ERROR') {
      throw error; // Re-lanzar para que el componente lo maneje
    }
    
    // Error de timeout o red
    if ((error as Error).name === 'TimeoutError' || (error as Error).name === 'AbortError') {
      console.error('Timeout al conectar con el backend');
      throw new Error('BACKEND_TIMEOUT');
    }
    
    return [];
  }
}

/**
 * Obtener estadísticas desde el backend (con caché de 30s)
 */
export async function getEstadisticas() {
  try {
    const response = await fetchWithTimeout(
      `${API_BASE_URL}/api/estadisticas`,
      fetchConfig,
      8000
    );
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    
    const data = await response.json();
    
    // Verificar si hay error en la respuesta
    if (data.error) {
      console.error('Error en respuesta del backend:', data.error);
      throw new Error('DATABASE_ERROR');
    }
    
    // El backend ya envía el formato correcto
    // Mapear totalDetecciones a totalVehiculos para compatibilidad con el frontend
    return {
      totalVehiculos: data.totalDetecciones || 0,
      velocidadPromedio: data.velocidadPromedio || 0,
      totalInfracciones: data.totalInfracciones || 0,
      porcentajeInfracciones: data.porcentajeInfracciones || 0,
      ultimaActualizacion: data.ultimaActualizacion || new Date().toISOString(),
      // Info adicional del backend
      cached: data.cached || false,
      fallback: data.fallback || false,
    };
  } catch (error) {
    console.error('Error fetching estadisticas:', error);
    
    // En caso de error, devolver estadísticas vacías
    return {
      totalVehiculos: 0,
      velocidadPromedio: 0,
      totalInfracciones: 0,
      porcentajeInfracciones: 0,
      ultimaActualizacion: new Date().toISOString(),
      error: true,
    };
  }
}

/**
 * Obtener datos para gráficos agrupados por hora (últimas 24 horas)
 */
export async function getDatosGrafico() {
  try {
    const response = await fetchWithTimeout(
      `${API_BASE_URL}/api/graficos`,
      fetchConfig,
      8000
    );
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    
    const data = await response.json();
    
    // Verificar si hay error en la respuesta
    if (data.error) {
      console.error('Error en respuesta del backend:', data.error);
      return [];
    }
    
    // El backend ya envía los datos en el formato correcto
    // Mapear 'detecciones' a 'vehiculos' para compatibilidad con el frontend
    return Array.isArray(data) 
      ? data.map((item: any) => ({
          hora: item.hora,
          vehiculos: item.detecciones || item.vehiculos || 0,
          infracciones: item.infracciones || 0,
          velocidadPromedio: item.velocidadPromedio || 0,
        }))
      : [];
  } catch (error) {
    console.error('Error fetching datos de gráfico:', error);
    return [];
  }
}

/**
 * Obtener estadísticas adicionales desde el endpoint /stats (con más detalles)
 */
export async function getEstadisticasDetalladas() {
  try {
    const response = await fetchWithTimeout(
      `${API_BASE_URL}/stats`,
      fetchConfig,
      8000
    );
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching estadísticas detalladas:', error);
    return null;
  }
}

/**
 * Obtener eventos recientes sin límite específico (usa el endpoint /eventos/recientes)
 */
export async function getEventosRecientesBackend(limit: number = 10) {
  try {
    const response = await fetchWithTimeout(
      `${API_BASE_URL}/eventos/recientes?limit=${limit}`,
      fetchConfig,
      8000
    );
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    
    const data = await response.json();
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error('Error fetching eventos recientes:', error);
    return [];
  }
}
