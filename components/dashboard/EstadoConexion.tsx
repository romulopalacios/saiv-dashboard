'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Wifi, WifiOff, RefreshCw } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { getBackendStatus } from '@/lib/api';

interface EstadoBackend {
  status: string;
  mqtt: {
    connected: boolean;
    broker: string;
  };
  firebase: {
    connected: boolean;
  };
  uptime: number;
}

interface EstadoConexionProps {
  onReconectar?: () => void;
}

export default function EstadoConexion({ onReconectar }: EstadoConexionProps) {
  const [estado, setEstado] = useState<EstadoBackend | null>(null);
  const [error, setError] = useState(false);
  const [verificando, setVerificando] = useState(false);

  const verificarConexion = async () => {
    setVerificando(true);
    try {
      const status = await getBackendStatus();
      if (status) {
        setEstado(status);
        setError(false);
      } else {
        setError(true);
      }
    } catch (err) {
      setError(true);
    } finally {
      setVerificando(false);
    }
  };

  useEffect(() => {
    verificarConexion();
    const interval = setInterval(verificarConexion, 30000); // Cada 30s
    return () => clearInterval(interval);
  }, []);

  const handleReconectar = () => {
    verificarConexion();
    onReconectar?.();
  };

  const formatUptime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  };

  const todoConectado = estado?.mqtt.connected && estado?.firebase.connected;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="flex items-center gap-3"
      >
        {error ? (
          <>
            <WifiOff className="h-4 w-4 text-red-500 animate-pulse" />
            <Badge variant="destructive" className="gap-1">
              Desconectado
            </Badge>
            <Button
              size="sm"
              variant="outline"
              onClick={handleReconectar}
              disabled={verificando}
              className="h-7 text-xs"
            >
              <RefreshCw className={`h-3 w-3 mr-1 ${verificando ? 'animate-spin' : ''}`} />
              Reintentar
            </Button>
          </>
        ) : todoConectado ? (
          <>
            <Wifi className="h-4 w-4 text-green-500" />
            <Badge variant="default" className="bg-green-500 gap-1">
              Conectado
            </Badge>
            {estado && (
              <span className="text-xs text-muted-foreground hidden sm:block">
                Uptime: {formatUptime(estado.uptime)}
              </span>
            )}
          </>
        ) : (
          <>
            <RefreshCw className="h-4 w-4 text-orange-500 animate-spin" />
            <Badge variant="secondary">Conectando...</Badge>
          </>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
