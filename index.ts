import { showAddCity } from "./src/actions/addCity.ts";
import { showForecast } from "./src/actions/getForecast.ts";
import { showAllCitiesWeather, showDefaultCityWeather } from "./src/actions/getWeather.ts";
import { showRemoveCity } from "./src/actions/removeCity.ts";
import { showSetDefaultCity } from "./src/actions/setDefaultCity.ts";
import { toggleUnit } from "./src/actions/settings.ts";
import { promptInput, waitForEnter } from "./src/presentation/input.ts";
import { renderMenu } from "./src/presentation/menu.ts";
import { printError, printSuccess } from "./src/presentation/output.ts";
import { listCities } from "./src/storage/citiesStorage.ts";
import { getUnit } from "./src/storage/settingsStorage.ts";
import type { MenuOption } from "./src/types/MenuOption.ts";

function buildMenuOptions(): MenuOption[] {
  const unit = getUnit();
  const unitLabel = unit === "celsius" ? "°C" : "°F";
  const cityCount = listCities().length;

  return [
    { value: "1", label: "Clima de ciudad default", handler: showDefaultCityWeather },
    { value: "2", label: `Clima de todas las ciudades (${cityCount})`, handler: showAllCitiesWeather },
    { value: "3", label: "Buscar y agregar ciudad", handler: showAddCity },
    { value: "4", label: "Eliminar ciudad", handler: showRemoveCity },
    { value: "5", label: "Establecer ciudad default", handler: showSetDefaultCity },
    { value: "6", label: "Pronóstico 7 días", handler: showForecast },
    { value: "8", label: `Ajustes (${unitLabel})`, handler: toggleUnit },
    { value: "9", label: "Salir", handler: async () => {} },
  ];
}

async function main(): Promise<void> {
  while (true) {
    const options = buildMenuOptions();
    renderMenu(options);
    const option = await promptInput("  Selecciona una opción: ");

    const selected = options.find((o) => o.value === option);
    if (selected?.value === "9") {
      printSuccess("¡Hasta luego!");
      return;
    }
    if (selected) {
      await selected.handler();
    } else {
      printError("Opción inválida.");
    }

    await waitForEnter();
  }
}

main();
