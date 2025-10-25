// Tipos para el sistema SIAV
export interface EventoVehiculo {
  id: string;
  timestamp: number;
  velocidad: number;
  direccion: string;
  ubicacion: {
    lat: number;
    lng: number;
    nombre: string;
  };
  esInfraccion: boolean;
  limiteVelocidad: number;
  fecha: string;
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
