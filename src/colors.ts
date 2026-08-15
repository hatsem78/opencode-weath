const enabled = !!process.stdout.isTTY && !("NO_COLOR" in process.env);

const RESET = "\x1b[0m";

function wrap(code: string, text: string): string {
  return enabled ? `${code}${text}${RESET}` : text;
}

export const cyan = (text: string): string => wrap("\x1b[36m", text);
export const yellow = (text: string): string => wrap("\x1b[33m", text);
export const green = (text: string): string => wrap("\x1b[32m", text);
export const red = (text: string): string => wrap("\x1b[31m", text);
