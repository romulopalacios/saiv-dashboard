# 🚦 SIAV Dashboard - Sistema Inteligente de Analítica Vial

Dashboard interactivo en tiempo real para monitoreo y análisis de tráfico vehicular desarrollado con Next.js 14, TypeScript y Tailwind CSS.

## 🎯 Características

- ✨ **Dashboard en Tiempo Real**: Actualización automática de datos cada 10 segundos
- 📊 **Visualizaciones Interactivas**: Gráficos con Recharts (barras, líneas)
- 🗺️ **Mapa Interactivo**: Visualización geográfica con Leaflet
- 🚗 **Velocímetro Animado**: Indicador visual de velocidad actual
- ⚡ **Alertas en Vivo**: Notificaciones de infracciones en tiempo real
- 🌓 **Modo Oscuro/Claro**: Toggle de tema
- 📱 **100% Responsive**: Diseño adaptable a todos los dispositivos
- 🎨 **UI Moderna**: Componentes Shadcn/ui con animaciones Framer Motion

## 🛠️ Tecnologías

- **Framework**: Next.js 14 (App Router)
- **Lenguaje**: TypeScript
- **Estilos**: Tailwind CSS
- **UI Components**: Shadcn/ui
- **Gráficos**: Recharts
- **Mapas**: Leaflet + React-Leaflet
- **Animaciones**: Framer Motion
- **Iconos**: Lucide React
- **Backend**: Railway (https://siav-backend-production.up.railway.app/)
- **Base de Datos**: Firebase

## 🚀 Instalación y Ejecución

### Prerrequisitos
- Node.js 18+ 
- npm o yarn

### Pasos

1. **Clonar el repositorio**
```bash
git clone <tu-repo>
cd saiv-dashboard
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Ejecutar en desarrollo**
```bash
npm run dev
```

4. **Abrir en el navegador**
```
http://localhost:3000
```

## 📦 Scripts Disponibles

- `npm run dev` - Inicia el servidor de desarrollo
- `npm run build` - Crea la versión de producción
- `npm start` - Inicia el servidor de producción
- `npm run lint` - Ejecuta el linter

## 🌐 Despliegue

### Vercel (Recomendado)

1. Sube tu código a GitHub
2. Conecta tu repositorio en [Vercel](https://vercel.com)
3. Deploy automático ✨

### Otras Plataformas
- Netlify
- Railway
- AWS Amplify
- Google Cloud Run

## 📊 Estructura del Proyecto

```
saiv-dashboard/
├── app/
│   ├── layout.tsx          # Layout principal
│   ├── page.tsx             # Página del dashboard
│   └── globals.css          # Estilos globales
├── components/
│   ├── dashboard/
│   │   ├── StatCard.tsx     # Tarjetas de estadísticas
│   │   ├── ChartCard.tsx    # Gráficos
│   │   ├── TablaEventos.tsx # Tabla de eventos
│   │   ├── MapaInteractivo.tsx # Mapa con Leaflet
│   │   ├── AlertasEnVivo.tsx   # Alertas en tiempo real
│   │   └── Velocimetro.tsx     # Velocímetro animado
│   ├── ui/                  # Componentes Shadcn/ui
│   └── ThemeToggle.tsx      # Toggle de tema
├── lib/
│   ├── api.ts               # Conexión con backend
│   ├── types.ts             # Tipos TypeScript
│   └── utils.ts             # Utilidades
└── public/                  # Archivos estáticos
```

## 🔌 Integración con Backend

El dashboard se conecta directamente con el backend de Railway y Firebase:
- **URL Base**: `https://siav-backend-production.up.railway.app/`
- **Actualización**: Cada 10 segundos automáticamente
- **Endpoints**: `/api/eventos`, `/api/estadisticas`, `/api/graficos`

### Endpoints Requeridos

El backend debe exponer estos endpoints REST:

#### GET /api/eventos?limit=100
Retorna la lista de eventos vehiculares detectados.

#### GET /api/estadisticas
Retorna estadísticas calculadas del tráfico (opcional - se calcula del lado del cliente si no existe).

#### GET /api/graficos
Retorna datos agrupados por hora para gráficos (opcional - se calcula del lado del cliente si no existe).

### Estructura de Datos Esperada

```typescript
// Evento
{
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
```

### Adaptación Automática

El código incluye lógica adaptativa:
- ✅ Si los endpoints existen, los usa
- ✅ Si no existen, calcula estadísticas desde los eventos
- ✅ Maneja errores y muestra UI vacía si no hay datos

### Testing con Simulador

El proyecto incluye `simulador.py` para generar eventos de prueba:

```bash
# Instalar dependencias
pip install requests

# Ejecutar simulador
python simulador.py
```

El simulador envía eventos simulados al backend cada 3 segundos para demostración.

### Variables de Entorno

Copia `.env.local` y ajusta según tu configuración:

```bash
NEXT_PUBLIC_API_URL=https://siav-backend-production.up.railway.app
NEXT_PUBLIC_REFRESH_INTERVAL=10000
```

## 🎨 Personalización

### Colores y Tema
Edita `app/globals.css` para cambiar los colores del tema.

### Ubicaciones del Mapa
Modifica las coordenadas en `lib/api.ts`:
```typescript
const ubicaciones = [
  { lat: -0.9549, lng: -80.7288, nombre: 'Tu Ubicación' },
  // Agrega más ubicaciones
];
```

## 🏫 Desarrollado Para

**Universidad Laica Eloy Alfaro de Manabí**  
Casa Abierta de Tecnologías de la Información

## 📝 Licencia

Este proyecto es de código abierto y está disponible para fines educativos.

## 🤝 Contribuciones

¡Las contribuciones son bienvenidas! Por favor:
1. Fork el proyecto
2. Crea una rama para tu feature
3. Commit tus cambios
4. Push a la rama
5. Abre un Pull Request

## 📧 Contacto

Para preguntas o soporte, contacta al equipo de desarrollo.

---

⭐ Hecho con Next.js, TypeScript y ❤️ para SIAV
