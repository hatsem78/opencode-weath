const stdinIterator = process.stdin[Symbol.asyncIterator]();
let stdinBuffer = "";
let stdinClosed = false;

export async function readLine(): Promise<string> {
  while (true) {
    const newlineIndex = stdinBuffer.indexOf("\n");
    if (newlineIndex !== -1) {
      const line = stdinBuffer.slice(0, newlineIndex);
      stdinBuffer = stdinBuffer.slice(newlineIndex + 1);
      return line.replace(/\r$/, "").trim();
    }
    if (stdinClosed) {
      return stdinBuffer.trim();
    }
    const next = await stdinIterator.next();
    if (next.done) {
      stdinClosed = true;
      const line = stdinBuffer;
      stdinBuffer = "";
      return line.trim();
    }
    stdinBuffer += new TextDecoder().decode(next.value as Uint8Array);
  }
}

export async function promptInput(question: string): Promise<string> {
  process.stdout.write(question);
  return readLine();
}

export async function waitForEnter(): Promise<void> {
  await promptInput("Presiona Enter para continuar...");
}
