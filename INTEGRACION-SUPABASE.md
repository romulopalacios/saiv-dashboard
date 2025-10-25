# ✅ Integración Frontend con Backend Supabase

## 🎯 Resumen

El frontend del dashboard SIAV ha sido actualizado completamente para integrarse con el nuevo backend que usa **Supabase PostgreSQL** en lugar de Firebase.

---

## 🔄 Cambios Realizados

### 1. **lib/api.ts** - API Client
✅ **Actualizado completamente**

- Reemplazadas todas las referencias a Firebase por llamadas al backend
- Endpoints integrados:
  - `GET /api/eventos` - Obtener eventos recientes
  - `GET /api/estadisticas` - Obtener estadísticas (con caché de 30s)
  - `GET /api/graficos` - Obtener datos para gráficos (últimas 24h)
  - `GET /` - Health check del backend
  - `GET /stats` - Estadísticas detalladas
  - `GET /eventos/recientes` - Eventos sin formato específico

- **Manejo de errores mejorado:**
  - `DATABASE_ERROR` - Errores de base de datos
  - `BACKEND_TIMEOUT` - Timeout de conexión (10s)
  - `Failed to fetch` - Backend offline

- **Características:**
  - Timeout de 10 segundos en todas las peticiones
  - Mapeo automático de `totalDetecciones` → `totalVehiculos` (compatibilidad)
  - Mapeo automático de `detecciones` → `vehiculos` en gráficos
  - Los eventos ya vienen pre-formateados desde el backend

### 2. **app/page.tsx** - Dashboard Principal
✅ **Actualizado**

- Estado de error actualizado:
  - `errorFirebase` → `errorBackend`
  - Nuevo estado: `errorMensaje` para mensajes específicos

- **Mensaje de error mejorado:**
  - Color: Ámbar (advertencia) en lugar de rojo (error crítico)
  - Explica que el backend usa caché de emergencia
  - Soluciones específicas para Supabase/Railway
  - Botón "Reintentar Conexión"

### 3. **components/dashboard/EstadoConexion.tsx**
✅ **Actualizado**

- Soporte para ambos backends:
  - `estado.firebase.connected` (legacy)
  - `estado.supabase.connected` (nuevo)

- **Verificaciones opcionales:**
  - `estado?.mqtt?.connected` con nullish coalescing
  - `estado?.supabase?.connected` con fallback a Firebase
  - `estado?.uptime` opcional

- Ya no crashea si `getBackendStatus()` retorna `null`

### 4. **.env.local** - Variables de Entorno
✅ **Actualizado**

```bash
# Para desarrollo local (backend en localhost:3000)
NEXT_PUBLIC_BACKEND_URL=http://localhost:3000

# Para producción en Railway (cuando esté en línea)
# NEXT_PUBLIC_BACKEND_URL=https://siav-backend-production.up.railway.app
```

**Notas:**
- La variable cambió de `NEXT_PUBLIC_API_URL` → `NEXT_PUBLIC_BACKEND_URL`
- Configuraciones de Firebase eliminadas (ya no se usan)
- Configuraciones de mapas mantenidas

---

## 🧪 Testing Realizado

### Backend Local (Puerto 3000)
```powershell
# Health Check
✅ GET http://localhost:3000/
Response: {
  "status": "SIAV Backend Running",
  "version": "2.0.0",
  "database": "Supabase PostgreSQL",
  "mqtt": { "connected": true },
  "supabase": { "connected": true, "readable": true, "totalEvents": 6 }
}

# Estadísticas
✅ GET http://localhost:3000/api/estadisticas
Response: {
  "totalDetecciones": 6,
  "velocidadPromedio": 60,
  "totalInfracciones": 3,
  "porcentajeInfracciones": 50,
  "ultimaActualizacion": "2025-10-25T04:59:27.742Z"
}

# Eventos
✅ GET http://localhost:3000/api/eventos?limit=5
Response: [
  {
    "id": 6,
    "timestamp": 1761367006630,
    "velocidad": 43.93,
    "direccion": "sur",
    "ubicacion": { "lat": 19.43, "lng": -99.13 },
    "esInfraccion": false,
    "limiteVelocidad": 60,
    "fecha": "2025-10-25T04:36:46.63+00:00",
    "dispositivo_id": "SIM_ESP32_001"
  },
  ...
]
```

