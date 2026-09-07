# Pokedex App

Aplicación web tipo Pokédex desarrollada en equipo con Express + TypeScript para el backend, React para el frontend y PokéAPI como fuente de datos. Se ejecutará localmente o en red privada.

## Objetivo

La aplicación permitirá buscar Pokémon y visualizar su identificador, nombre, imagen y tipos. El backend consumirá PokéAPI y devolverá únicamente datos reformados, no la respuesta completa de la API externa.

## Endpoints principales

### Buscar un Pokémon

```http
GET /api/pokemon/:nombre
```

Ejemplo: `GET /api/pokemon/pikachu`

Respuesta esperada:

```json
{
  "id": 25,
  "nombre": "pikachu",
  "imagen": "https://...",
  "tipos": ["electric"]
}
```

Si el Pokémon no existe, el servidor debe responder con código `404`:

```json
{
  "error": "No lo encontré"
}
```

### Listar Pokémon

```http
GET /api/pokemon?limit=20
```

Devuelve una lista de nombres de Pokémon. El parámetro `limit` controla la cantidad de resultados.

### Verificar estado del servidor

```http
GET /api/health
```

Sirve para comprobar que el backend está funcionando.

## Integrantes y responsabilidades

### Richi — Backend: endpoint principal

1. Crear la estructura base del proyecto con Express y TypeScript.
2. Configurar `tsconfig.json`.
3. Configurar scripts básicos como `npm run dev` y `npm run check`.
4. Implementar `GET /api/pokemon/:nombre`.
5. Crear interfaces o tipos para los datos recibidos desde PokéAPI.
6. Reformar la respuesta para devolver únicamente `id`, `nombre`, `imagen` y `tipos`.
7. Validar nombres vacíos o inválidos.
8. Manejar Pokémon inexistentes con respuesta `404`.
9. Manejar errores de conexión con PokéAPI.
10. Documentar pruebas manuales realizadas en el README.

Rama sugerida: `feature/backend-pokemon-detail`

### Martin Sierra — Backend: endpoints complementarios y errores

1. Implementar `GET /api/pokemon?limit=20`.
2. Validar el parámetro `limit`.
3. Establecer un límite máximo permitido para evitar solicitudes excesivas.
4. Crear rutas y controladores separados del endpoint principal.
5. Implementar un middleware global de manejo de errores.
6. Configurar CORS para permitir el consumo desde el frontend local o en red privada.
7. Implementar `GET /api/health`.
8. Documentar endpoints, códigos HTTP y ejemplos de respuestas JSON.

Rama sugerida: `feature/backend-pokemon-list`

### Javier Gregorio — Frontend: búsqueda y ficha de Pokémon

1. Crear el proyecto React y su estructura inicial de carpetas.
2. Diseñar el layout principal de la Pokédex.
3. Crear un campo de búsqueda con validación básica.
4. Conectar el buscador con `GET /api/pokemon/:nombre`.
5. Crear el componente `PokemonCard`.
6. Mostrar imagen, ID, nombre y tipos del Pokémon.
7. Mostrar un indicador de carga mientras se consulta la API.
8. Mostrar un mensaje claro cuando el Pokémon no exista.
9. Mostrar un mensaje cuando exista un error de conexión.

Rama sugerida: `feature/frontend-search-card`

### Luis Samayoa — Frontend: catálogo y diseño visual

1. Consumir `GET /api/pokemon?limit=20`.
2. Crear una cuadrícula o lista de Pokémon.
3. Permitir seleccionar un Pokémon del listado.
4. Al seleccionar un Pokémon, cargar su información detallada.
5. Crear estilos visuales para los tipos Pokémon.
6. Adaptar el diseño a pantallas de celular y escritorio.
7. Crear un estado vacío cuando no existan resultados.
8. Añadir un botón o mecanismo para recargar la lista.
9. Revisar accesibilidad básica: etiquetas, contraste, navegación con teclado y textos alternativos para imágenes.

Rama sugerida: `feature/frontend-catalog-ui`

### Esdras — Backend complementario, integración y administración Git

1. Crear y configurar el repositorio.
2. Crear `.gitignore`.
3. Crear y mantener el README.
4. Definir las reglas de ramas y Pull Requests.
5. Definir el contrato compartido entre backend y frontend.
6. Configurar variables de entorno y URLs para conectar React con Express.
7. Integrar frontend y backend.
8. Resolver problemas de CORS o configuración.
9. Revisar Pull Requests antes de integrarlos.
10. Resolver conflictos de Git cuando sea necesario.
11. Integrar cambios aprobados a la rama `develop`.
12. Implementar correcciones necesarias durante las pruebas.
13. Realizar pruebas finales de búsqueda, listado, errores y diseño responsive.
14. Completar la matriz de decisión de Express y la documentación final.

