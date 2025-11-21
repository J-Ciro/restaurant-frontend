# Restaurant Front End

Una interfaz ligera para la aplicación del Restaurante — frontend construido con React (Vite) y TailwindCSS. Este repositorio contiene el código cliente (JavaScript, CSS, HTML) y un Dockerfile para construir y ejecutar la aplicación en un contenedor.

## Contenido
- Acerca de
- Funcionalidades
- Stack tecnológico
- Requisitos previos
- Desarrollo local
- Compilar para producción
- Ejecutar con Docker
- Variables de entorno
- Resolución de problemas

## Acerca de
El frontend es una SPA (aplicación de una sola página) desarrollada con React, creada y servida con Vite, y estilizada con TailwindCSS. Se conecta a una API backend  y está preparada para desplegarse como archivos estáticos o dentro de un contenedor Docker.

## Funcionalidades
- Navegar el menú del restaurante
- Ver detalles de los productos
- Añadir elementos al carrito / flujo básico de pedido
- Diseño responsivo para escritorio y móvil
- Preparado para ser construido con Vite y servido en Docker

## Stack tecnológico
- React (con Vite)
- TailwindCSS
- JavaScript (principal)
- CSS, HTML
- Dockerfile para contenerización

## Requisitos previos
- Node.js (versión LTS recomendada) y npm o yarn — para desarrollo local y build.
- Docker (opcional) — para construir y ejecutar la imagen.
- Git — para clonar el repositorio.

## Desarrollo local
1. Clona el repositorio
   git clone https://github.com/J-Ciro/restaurant-frontend.git
   cd restaurant-frontend

2. Instala dependencias
   npm install
   # o
   yarn

3. Inicia el servidor de desarrollo (Vite)
   npm run dev
   # o
   yarn dev

Por defecto el servidor de desarrollo corre en el puerto 5173. Abre http://localhost:5173 en tu navegador.

## Compilar para producción
1. Genera los archivos estáticos con Vite:
   npm run build
   # o
   yarn build

2. (Opcional) Previsualizar la build localmente:
   npm run preview
   # o
   yarn preview

3. Sirve los archivos generados (por ejemplo usando un servidor estático o desde un contenedor):
   npx serve dist
   o configura tu servidor favorito (nginx, caddy, etc.) para apuntar a la carpeta `dist`.

## Ejecutar con Docker
El proyecto incluye un Dockerfile para construir y servir la aplicación. A continuación los comandos básicos:

1. Construir la imagen Docker:
   docker build -t restaurant-frontend .

2. Ejecutar el contenedor y mapear el puerto 5173:
   docker run --rm -p 5173:5173 restaurant-frontend

Notas:
- El comando anterior mapea el puerto 5173 del contenedor al puerto 5173 del host. Si se emplea otro puerto interno, ajusta el mapeo: `-p puertoHost:puertoContenedor`.
- Para ejecutar en segundo plano (detached):
   docker run -d --name restaurant-frontend -p 5173:5173 restaurant-frontend
- Para pasar variables de entorno al contenedor:
   docker run --rm -p 5173:5173 -e API_URL="https://api.ejemplo.com" restaurant-frontend

Si tu aplicación usa variables de Vite en tiempo de build, recuerda que deben tener el prefijo VITE_ (por ejemplo VITE_API_URL) y suelen inyectarse en tiempo de construcción. Para configuración en tiempo de ejecución considera un pequeño script que reemplace variables en un archivo served-config o el uso de un servidor que inyecte esas variables.

## Variables de entorno (ejemplos)
- VITE_API_URL o API_URL: URL base del backend (ajusta según tu implementación)
Documenta y emplea las variables que tu código espera.

## Resolución de problemas
- Puerto en uso: si 5173 está ocupado, mapea a otro puerto del host:
  docker run --rm -p 8080:5173 restaurant-frontend
  luego abre http://localhost:8080
- Fallos en build: verifica versiones de Node/npm, elimina node_modules y reinstala si hace falta:
  rm -rf node_modules package-lock.json && npm install
- Configuración de entorno: si la app espera variables en tiempo de build, pásalas durante `docker build` con `--build-arg` o implementa una estrategia de runtime config.

