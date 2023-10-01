import $ from 'dax'

export const evalCode = async (code: string) => {
  const codePath = `/tmp/${crypto.randomUUID()}`

  await Deno.writeTextFile(codePath, code)  
  
  const result = await $`deno run ${codePath}`
    .captureCombined()
    .timeout(1000)
    //.noThrow()
  console.log(result.combined)
  if (result.code === 0) {
    return 
  }
}

if (import.meta.main) {
  evalCode('console.log(Deno)')
}