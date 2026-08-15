import type { City } from "../types/City.ts";
import { cityLabel } from "../utils/format.ts";
import { green, red } from "../utils/colors.ts";
import { listCities } from "../storage/citiesStorage.ts";
import { promptInput } from "./input.ts";

export function printLine(text = ""): void {
  console.log(text);
}

export function printSuccess(text: string): void {
  console.log(green(text));
}

export function printError(text: string): void {
  console.log(red(text));
}

export async function selectCity(prompt: string): Promise<City | null> {
  const cities = listCities();
  if (cities.length === 0) return null;

  printLine("Tus ciudades:");
  cities.forEach((c, i) => console.log(`  ${i + 1}. ${cityLabel(c)}`));

  const choice = await promptInput(prompt);
  if (!choice) {
    printLine("Operación cancelada.");
    return null;
  }

  const idx = parseInt(choice, 10) - 1;
  const selected = cities[idx];
  if (!selected) {
    printError("Selección inválida.");
    return null;
  }
  return selected;
}
