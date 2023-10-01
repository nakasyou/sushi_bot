import type { Command } from '../../main.ts'
import initVmCode from './initVmCode.ts'

const js = (async (opts) => {

  /**
   * メッセージの行
   */
  const lines = opts.message.split("\n")
  
  /**
   * 本体Code
   */
  const bodyCode = lines.slice(1).join("\n")
  
  /**
   * 実行するコード
   */
  const code = initVmCode + "\n" + bodyCode

  const result = Bun.spawn(['deno', 'eval', '--node-modules-dir=false', 'console.log("a")'])
  console.log(await new Response(result.stdout).text())
}) satisfies Command

export default js
