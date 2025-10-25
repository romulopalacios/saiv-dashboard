'use client';

import { Card } from '@/components/ui/card';
import { useEffect, useRef, useState } from 'react';
import { EventoVehiculo } from '@/lib/types';

interface MapaInteractivoProps {
  eventos: EventoVehiculo[];
}

function MapaInteractivoClient({ eventos }: MapaInteractivoProps) {
  const mapRef = useRef<any>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Importar Leaflet dinámicamente solo en el cliente
    const initMap = async () => {
      if (!mapContainerRef.current) return;

      try {
        // @ts-ignore
        const L = (await import('leaflet')).default;

        // Inicializar mapa solo una vez
        if (!mapRef.current) {
          mapRef.current = L.map(mapContainerRef.current).setView([-0.9549, -80.7288], 13);

          L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors',
          }).addTo(mapRef.current);

          setIsLoaded(true);
        }

        // Limpiar marcadores anteriores
        if (mapRef.current) {
          mapRef.current.eachLayer((layer: any) => {
            if (layer instanceof L.Marker) {
              mapRef.current?.removeLayer(layer);
            }
          });

          // Iconos personalizados
          const iconoNormal = L.divIcon({
            className: 'custom-marker',
            html: '<div style="background-color: #22c55e; width: 16px; height: 16px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>',
            iconSize: [16, 16],
          });

          const iconoInfraccion = L.divIcon({
            className: 'custom-marker',
            html: '<div style="background-color: #ef4444; width: 16px; height: 16px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3); animation: pulse 2s infinite;"></div>',
            iconSize: [16, 16],
          });

          // Agregar marcadores para eventos recientes que tengan ubicación válida
          eventos.slice(0, 20).forEach((evento) => {
            // Saltar eventos sin ubicación
            if (!evento.ubicacion || 
                typeof evento.ubicacion.lat !== 'number' || 
                typeof evento.ubicacion.lng !== 'number') {
              return;
            }

            const marker = L.marker([evento.ubicacion.lat, evento.ubicacion.lng], {
              icon: evento.esInfraccion ? iconoInfraccion : iconoNormal,
            }).addTo(mapRef.current!);

            marker.bindPopup(`
              <div style="padding: 8px; min-width: 200px;">
                <strong style="font-size: 14px; color: ${evento.esInfraccion ? '#ef4444' : '#22c55e'};">
                  ${evento.esInfraccion ? '⚠️ Infracción Detectada' : '✓ Tránsito Normal'}
                </strong>
                <hr style="margin: 8px 0; border: none; border-top: 1px solid #e5e7eb;" />
                <p style="margin: 4px 0; font-size: 13px;"><strong>Ubicación:</strong> ${evento.ubicacion.nombre}</p>
                <p style="margin: 4px 0; font-size: 13px;"><strong>Velocidad:</strong> ${evento.velocidad} km/h</p>
                ${evento.limiteVelocidad ? `<p style="margin: 4px 0; font-size: 13px;"><strong>Límite:</strong> ${evento.limiteVelocidad} km/h</p>` : ''}
                ${evento.direccion ? `<p style="margin: 4px 0; font-size: 13px;"><strong>Dirección:</strong> ${evento.direccion}</p>` : ''}
                <p style="margin: 4px 0; font-size: 12px; color: #6b7280;">${new Date(evento.timestamp).toLocaleString('es-EC')}</p>
              </div>
            `);
          });
        }
      } catch (error) {
        console.error('Error al cargar Leaflet:', error);
      }
    };

    initMap();

    return () => {
      // Limpiar al desmontar
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [eventos]);

  return (
    <>
      <div 
        ref={mapContainerRef} 
        className="rounded-lg overflow-hidden border"
        style={{ height: '400px', width: '100%' }}
      />
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-muted/50 rounded-lg">
          <p className="text-muted-foreground">Cargando mapa...</p>
        </div>
      )}
      <style jsx global>{`
        @keyframes pulse {
          0%, 100% {
            transform: scale(1);
            opacity: 1;
          }
          50% {
            transform: scale(1.2);
            opacity: 0.8;
          }
        }
      `}</style>
    </>
  );
}

export default function MapaInteractivo({ eventos }: MapaInteractivoProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <Card className="p-6 h-full">
        <h3 className="text-xl font-semibold mb-4">Mapa de Detecciones</h3>
        <div 
          className="rounded-lg overflow-hidden border bg-muted flex items-center justify-center"
          style={{ height: '400px', width: '100%' }}
        >
          <p className="text-muted-foreground">Inicializando mapa...</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 h-full relative">
      <h3 className="text-xl font-semibold mb-4">Mapa de Detecciones</h3>
      <MapaInteractivoClient eventos={eventos} />
    </Card>
  );
}