### Frontend Next.js (Puerto 3001)
```powershell
✅ Dashboard cargando correctamente
✅ Estadísticas mostrando datos reales
✅ Eventos en la tabla
✅ Gráficos renderizados
✅ Componente EstadoConexion sin errores
✅ Sin errores de compilación TypeScript
```

---

## 📦 Estructura de Datos

### Evento (EventoVehiculo)
```typescript
{
  id: string;                    // ID único del evento
  timestamp: number;             // Milisegundos desde epoch
  velocidad: number;             // km/h
  direccion: string | null;      // "norte" | "sur" | null
  ubicacion: {
    lat: number;
    lng: number;
    nombre: string;
  } | null;
  esInfraccion: boolean;         // true si excede límite
  limiteVelocidad: number | null;// km/h
  fecha: string;                 // ISO 8601
  dispositivo_id?: string | null;
}
```

### Estadísticas
```typescript
{
  totalVehiculos: number;        // totalDetecciones (mapeado)
  velocidadPromedio: number;     // km/h
  totalInfracciones: number;
  porcentajeInfracciones: number;// 0-100
  ultimaActualizacion: string;   // ISO 8601
  cached?: boolean;              // true si viene del caché
  fallback?: boolean;            // true si es fallback de emergencia
}
```

### Datos de Gráfico
```typescript
{
  hora: string;                  // "14:00"
  vehiculos: number;             // detecciones (mapeado)
  infracciones: number;
  velocidadPromedio: number;     // km/h
}
```

---

## 🚀 Despliegue

### Desarrollo Local

1. **Iniciar Backend:**
```bash
cd backend
npm run dev
# Escucha en http://localhost:3000
```

2. **Iniciar Frontend:**
```bash
cd saiv-dashboard
npm run dev
# Escucha en http://localhost:3001 (si 3000 está ocupado)
```

3. **Variables de entorno:**
```bash
# .env.local
NEXT_PUBLIC_BACKEND_URL=http://localhost:3000
```

### Producción (Railway)

1. **Backend ya desplegado en Railway:**
   - URL: `https://siav-backend-production.up.railway.app`
   - Variables de entorno configuradas:
     - `SUPABASE_URL`
     - `SUPABASE_SERVICE_KEY`
     - `MQTT_BROKER`
     - `MQTT_TOPIC`
     - `PORT=3000`

2. **Frontend (Vercel o Railway):**
```bash
# Variables de entorno en Vercel/Railway
NEXT_PUBLIC_BACKEND_URL=https://siav-backend-production.up.railway.app
```

3. **Verificar:**
   - ✅ Backend responde en `/`
   - ✅ Supabase conectado (`supabase.connected: true`)
   - ✅ MQTT conectado (`mqtt.connected: true`)

---

## 🔧 Troubleshooting

### ❌ Error: "Cannot read properties of undefined (reading 'connected')"
**Causa:** `getBackendStatus()` retorna `null` pero el componente no maneja el caso.

**Solución:** ✅ Ya corregido en `EstadoConexion.tsx`
- Propiedades opcionales en el tipo `EstadoBackend`
- Uso de optional chaining (`?.`)
- Nullish coalescing (`??`) para valores por defecto

### ❌ Error: "502 Application failed to respond"
**Causa:** Backend en Railway está caído o reiniciándose.

**Solución:**
1. Verificar logs en Railway
2. Verificar variables de entorno (SUPABASE_URL, SUPABASE_SERVICE_KEY)
3. Verificar que Supabase esté accesible
4. Reiniciar el servicio en Railway

### ❌ Error: "Timeout al conectar con el backend"
**Causa:** Backend tarda más de 10 segundos en responder.

**Solución:**
1. Verificar caché del backend (debe responder rápido)
2. Revisar logs de Supabase (queries lentas)
3. Optimizar índices en PostgreSQL
4. Aumentar timeout en `lib/api.ts` si es necesario

