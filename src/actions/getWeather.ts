import { getTemperature } from "../api/weather.ts";
import { red, yellow } from "../utils/colors.ts";
import { formatTemperature } from "../utils/format.ts";
import { getDefaultCity, listCities } from "../storage/citiesStorage.ts";
import { getUnit } from "../storage/settingsStorage.ts";

export async function showDefaultCityWeather(): Promise<void> {
  const defaultCity = getDefaultCity();
  if (!defaultCity) {
    console.log("No hay ciudad default configurada. Usa la opción 5 para establecerla.");
    return;
  }

  const unit = getUnit();
  try {
    const temp = await getTemperature(defaultCity.latitude, defaultCity.longitude, unit);
    console.log(`🌤️  ${defaultCity.name}: ${yellow(formatTemperature(temp, unit))}`);
  } catch (err) {
    console.log(red(`Error al consultar el clima: ${(err as Error).message}`));
  }
}

export async function showAllCitiesWeather(): Promise<void> {
  const cities = listCities();
  if (cities.length === 0) {
    console.log("No hay ciudades registradas. Usa la opción 3 para agregar una.");
    return;
  }

  const unit = getUnit();
  const defaultCity = getDefaultCity();
  for (const city of cities) {
    try {
      const temp = await getTemperature(city.latitude, city.longitude, unit);
      const marker = city.name === defaultCity?.name ? " ★" : "";
      console.log(`🌤️  ${city.name}${marker}: ${yellow(formatTemperature(temp, unit))}`);
    } catch (err) {
      console.log(red(`⚠️  ${city.name}: error al consultar (${(err as Error).message})`));
    }
  }
}
