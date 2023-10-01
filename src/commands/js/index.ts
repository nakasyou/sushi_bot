import type { Command } from '../../main.ts'
import initVmCode from './initVmCode.ts'

import $, { CommandResult } from 'dax'
import { tablate } from "../../utils/tablate.ts"

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
  const code = (initVmCode + "\n" + bodyCode).replace("'", "\\'")

  const codePath = `/tmp/${crypto.randomUUID()}.ts`

  await Deno.writeTextFile(codePath, code)

  const result: CommandResult = await $`deno run ${codePath}`
    .captureCombined()
    .timeout(1000)
    .noThrow()
  const maxResultLength = 10000
  const noEscapeResultText = result.combined.replace(/\u001b\[.{2,3}/g, '')
  const resultText = noEscapeResultText.slice(-maxResultLength)
  if (result.code === 0) {
    opts.reply(tablate(6)`
      コードの実行に成功しました!
      
      Result:
      \`\`\`js
      ${resultText}
      \`\`\`
      ${noEscapeResultText.length > maxResultLength ? '長すぎるため、最初の方は切り捨てられています' : ''}
    `.slice(1, -1))
  } else if (result.code === 124) {
    // タイムアウト
    opts.reply(tablate(6)`
      1000ms経過したため、タイムアウトしました
    `.slice(1, -1))
  } else {
    // エラー
    opts.reply(tablate(6)`
      コードの実行に失敗しました...

      出力:
      \`\`\`
      ${resultText}
      \`\`\`
      ${noEscapeResultText.length > maxResultLength ? '長すぎるため、最初の方は切り捨てられています' : ''}
    `.slice(1, -1))
  }
}) satisfies Command

export default js
