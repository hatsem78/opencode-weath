## Weather CLI APP

El objetivo de esta aplicación es que creemos una aplicación de consola que pida que ingresemos la ciudad, Al final, generaremos un binario ejecutable.

### Opciones:

- Ingresar el nombre de una ciudad.
- Guardar la ciudad por defecto.
- Registrar varias otras ciudades para buscar el clima en esas otras ciudades.

## Stack

- Bun.js
- OpenMeteo

## Ejemplo de petición http:

1. Paso 1: Geocoding API.
2. Paso 2: OpenMeteo API.

```
https://geocoding-api.open-meteo.com/v1/search?name=Ottawa&count=1&language=es&format=json
https://api.open-meteo.com/v1/forecast?latitude=45.41117&longitude=-75.69812&current=temperature_2m
```

## Inicializar proyecto

```bash
bun init
```

### Ejemplo del menú
Esta es la apariencia que deseamos crear

```bash
════════════════════════════════════════
         WEATHER CLI
════════════════════════════════════════
  1. Clima de ciudad default
  2. Clima de todas las ciudades (1)
  3. Buscar y agregar ciudad
  4. Eliminar ciudad
  5. Establecer ciudad default
  6. Pronóstico 7 días
  8. Ajustes (°C)
  9. Salir
════════════════════════════════════════
  Selecciona una opción: 5
```
Prompt para crear un GitHub action.

Necetito  que creemos un Github Action, el cual tiene que crear un release tag de la ultima versión basada en el package.json. Dentro de ese Releese Tag. Reuerda que mediante el Bun run Build es como construye el binario.

---

## Screaming Architecture

- **Screaming Architecture** (o arquitectura que grita) es un principio de diseño de software que establece que la estructura de un proyecto debe reflejar claramente el negocio o la función de la aplicación, en lugar de mostrar las herramientas o tecnologías utilizadas.

### Qué problema resuelve

- **Estructura técnica tradicional:** Organizar carpetas por tipos de archivos como controllers, models o views. Esto muestra cómo está construido el sistema, pero no qué hace.

- **Falta de contexto rápido**: Obliga a leer el código interno para entender el propósito real de la aplicación.

## Estructura deseada

```bash
src/
├── actions/                # Acciones principales que puede ejecutar el usuario
│   ├── getWeather.ts       # Obtener clima actual de una ciudad
│   ├── addCity.ts          # Agregar una ciudad a la lista
│   ├── removeCity.ts       # Eliminar una ciudad
│   ├── setDefaultCity.ts   # Establecer la ciudad por defecto
│   ├── listCities.ts       # Listar todas las ciudades guardadas
│   └── ...                 # Otras acciones futuras
├── presentation/           # Todo lo relacionado con la interacción de consola/CLI
│   ├── menu.ts             # Renderizado del menú y manejo de selección de opciones
│   ├── output.ts           # Funciones para mostrar mensajes al usuario
│   ├── input.ts            # Funciones para capturar y validar inputs del usuario
│   └── ...                 # Otros componentes de presentación
├── storage/                # Capa para leer, escribir y gestionar datos locales
│   ├── citiesStorage.ts    # Persistencia de ciudades guardadas
│   ├── settingsStorage.ts  # Persistencia de configuración y preferencias
│   └── ...                 # Otros mecanismos de almacenamiento
├── types/                  # Tipos y contratos TypeScript usados globalmente
│   ├── City.ts             # Definición de tipo City
│   ├── Weather.ts          # Tipos para la respuesta del clima
│   ├── MenuOption.ts       # Tipo para las opciones del menú
│   └── ...                 # Otros tipos globales
├── api/                    # Integración con APIs externas (OpenMeteo, geocoding)
│   ├── geocoding.ts        # Lógica para obtener coordenadas de una ciudad
│   ├── weather.ts          # Lógica para obtener el clima actual y pronóstico
│   └── ...                 # Otros endpoints o utilidades API
├── utils/                  # Utilidades y helpers reutilizables
│   ├── format.ts           # Formateadores de datos (fechas, temperaturas, etc)
│   ├── constants.ts        # Constantes generales de la app
│   ├── colors.ts           # Definición y utilidades de colores para la consola
│   └── ...                 # Otros utilitarios
├── index.ts     
```

---


### Cómo funcionaEnfoque en el dominio: 

- **Enfoque en el dominio:**  Las carpetas y archivos se nombran según los casos de uso y las reglas del negocio (por ejemplo: usuarios, pedidos, facturacion).

- **Independencia de frameworks:** Las librerías o bases de datos pasan a un segundo plano y no definen la organización principal del código.
