
export declare global {
  const Deno = {
    writeTextFile: (path: string, data: string) => Promise<void>
  }
}
export declare module 'https://deno.land/std@0.203.0/dotenv/mod.ts' {
  load: () => Record<string, string>
}