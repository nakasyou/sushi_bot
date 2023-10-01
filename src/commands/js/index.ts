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

  const evalCommand = new Deno.Command('deno', {
    args: ['eval', code],
    stdout: 'piped',
  })
  const process = evalCommand.spawn()
  
  const status = await process.status

    console.log(process.stdout)
  const resultText = await new Response(process.stdout).text()

  if (status.success) {

    opts.reply(`コードの実行に成功しました!
Result:
\`\`\`js
${resultText}
\`\`\``)
  }
}) satisfies Command

export default js
