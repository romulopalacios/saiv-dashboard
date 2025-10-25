/**
 * Configuración de Firebase (Opcional)
 * Solo necesario si quieres leer directamente desde Firebase en el frontend
 * Si tu backend ya maneja Firebase, NO necesitas esto
 */

// Descomenta esto si quieres usar Firebase directamente
/*
import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getDatabase, ref, onValue, query, orderByChild, limitToLast } from 'firebase/database';

// Configuración de Firebase - obtén estos valores de tu consola de Firebase
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
};

// Inicializar Firebase
let app: FirebaseApp;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApps()[0];
}

const database = getDatabase(app);

// Función para escuchar eventos en tiempo real
export function escucharEventosEnTiempoReal(
  callback: (eventos: any[]) => void,
  limit: number = 100
) {
  const eventosRef = ref(database, 'eventos'); // Ajusta la ruta según tu estructura
  const eventosQuery = query(
    eventosRef,
    orderByChild('timestamp'),
    limitToLast(limit)
  );

  const unsubscribe = onValue(eventosQuery, (snapshot) => {
    const data = snapshot.val();
    if (data) {
      const eventos = Object.entries(data).map(([key, value]: [string, any]) => ({
        id: key,
        ...value,
      }));
      callback(eventos);
    } else {
      callback([]);
    }
  });

  return unsubscribe;
}

export { database };
*/

// Por defecto, exportamos null para que no cause errores
export const database = null;
export const escucharEventosEnTiempoReal = null;

// Instrucciones de uso:
// 1. Instala Firebase: npm install firebase
// 2. Configura las variables de entorno en .env.local
// 3. Descomenta el código de arriba
// 4. Importa y usa en tus componentes:
//
// import { escucharEventosEnTiempoReal } from '@/lib/firebase';
//
// useEffect(() => {
//   const unsubscribe = escucharEventosEnTiempoReal((eventos) => {
//     setEventos(eventos);
//   }, 100);
//
//   return () => unsubscribe?.();
// }, []);