### ⚠️ Advertencia: "El backend está usando caché de emergencia"
**Causa:** Supabase no responde, backend usa contadores en memoria.

**Solución:**
- **Normal:** El backend sigue funcionando con datos en caché
- **Crítico:** Si persiste, revisar conexión a Supabase
- Los datos se actualizarán automáticamente cuando Supabase vuelva

---

## 📊 Características del Backend

### Caché Inteligente
- **Estadísticas:** 30 segundos de TTL
- **Eventos:** 10 segundos de TTL
- **Fallback:** Contadores en memoria si Supabase falla

### Endpoints Optimizados
- **Health check:** Verifica conectividad a Supabase
- **Estadísticas:** Usa vista materializada `vista_estadisticas_tiempo_real`
- **Eventos:** Ordenados por `recibido_en DESC` con límite configurable
- **Gráficos:** Agrupa por hora, últimas 24 horas

### Seguridad
- CORS habilitado para desarrollo
- Variables sensibles en `.env`
- Service role key solo en backend
- Anon key (si se usa) solo lectura

---

## 🎉 Próximos Pasos

### Para App Móvil (React Native / Flutter)

**Opción 1: Usar el backend (Recomendado)**
```typescript
// Misma API que en web
const response = await fetch('https://siav-backend-production.up.railway.app/api/eventos');
const eventos = await response.json();
```

**Ventajas:**
- ✅ Mismo código que web
- ✅ Caché incluido
- ✅ Validaciones del backend
- ✅ Un solo punto de mantenimiento

**Opción 2: Conectar directo a Supabase**
```typescript
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://xxx.supabase.co',
  'anon_key_aqui'  // Solo lectura
);

const { data } = await supabase
  .from('eventos_trafico')
  .select('*')
  .order('recibido_en', { ascending: false })
  .limit(50);
```

**Ventajas:**
- ✅ Realtime nativo con subscriptions
- ✅ Sin intermediario
- ✅ SDK oficial para móvil

**Desventaja:**
- ⚠️ Duplicas lógica de negocio

### Realtime en Web (Opcional)

Si quieres actualizaciones instantáneas sin polling:

```typescript
// lib/supabase-client.ts (nuevo archivo)
import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// app/page.tsx
useEffect(() => {
  const canal = supabase
    .channel('eventos-realtime')
    .on('postgres_changes', 
      { event: 'INSERT', schema: 'public', table: 'eventos_trafico' },
      (payload) => {
        console.log('🔔 Nuevo evento:', payload.new);
        setEventos(prev => [payload.new, ...prev]);
      }
    )
    .subscribe();
  
  return () => { supabase.removeChannel(canal); };
}, []);
```

---

## 📝 Notas Finales

1. ✅ **Backend con Supabase funcionando al 100%**
2. ✅ **Frontend integrado correctamente**
3. ✅ **Caché de emergencia implementado**
4. ✅ **Manejo de errores robusto**
5. ✅ **TypeScript sin errores**
6. ⚠️ **Railway backend temporalmente offline** (verificar despliegue)

**Estado actual:**
- Desarrollo local: ✅ Funcionando perfectamente
- Producción Railway: ⚠️ Verificar que el backend esté en línea

**Para Casa Abierta:**
- Si Railway falla: Usar backend local
- Si quieres datos reales: Asegurar que Railway esté up
- Dashboard funciona con caché incluso si Supabase falla

---

## 🔗 URLs Importantes

- **Backend Local:** http://localhost:3000
- **Frontend Local:** http://localhost:3001
- **Backend Railway:** https://siav-backend-production.up.railway.app
- **Supabase Project:** https://iagocycfidhjylitjbhj.supabase.co
- **MQTT Broker:** mqtt://test.mosquitto.org:1883
- **MQTT Topic:** `siav/eventos/test`

---

**Fecha de integración:** 25 de octubre de 2025  
**Versión Backend:** 2.0.0 (Supabase Edition)  
**Versión Frontend:** 0.1.0 (Next.js 16.0.0)
