# TVMaze - Prueba técnica FullStack

Aplicación web para buscar series de televisión y ver el detalle de cada una. Los datos vienen de la API pública de TVMaze (https://www.tvmaze.com/api).


Son dos proyectos separados:

- `backend/`: API en Laravel 12.
- `frontend/`: aplicación en React 19 con Vite.

## Requisitos

- PHP 8.2 o superior
- Composer
- Node.js y npm
- Conexión a internet (el backend llama a TVMaze)

## Cómo ejecutarlo en local

Hacen falta dos terminales, una para cada proyecto.

### 1. Backend

(Si se ha desplegado fuera)
```bash
cd tvmaze-proba-primeit
```

```bash
cd backend
composer install
```

Configura tu archivo .env (asegúrate de que los drivers de caché/sesión estén en file si no usas base de datos local).

```bash
php artisan serve
```

El servidor queda en http://127.0.0.1:8000. Ese puerto es el que usa el frontend.
La API estará disponible por defecto en (http://127.0.0.1:8000/api).

### 2. Frontend
(Si se ha desplegado fuera)
```bash
cd tvmaze-proba-primeit
```


```bash
cd frontend
npm install
npm run dev
```

Vite muestra la dirección, normalmente http://localhost:5173.


Los tests del backend son solo los de ejemplo que trae Laravel.

## Endpoints de la API

Todos están bajo `/api` y devuelven JSON.

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/shows/search?q=texto` | Busca series por nombre |
| GET | `/api/shows/{id}` | Detalle de una serie |
| GET | `/api/shows/{id}/cast` | Reparto de una serie |
| GET | `/api/shows/{id}/seasons` | Temporadas de una serie |

Respuesta correcta:

```json
{
  "success": true,
  "data": []
}
```

Respuesta con error:

```json
{
  "success": false,
  "error": "Mensaje del error"
}
```

Si falta el parámetro `q` en la búsqueda, devuelve un 400.

## Estructura

```
backend/
  app/Http/Controllers/TvShowController.php   recibe la petición y devuelve el JSON
  app/Services/TvMazeService.php              llama a la API de TVMaze
  routes/api.php                              rutas de la API

frontend/
  src/App.jsx                                 pantallas de búsqueda y de detalle
  src/App.css                                 estilos visuales y animaciones
  src/services/tvService.js                   llamadas al backend
  src/utils/dateUtils.js                      formato de fechas
```









## Decisiones técnicas

**Arquitectura Separada.** Se especifica que es necesario separar totalmente el Frontend y el Backend en carpetas indedpendientes. Simulando un entorno donde la API y la interfaz de usuario trabajan de forma independiente, facilitando el mantenimiento y escalabilidad. 

**Servicio aparte para TVMaze.** En `tvService.js`. Para evitar la duplicación de código y mantener los componentes limpios, toda la lógica de comunicación con la API se centralizó en un módulo de servicios dedicado.


**Trazabilidad y Depuración por consola.** Implementé logs para controlar el estado de las respuestas y peticiones en la comunicacion tanto en la parte del backend como la del frontend.

**Búsqueda.** TVMaze devuelve cada resultado dentro de un objeto con la puntuación de la búsqueda y la serie dentro de `show`. El controlador se queda solo con la serie, para que el frontend reciba una lista simple.

**Reparto y temporadas.** Además de lo que pide el enunciado, añadí dos endpoints más para mostrar el reparto y las temporadas en la pantalla de detalle.

**Frontend en un solo componente.** Toda la interfaz está en `App.jsx` y el estado es local con `useState`. Me pareció suficiente. No usamos router, así que el detalle no tiene su propia URL.




## Proceso de Desarrollo y Metodología

**1. Validación de la API Externa (Postman).**  Hice pruebas previas y validaciones directas sobre la API pública de TVMaze utilizando Postman
Esto permitió analizar el formato exacto de los objetos JSON devueltos, la estructura de las imágenes, los géneros y las valoraciones.

**2. Construcción y Depuración del Backend (Laravel)** Configuré la llamada desde local implementando controladores de gestion de excepciones y de códigos de estado HTTP, probé en local la mayoría de endpoints para asegurar que respondia de forma correcta o incorrecta, también probé codigos que fallaban para ver la respuesta. Siempre intentando seguir el modelo
MVC, pero en este caso sin persistencia de datos en una base de datos.


**3. Desarrollo del Frontend (React + Vite).** Seguí con la parte del frontend, usé Vite para gestionar un entorno de desarrollo rápido y modular, a parte de que es el que uso habitualmente. Diseñé la interfaz de usuario usando componentes de Bootstrap, generadores de código y probando a mano con el inspector de código de Chrome, especialmente para la parte gráfica. 
He usado estos recursos:
https://css-loaders.com/dots/
https://webgradients.com/
https://css.glass/


## Limitaciones

- La URL del backend (`http://127.0.0.1:8000/api`) está escrita en `frontend/src/services/tvService.js`. Si se cambia el puerto del backend, hay que cambiarla ahí.
- El detalle no tiene ruta propia, así que al recargar la página se vuelve a la búsqueda.