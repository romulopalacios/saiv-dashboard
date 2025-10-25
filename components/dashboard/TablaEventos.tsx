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
    <Card className="p-6 border border-gray-200 dark:border-gray-800 transition-smooth hover-glow shadow-soft hover:shadow-lg bg-white dark:bg-gray-900">
      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">
        Eventos Recientes
      </h3>
      <div className="rounded-lg border border-gray-200 dark:border-gray-800 overflow-hidden bg-gray-50/50 dark:bg-gray-800/30">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50 dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800">
              <TableHead className="font-bold text-gray-700 dark:text-gray-300">Hora</TableHead>
              <TableHead className="font-bold text-gray-700 dark:text-gray-300">Ubicación</TableHead>
              <TableHead className="font-bold text-gray-700 dark:text-gray-300">Dirección</TableHead>
              <TableHead className="font-bold text-gray-700 dark:text-gray-300">Velocidad</TableHead>
              <TableHead className="font-bold text-gray-700 dark:text-gray-300">Límite</TableHead>
              <TableHead className="font-bold text-gray-700 dark:text-gray-300">Estado</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {eventos.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-12">
                  <div className="text-4xl mb-3">📊</div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                    No hay eventos disponibles
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Los eventos aparecerán aquí cuando se detecten
                  </p>
                </TableCell>
              </TableRow>
            ) : (
              eventos.slice(0, 10).map((evento, index) => (
                <motion.tr
                  key={evento.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.03 }}
                  className="hover:bg-white dark:hover:bg-gray-800/50 transition-colors border-b border-gray-200 dark:border-gray-800 last:border-0"
                >
                  <TableCell className="font-medium text-gray-900 dark:text-white">
                    {new Date(evento.timestamp).toLocaleTimeString('es-EC', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </TableCell>
                  <TableCell className="text-gray-700 dark:text-gray-300">
                    {evento.ubicacion?.nombre || 'Sin ubicación'}
                  </TableCell>
                  <TableCell>
                    {evento.direccion ? (
                      <Badge variant="outline" className="border-gray-300 dark:border-gray-700">
                        {evento.direccion}
                      </Badge>
                    ) : (
                      <span className="text-gray-500 dark:text-gray-400 text-sm">N/A</span>
                    )}
                  </TableCell>
                  <TableCell className="font-bold">
                    <span className={evento.esInfraccion ? 'text-[#C41E3A] dark:text-red-400' : 'text-[#9DC03E] dark:text-green-400'}>
                      {evento.velocidad} km/h
                    </span>
                  </TableCell>
                  <TableCell className="text-gray-500 dark:text-gray-400">
                    {evento.limiteVelocidad ? `${evento.limiteVelocidad} km/h` : 'N/A'}
                  </TableCell>
                  <TableCell>
                    {evento.esInfraccion ? (
                      <Badge variant="destructive">Infracción</Badge>
                    ) : (
                      <Badge variant="secondary" className="bg-green-100 dark:bg-green-950/30 text-green-700 dark:text-green-400 border-green-200 dark:border-green-900/30">
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
