import { listCities, removeCity } from "../storage/citiesStorage.ts";
import { green } from "../utils/colors.ts";
import { selectCity } from "../presentation/output.ts";

export async function showRemoveCity(): Promise<void> {
  if (listCities().length === 0) {
    console.log("No hay ciudades registradas.");
    return;
  }

  const selected = await selectCity("Selecciona una ciudad para eliminar (o vacío para cancelar): ");
  if (!selected) return;

  removeCity(selected.name);
  console.log(green(`Ciudad "${selected.name}" eliminada.`));
}
