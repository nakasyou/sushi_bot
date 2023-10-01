export declare global {
  const Deno = {
    writeTextFile: (path: string, data: string) => Promise<void>
  }
}
