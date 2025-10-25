// Tipos para el sistema SIAV
export interface EventoVehiculo {
  id: string;
  timestamp: number;
  velocidad: number;
  direccion: string | null;
  ubicacion: {
    lat: number;
    lng: number;
    nombre: string;
  } | null;
  esInfraccion: boolean;
  limiteVelocidad: number | null;
  fecha: string;
  dispositivo_id?: string | null;
}

export interface Estadisticas {
  totalVehiculos: number;
  velocidadPromedio: number;
  totalInfracciones: number;
  porcentajeInfracciones: number;
  ultimaActualizacion: string;
}

export interface DatosGrafico {
  hora: string;
  vehiculos: number;
  infracciones: number;
  velocidadPromedio: number;
}

export interface AlertaInfraccion {
  id: string;
  mensaje: string;
  timestamp: number;
  severidad: 'alta' | 'media' | 'baja';
}
