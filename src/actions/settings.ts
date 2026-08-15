import { getUnit, setUnit } from "../storage/settingsStorage.ts";
import { green } from "../utils/colors.ts";

export function toggleUnit(): void {
  const unit = getUnit() === "celsius" ? "fahrenheit" : "celsius";
  setUnit(unit);
  const label = unit === "celsius" ? "°C" : "°F";
  console.log(green(`Unidad de temperatura cambiada a ${label}.`));
}
