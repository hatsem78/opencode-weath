import type { MenuOption } from "../types/MenuOption.ts";
import { cyan } from "../utils/colors.ts";
import { WIDTH } from "../utils/constants.ts";

export function renderMenu(options: MenuOption[], title = "WEATHER CLI"): void {
  const line = cyan("═".repeat(WIDTH));
  console.log(line);
  console.log(" ".repeat((WIDTH - title.length) / 2) + cyan(title));
  console.log(line);
  for (const option of options) {
    console.log(cyan(`  ${option.value}. ${option.label}`));
  }
  console.log(line);
}
