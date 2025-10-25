'use client';

import { Card } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import { EventoVehiculo } from '@/lib/types';

interface TablaEventosProps {
  eventos: EventoVehiculo[];
}

export default function TablaEventos({ eventos }: TablaEventosProps) {
  return (
    <Card className="p-6">
      <h3 className="text-xl font-semibold mb-4">Eventos Recientes</h3>
      <div className="rounded-md border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Hora</TableHead>
              <TableHead>Ubicación</TableHead>
              <TableHead>Dirección</TableHead>
              <TableHead>Velocidad</TableHead>
              <TableHead>Límite</TableHead>
              <TableHead>Estado</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {eventos.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                  No hay eventos disponibles
                </TableCell>
              </TableRow>
            ) : (
              eventos.slice(0, 10).map((evento, index) => (
                <motion.tr
                  key={evento.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.03 }}
                  className="hover:bg-muted/50 transition-colors"
                >
                  <TableCell className="font-medium">
                    {new Date(evento.timestamp).toLocaleTimeString('es-EC', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </TableCell>
                  <TableCell>
                    {evento.ubicacion?.nombre || 'Sin ubicación'}
                  </TableCell>
                  <TableCell>
                    {evento.direccion ? (
                      <Badge variant="outline">{evento.direccion}</Badge>
                    ) : (
                      <span className="text-muted-foreground text-sm">N/A</span>
                    )}
                  </TableCell>
                  <TableCell className="font-bold">
                    <span className={evento.esInfraccion ? 'text-red-600' : 'text-green-600'}>
                      {evento.velocidad} km/h
                    </span>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {evento.limiteVelocidad ? `${evento.limiteVelocidad} km/h` : 'N/A'}
                  </TableCell>
                  <TableCell>
                    {evento.esInfraccion ? (
                      <Badge variant="destructive">Infracción</Badge>
                    ) : (
                      <Badge variant="secondary" className="bg-green-100 text-green-800">
                        Normal
                      </Badge>
                    )}
                  </TableCell>
                </motion.tr>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
}
