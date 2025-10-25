'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Download, 
  FileJson, 
  FileSpreadsheet, 
  FileText,
  Loader2 
} from 'lucide-react';
import { EventoVehiculo, Estadisticas } from '@/lib/types';

interface ExportarDatosProps {
  eventos: EventoVehiculo[];
  estadisticas: Estadisticas | null;
}

export default function ExportarDatos({ eventos, estadisticas }: ExportarDatosProps) {
  const [exportando, setExportando] = useState(false);

  const exportarJSON = () => {
    setExportando(true);
    const dataStr = JSON.stringify({
      fecha_exportacion: new Date().toISOString(),
      estadisticas,
      eventos: eventos.map(e => ({
        id: e.id,
        timestamp: new Date(e.timestamp).toISOString(),
        velocidad: e.velocidad,
        direccion: e.direccion,
        ubicacion: e.ubicacion?.nombre || 'N/A',
        coordenadas: e.ubicacion ? `${e.ubicacion.lat},${e.ubicacion.lng}` : 'N/A',
        esInfraccion: e.esInfraccion,
        limiteVelocidad: e.limiteVelocidad || 'N/A',
        dispositivo_id: e.dispositivo_id || 'N/A',
      })),
      total_eventos: eventos.length,
    }, null, 2);

    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = `siav-datos-${new Date().toISOString().split('T')[0]}.json`;

    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    
    setTimeout(() => setExportando(false), 500);
  };

  const exportarCSV = () => {
    setExportando(true);
    
    // Encabezados
    const headers = [
      'ID',
      'Fecha',
      'Hora',
      'Velocidad (km/h)',
      'Dirección',
      'Ubicación',
      'Latitud',
      'Longitud',
      'Es Infracción',
      'Límite Velocidad',
      'Dispositivo ID'
    ];

    // Filas
    const rows = eventos.map(e => {
      const fecha = new Date(e.timestamp);
      return [
        e.id,
        fecha.toLocaleDateString('es-EC'),
        fecha.toLocaleTimeString('es-EC'),
        e.velocidad,
        e.direccion || 'N/A',
        e.ubicacion?.nombre || 'N/A',
        e.ubicacion?.lat || 'N/A',
        e.ubicacion?.lng || 'N/A',
        e.esInfraccion ? 'SÍ' : 'NO',
        e.limiteVelocidad || 'N/A',
        e.dispositivo_id || 'N/A'
      ];
    });

    // Construir CSV
    let csvContent = headers.join(',') + '\n';
    rows.forEach(row => {
      csvContent += row.map(cell => `"${cell}"`).join(',') + '\n';
    });

    // Descargar
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `siav-eventos-${new Date().toISOString().split('T')[0]}.csv`);
    link.click();
    
    setTimeout(() => setExportando(false), 500);
  };

  const exportarReporte = () => {
    setExportando(true);
    
    const infracciones = eventos.filter(e => e.esInfraccion);
    const velocidades = eventos.map(e => e.velocidad);
    const velocidadMax = Math.max(...velocidades);
    const velocidadMin = Math.min(...velocidades);

    const reporte = `
═══════════════════════════════════════════════════════════
        REPORTE SIAV - SISTEMA INTELIGENTE DE ANALÍTICA VIAL
═══════════════════════════════════════════════════════════

Fecha de Generación: ${new Date().toLocaleString('es-EC')}
Período de Análisis: ${eventos.length > 0 ? new Date(eventos[eventos.length - 1].timestamp).toLocaleDateString('es-EC') : 'N/A'} - ${eventos.length > 0 ? new Date(eventos[0].timestamp).toLocaleDateString('es-EC') : 'N/A'}

─────────────────────────────────────────────────────────────
ESTADÍSTICAS GENERALES
─────────────────────────────────────────────────────────────

Total de Detecciones:        ${estadisticas?.totalVehiculos || 0}
Infracciones Detectadas:     ${estadisticas?.totalInfracciones || 0}
Velocidad Promedio:          ${estadisticas?.velocidadPromedio || 0} km/h
Tasa de Infracción:          ${estadisticas?.porcentajeInfracciones || 0}%

Velocidad Máxima Registrada: ${velocidadMax} km/h
Velocidad Mínima Registrada: ${velocidadMin} km/h

─────────────────────────────────────────────────────────────
DISTRIBUCIÓN DE TRÁFICO POR DIRECCIÓN
─────────────────────────────────────────────────────────────

Norte: ${eventos.filter(e => e.direccion === 'norte').length} detecciones (${Math.round((eventos.filter(e => e.direccion === 'norte').length / eventos.length) * 100)}%)
Sur:   ${eventos.filter(e => e.direccion === 'sur').length} detecciones (${Math.round((eventos.filter(e => e.direccion === 'sur').length / eventos.length) * 100)}%)
N/A:   ${eventos.filter(e => !e.direccion).length} detecciones

─────────────────────────────────────────────────────────────
TOP 5 INFRACCIONES MÁS GRAVES
─────────────────────────────────────────────────────────────

${infracciones
  .filter(e => e.limiteVelocidad)
  .map(e => ({ ...e, exceso: e.velocidad - (e.limiteVelocidad || 0) }))
  .sort((a, b) => b.exceso - a.exceso)
  .slice(0, 5)
  .map((e, i) => `${i + 1}. Velocidad: ${e.velocidad} km/h (Límite: ${e.limiteVelocidad} km/h) | Exceso: +${e.exceso} km/h
   Ubicación: ${e.ubicacion?.nombre || 'N/A'}
   Fecha: ${new Date(e.timestamp).toLocaleString('es-EC')}
`)
  .join('\n')}

─────────────────────────────────────────────────────────────
ÚLTIMOS 10 EVENTOS
─────────────────────────────────────────────────────────────

${eventos.slice(0, 10).map((e, i) => `${i + 1}. ${new Date(e.timestamp).toLocaleString('es-EC')}
   ${e.esInfraccion ? '⚠️ INFRACCIÓN' : '✓ Normal'} | Velocidad: ${e.velocidad} km/h | Dirección: ${e.direccion || 'N/A'}
   Ubicación: ${e.ubicacion?.nombre || 'N/A'}
`).join('\n')}

═══════════════════════════════════════════════════════════
        Universidad Laica Eloy Alfaro de Manabí
        Casa Abierta de Tecnologías de la Información
═══════════════════════════════════════════════════════════
`.trim();

    const blob = new Blob([reporte], { type: 'text/plain;charset=utf-8' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `siav-reporte-${new Date().toISOString().split('T')[0]}.txt`);
    link.click();
    
    setTimeout(() => setExportando(false), 500);
  };

  return (
    <Card className="p-6">
      <div className="flex items-center gap-3 mb-4">
        <Download className="h-5 w-5 text-muted-foreground" />
        <h3 className="text-xl font-semibold">Exportar Datos</h3>
        <Badge variant="secondary">{eventos.length} eventos</Badge>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <Button
          onClick={exportarJSON}
          disabled={exportando || eventos.length === 0}
          variant="outline"
          className="w-full"
        >
          {exportando ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <FileJson className="h-4 w-4 mr-2" />
          )}
          JSON
        </Button>

        <Button
          onClick={exportarCSV}
          disabled={exportando || eventos.length === 0}
          variant="outline"
          className="w-full"
        >
          {exportando ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <FileSpreadsheet className="h-4 w-4 mr-2" />
          )}
          CSV
        </Button>

        <Button
          onClick={exportarReporte}
          disabled={exportando || eventos.length === 0}
          variant="outline"
          className="w-full"
        >
          {exportando ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <FileText className="h-4 w-4 mr-2" />
          )}
          Reporte
        </Button>
      </div>

      {eventos.length === 0 && (
        <p className="text-sm text-muted-foreground mt-4 text-center">
          No hay datos para exportar
        </p>
      )}
    </Card>
  );
}