Rama sugerida: `feature/integration-config`

## Reglas de Git

```text
main     → versión final y estable del proyecto
develop  → rama donde se integran los cambios aprobados
```

**Está prohibido hacer `push` directo a `main` o a `develop`.**

Todo cambio debe realizarse en una rama propia y enviarse mediante un Pull Request:

```text
feature/... → Pull Request → develop → Pull Request final → main
```

## Guía básica para subir cambios

### 1. Descargar cambios recientes

Antes de comenzar a trabajar:

```bash
git checkout develop
git pull origin develop
```

### 2. Crear una rama para la tarea

Cada integrante debe crear una rama desde `develop`.

```bash
git checkout -b feature/nombre-de-la-tarea
```

Ejemplo:

```bash
git checkout -b feature/backend-pokemon-detail
```

### 3. Verificar cambios realizados

```bash
git status
```

### 4. Agregar archivos modificados

```bash
git add .
```

### 5. Crear un commit

El mensaje debe describir claramente el cambio realizado.

```bash
git commit -m "feat: agrega búsqueda de pokemon por nombre"
```

Otros ejemplos:

```bash
git commit -m "feat: agrega listado de pokemon"
git commit -m "fix: maneja error 404 de pokemon inexistente"
git commit -m "style: mejora diseño responsive del catalogo"
```

### 6. Subir la rama al repositorio

```bash
git push origin feature/nombre-de-la-tarea
```

Ejemplo:

```bash
git push origin feature/frontend-search-card
```

### 7. Crear Pull Request

En GitHub:

1. Abrir el repositorio.
2. Crear un Pull Request.
3. Elegir `develop` como rama destino.
4. Explicar brevemente qué se realizó.
5. Esperar revisión antes de hacer merge.

### 8. Después de que el Pull Request sea aprobado

No hacer merge por cuenta propia, salvo que Esdras lo indique. Después de que los cambios hayan sido integrados, actualizar la rama local:

```bash
git checkout develop
git pull origin develop
```

## Checklist antes de enviar un Pull Request

- [ ] Mi funcionalidad funciona localmente.
- [ ] No subí archivos innecesarios como `node_modules`.
- [ ] Mi código corresponde únicamente a mi tarea.
- [ ] Probé los casos principales y los errores básicos.
- [ ] Mi commit tiene un mensaje claro.
- [ ] Mi Pull Request apunta a `develop`, nunca directamente a `main`.
- [ ] No hice push directo a `develop` ni a `main`.

## Base mínima funcional del frontend

Se preparó únicamente la infraestructura técnica para consumir el backend. No incluye buscador, tarjeta de Pokémon, catálogo, estilos de Pokédex ni diseño responsive; esas funcionalidades permanecen asignadas al equipo frontend.

```text
src/
├─ config/
│  └─ api.ts                 # Define la URL base del backend
├─ services/
│  └─ pokemon-api.ts         # Cliente tipado para consumir la API
├─ App.tsx                   # Comprobación mínima de conexión al backend
└─ main.tsx                  # Punto de entrada de React
```

También se incluyen `package.json`, archivos de TypeScript, `vite.config.ts`, `.gitignore` y `.env.example`.

### Cliente API disponible

El archivo `src/services/pokemon-api.ts` ya expone estas funciones para que los desarrolladores las usen en sus componentes:

- `checkBackendHealth()` para comprobar `GET /api/health`.
- `getPokemonByName(nombre)` para consultar `GET /api/pokemon/:nombre`.
- `getPokemonList(limit)` para consultar `GET /api/pokemon?limit=20`.

### Configuración local

1. Copiar `.env.example` y renombrarlo a `.env`.
2. Mantener o ajustar la URL del backend:

```env
VITE_API_URL=http://localhost:3000/api
```

Si se utiliza una red privada, reemplazar `localhost` por la dirección IP del equipo que ejecuta el backend.

### Instalación y ejecución

Desde la carpeta del frontend:

```bash
npm install
npm run dev
```

Vite mostrará una URL local, normalmente `http://localhost:5173`.

Antes de abrir el frontend, iniciar el backend con `npm run dev` en su repositorio. La pantalla inicial solo informa si la conexión con `GET /api/health` fue exitosa.
