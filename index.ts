import { formatTemperature, getTemperature, searchCity } from "./src/api.ts";
import { loadConfig, saveConfig } from "./src/config.ts";
import type { City, Config, GeocodingResult, Unit } from "./src/types.ts";

const stdinIterator = process.stdin[Symbol.asyncIterator]();
let stdinBuffer = "";
let stdinClosed = false;

async function readLine(): Promise<string> {
  while (true) {
    const newlineIndex = stdinBuffer.indexOf("\n");
    if (newlineIndex !== -1) {
      const line = stdinBuffer.slice(0, newlineIndex);
      stdinBuffer = stdinBuffer.slice(newlineIndex + 1);
      return line.replace(/\r$/, "").trim();
    }
    if (stdinClosed) {
      return stdinBuffer.trim();
    }
    const next = await stdinIterator.next();
    if (next.done) {
      stdinClosed = true;
      const line = stdinBuffer;
      stdinBuffer = "";
      return line.trim();
    }
    stdinBuffer += new TextDecoder().decode(next.value as Uint8Array);
  }
}

async function promptInput(question: string): Promise<string> {
  process.stdout.write(question);
  return readLine();
}

const WIDTH = 40;

function renderMenu(unit: Unit, cityCount: number): void {
  const unitLabel = unit === "celsius" ? "°C" : "°F";
  const line = "═".repeat(WIDTH);
  console.log(line);
  console.log(" ".repeat((WIDTH - "WEATHER CLI".length) / 2) + "WEATHER CLI");
  console.log(line);
  console.log("  1. Clima de ciudad default");
  console.log(`  2. Clima de todas las ciudades (${cityCount})`);
  console.log("  3. Buscar y agregar ciudad");
  console.log("  4. Eliminar ciudad");
  console.log("  5. Establecer ciudad default");
  console.log(`  8. Ajustes (${unitLabel})`);
  console.log("  9. Salir");
  console.log(line);
}

async function waitForEnter(): Promise<void> {
  await promptInput("Presiona Enter para continuar...");
}

async function handleDefaultCity(config: Config): Promise<void> {
  if (!config.defaultCity) {
    console.log("No hay ciudad default configurada. Usa la opción 5 para establecerla.");
    return;
  }

  const city = config.cities.find((c) => c.name === config.defaultCity);
  if (!city) {
    console.log("La ciudad default ya no está en tu lista. Usa la opción 5 para elegir otra.");
    return;
  }

  try {
    const temp = await getTemperature(city.latitude, city.longitude, config.unit);
    console.log(`🌤️  ${city.name}: ${formatTemperature(temp, config.unit)}`);
  } catch (err) {
    console.log(`Error al consultar el clima: ${(err as Error).message}`);
  }
}

async function handleAllCities(config: Config): Promise<void> {
  if (config.cities.length === 0) {
    console.log("No hay ciudades registradas. Usa la opción 3 para agregar una.");
    return;
  }

  for (const city of config.cities) {
    try {
      const temp = await getTemperature(city.latitude, city.longitude, config.unit);
      const marker = city.name === config.defaultCity ? " ★" : "";
      console.log(`🌤️  ${city.name}${marker}: ${formatTemperature(temp, config.unit)}`);
    } catch (err) {
      console.log(`⚠️  ${city.name}: error al consultar (${(err as Error).message})`);
    }
  }
}

function cityLabel(city: City): string {
  const parts = [city.country, city.region].filter(Boolean);
  return parts.length > 0 ? `${city.name} (${parts.join(", ")})` : city.name;
}

function resultLabel(result: GeocodingResult): string {
  const parts = [result.country, result.admin1].filter(Boolean);
  return parts.length > 0 ? `${result.name} (${parts.join(", ")})` : result.name;
}

