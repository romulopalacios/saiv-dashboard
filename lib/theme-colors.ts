/**
 * Paleta de Colores - Universidad ULEAM
 * Basada en la identidad visual institucional
 */

export const uleamColors = {
  // Colores principales de ULEAM
  primary: {
    red: '#C41E3A',      // Rojo ULEAM
    darkGray: '#4A4A4A', // Gris oscuro
    lightGreen: '#9DC03E', // Verde lima ULEAM
  },
  
  // Variaciones para diferentes estados
  states: {
    success: '#10B981',   // Verde para éxito
    warning: '#F59E0B',   // Amarillo/naranja para advertencias
    danger: '#EF4444',    // Rojo para peligros/infracciones
    info: '#3B82F6',      // Azul para información
  },
  
  // Colores neutros mejorados
  neutral: {
    50: '#F9FAFB',
    100: '#F3F4F6',
    200: '#E5E7EB',
    300: '#D1D5DB',
    400: '#9CA3AF',
    500: '#6B7280',
    600: '#4B5563',
    700: '#374151',
    800: '#1F2937',
    900: '#111827',
  },
  
  // Gradientes para el dashboard
  gradients: {
    uleam: 'linear-gradient(135deg, #C41E3A 0%, #4A4A4A 100%)',
    success: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
    danger: 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)',
    info: 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)',
  }
};

export const chartColors = {
  primary: '#C41E3A',
  secondary: '#9DC03E',
  tertiary: '#4A4A4A',
  infracciones: '#EF4444',
  vehiculos: '#3B82F6',
  velocidad: '#8B5CF6',
  direccion: '#10B981',
};

export const statusColors = {
  connected: '#10B981',
  disconnected: '#EF4444',
  warning: '#F59E0B',
  idle: '#6B7280',
};
