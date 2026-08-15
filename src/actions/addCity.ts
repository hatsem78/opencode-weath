import { searchCity } from "../api/geocoding.ts";
import { addCity } from "../storage/citiesStorage.ts";
import { green, red } from "../utils/colors.ts";
import { resultLabel } from "../utils/format.ts";
import type { City } from "../types/City.ts";
import { promptInput } from "../presentation/input.ts";

export async function showAddCity(): Promise<void> {
  const query = await promptInput("Nombre de la ciudad: ");
  if (!query) {
    console.log("Búsqueda cancelada.");
    return;
  }

  let results;
  try {
    results = await searchCity(query);
  } catch (err) {
    console.log(red(`Error en la búsqueda: ${(err as Error).message}`));
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
    console.log(red("Selección inválida."));
    return;
  }

  const city: City = {
    name: selected.name,
    country: selected.country,
    region: selected.admin1,
    latitude: selected.latitude,
    longitude: selected.longitude,
  };

  if (!addCity(city)) {
    console.log(red(`La ciudad "${city.name}" ya está en tu lista.`));
    return;
  }
  console.log(green(`Ciudad "${city.name}" agregada.`));
}
