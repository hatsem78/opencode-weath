import { listCities } from "../storage/citiesStorage.ts";
import { cityLabel } from "../utils/format.ts";
import { printLine } from "../presentation/output.ts";

export function showCities(): void {
  const cities = listCities();
  if (cities.length === 0) {
    printLine("No hay ciudades registradas.");
    return;
  }
  cities.forEach((c, i) => console.log(`  ${i + 1}. ${cityLabel(c)}`));
}
