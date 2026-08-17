const RESET = "\x1b[0m";

function isEnabled(): boolean {
  if (process.env.NO_COLOR !== undefined) return false;
  if (process.env.FORCE_COLOR !== undefined) return process.env.FORCE_COLOR !== "0";
  return !!process.stdout.isTTY;
}

function wrap(code: string, text: string): string {
  return isEnabled() ? `${code}${text}${RESET}` : text;
}

export const cyan = (text: string): string => wrap("\x1b[36m", text);
export const yellow = (text: string): string => wrap("\x1b[33m", text);
export const green = (text: string): string => wrap("\x1b[32m", text);
export const red = (text: string): string => wrap("\x1b[31m", text);
