import { listCities, setDefaultCity } from "../storage/citiesStorage.ts";
import { green } from "../utils/colors.ts";
import { selectCity } from "../presentation/output.ts";

export async function showSetDefaultCity(): Promise<void> {
  if (listCities().length === 0) {
    console.log("No hay ciudades registradas. Usa la opción 3 para agregar una.");
    return;
  }

  const selected = await selectCity("Selecciona la ciudad default (o vacío para cancelar): ");
  if (!selected) return;

  setDefaultCity(selected.name);
  console.log(green(`Ciudad default establecida: ${selected.name}`));
}
