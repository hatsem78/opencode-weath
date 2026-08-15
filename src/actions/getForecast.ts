import { getDailyForecast } from "../api/weather.ts";
import { cyan, red, yellow } from "../utils/colors.ts";
import { describeWeather, formatForecastDate, formatTemperature } from "../utils/format.ts";
import { listCities } from "../storage/citiesStorage.ts";
import { getUnit } from "../storage/settingsStorage.ts";
import { selectCity } from "../presentation/output.ts";

export async function showForecast(): Promise<void> {
  if (listCities().length === 0) {
    console.log("No hay ciudades registradas. Usa la opción 3 para agregar una.");
    return;
  }

  const selected = await selectCity("Selecciona una ciudad para el pronóstico (o vacío para cancelar): ");
  if (!selected) return;

  const unit = getUnit();
  try {
    const forecast = await getDailyForecast(selected.latitude, selected.longitude, unit);
    console.log(cyan(`📅  Pronóstico de 7 días — ${selected.name}:`));
    for (const day of forecast) {
      const weather = describeWeather(day.weatherCode);
      const label = formatForecastDate(day.time);
      console.log(
        `  ${weather.icon} ${label}: mín ${yellow(formatTemperature(day.temperatureMin, unit))} · ` +
          `máx ${yellow(formatTemperature(day.temperatureMax, unit))} — ${weather.label}`,
      );
    }
  } catch (err) {
    console.log(red(`Error al consultar el pronóstico: ${(err as Error).message}`));
  }
}
