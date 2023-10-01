import type { Command } from '../../main.ts'
import initVmCode from './initVmCode.ts'

import $ from 'dax'

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
  const code = (initVmCode + "\n" + bodyCode).replaceAll("'", "\\'")

  const path = `/tmp/${crypto.randomUUID()}.ts`
  await Deno.writeTextFile(path, code)

  const evalCommand = new Deno.Command('deno', {
    args: ['run', path],
    stdout: 'piped',
    stderr: 'piped',
  })
  const process = evalCommand.spawn()
  
  const status = await process.status
  
  const stdoutText = await new Response(process.stdout).text()
  const stderrText = await new Response(process.stderr).text()
  
  if (status.code === 0) {
    opts.reply(`
      コードの実行に成功しました!
      
      Result:
      \`\`\`js
      ${stdoutText}
      \`\`\`
    `.slice(1, -1).split('\n').map(line => line.slice(6)).join('\n'))
  } else {
    // エラー
    opts.reply(`
      コードの実行に失敗しました...
      Error:
      \`\`\`
      ${stderrText}
      \`\`\`
    `.slice(1, -1).split('\n').map(line => line.slice(6)).join('\n'))
  }
}) satisfies Command

export default js
