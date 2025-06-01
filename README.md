# Community Pulse App

Aplicación web construida con Next.js, TypeScript, Tailwind CSS y Firebase Firestore para el almacenamiento de datos. Incluye integración con Google Maps y autenticación Firebase.

## Requisitos previos

- Node.js 18.x o superior
- npm 9.x o superior
- Cuenta de Firebase y proyecto configurado
- Clave de API de Google Maps

## Pasos para instalar y ejecutar el proyecto

1. **Clonar el repositorio:**

```bash
git clone https://github.com/jlescanog/app_comunidad.git
cd app_comunidad
```

2. **Instalar dependencias:**

```bash
npm install
```

3. **Configurar variables de entorno:**

Crea un archivo `.env` en la raíz del proyecto con la siguiente estructura (reemplaza los valores por los de tu proyecto Firebase y tu clave de Google Maps):

```env
NEXT_PUBLIC_FIREBASE_API_KEY=TU_API_KEY
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=TU_AUTH_DOMAIN
NEXT_PUBLIC_FIREBASE_PROJECT_ID=TU_PROJECT_ID
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=TU_STORAGE_BUCKET
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=TU_MESSAGING_SENDER_ID
NEXT_PUBLIC_FIREBASE_APP_ID=TU_APP_ID
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=TU_GOOGLE_MAPS_API_KEY
```

4. **Ejecutar la aplicación en desarrollo:**

```bash
npm run dev
```

La aplicación estará disponible en [http://localhost:9002](http://localhost:9002)

## Notas importantes

- Los datos se almacenan en **Firebase Firestore**.
- Si el proyecto está en una unidad externa y ves advertencias de rendimiento, considera moverlo a una carpeta local.
- Si tienes problemas con el puerto 9002, asegúrate de que no esté siendo usado por otro proceso.

## Scripts útiles

- `npm run dev`: Ejecuta el servidor de desarrollo en el puerto 9002
- `npm run build`: Construye la aplicación para producción
- `npm run start`: Inicia la aplicación en modo producción
- `npm run lint`: Ejecuta el linter
- `npm run typecheck`: Verifica los tipos de TypeScript

## Contribuciones

¡Las contribuciones son bienvenidas! Por favor, abre un issue o un pull request para sugerencias y mejoras.

## Licencia

MIT
