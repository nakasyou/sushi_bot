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

  const result = $`echo ${code} | deno run -`.stdout("piped")
    .stderr("piped");
  
  const stdoutText = result.stdout //await new Response(process.stdout).text()
  const stderrText = result.stderr //await new Response(process.stderr).text()
  if (result.code === 0) {
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