async function handleAddCity(config: Config): Promise<void> {
  const query = await promptInput("Nombre de la ciudad: ");
  if (!query) {
    console.log("Búsqueda cancelada.");
    return;
  }

  let results: GeocodingResult[];
  try {
    results = await searchCity(query);
  } catch (err) {
    console.log(`Error en la búsqueda: ${(err as Error).message}`);
    return;
  }

  if (results.length === 0) {
    console.log("No se encontraron ciudades con ese nombre.");
    return;
  }

  console.log("Resultados:");
  results.forEach((r, i) => console.log(`  ${i + 1}. ${resultLabel(r)}`));

  const choice = await promptInput("Selecciona una ciudad (o vacío para cancelar): ");
  if (!choice) {
    console.log("Operación cancelada.");
    return;
  }

  const idx = parseInt(choice, 10) - 1;
  const selected = results[idx];
  if (!selected) {
    console.log("Selección inválida.");
    return;
  }

  const city: City = {
    name: selected.name,
    country: selected.country,
    region: selected.admin1,
    latitude: selected.latitude,
    longitude: selected.longitude,
  };

  if (config.cities.some((c) => c.name === city.name && c.latitude === city.latitude && c.longitude === city.longitude)) {
    console.log(`La ciudad "${city.name}" ya está en tu lista.`);
    return;
  }

  config.cities.push(city);
  saveConfig(config);
  console.log(`Ciudad "${city.name}" agregada.`);
}

async function handleDeleteCity(config: Config): Promise<void> {
  if (config.cities.length === 0) {
    console.log("No hay ciudades registradas.");
    return;
  }

  console.log("Tus ciudades:");
  config.cities.forEach((c, i) => console.log(`  ${i + 1}. ${cityLabel(c)}`));

  const choice = await promptInput("Selecciona una ciudad para eliminar (o vacío para cancelar): ");
  if (!choice) {
    console.log("Operación cancelada.");
    return;
  }

  const idx = parseInt(choice, 10) - 1;
  const selected = config.cities[idx];
  if (!selected) {
    console.log("Selección inválida.");
    return;
  }

  config.cities.splice(idx, 1);
  if (config.defaultCity === selected.name) {
    config.defaultCity = config.cities[0]?.name ?? null;
  }
  saveConfig(config);
  console.log(`Ciudad "${selected.name}" eliminada.`);
}

async function handleSetDefault(config: Config): Promise<void> {
  if (config.cities.length === 0) {
    console.log("No hay ciudades registradas. Usa la opción 3 para agregar una.");
    return;
  }

  console.log("Tus ciudades:");
  config.cities.forEach((c, i) => console.log(`  ${i + 1}. ${cityLabel(c)}`));

  const choice = await promptInput("Selecciona la ciudad default (o vacío para cancelar): ");
  if (!choice) {
    console.log("Operación cancelada.");
    return;
  }

  const idx = parseInt(choice, 10) - 1;
  const selected = config.cities[idx];
  if (!selected) {
    console.log("Selección inválida.");
    return;
  }

  config.defaultCity = selected.name;
  saveConfig(config);
  console.log(`Ciudad default establecida: ${selected.name}`);
}

async function handleSettings(config: Config): Promise<void> {
  config.unit = config.unit === "celsius" ? "fahrenheit" : "celsius";
  saveConfig(config);
  const label = config.unit === "celsius" ? "°C" : "°F";
  console.log(`Unidad de temperatura cambiada a ${label}.`);
}

async function main(): Promise<void> {
  const config = loadConfig();

  while (true) {
    renderMenu(config.unit, config.cities.length);
    const option = await promptInput("  Selecciona una opción: ");

    switch (option) {
      case "1":
        await handleDefaultCity(config);
        break;
      case "2":
        await handleAllCities(config);
        break;
      case "3":
        await handleAddCity(config);
        break;
      case "4":
        await handleDeleteCity(config);
        break;
      case "5":
        await handleSetDefault(config);
        break;
      case "8":
        await handleSettings(config);
        break;
      case "9":
        console.log("¡Hasta luego!");
        return;
      default:
        console.log("Opción inválida.");
    }

    if (option !== "9") {
      await waitForEnter();
    }
  }
}

main();
