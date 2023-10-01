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
    args: ['eval', code]
  })
  const process = evalCommand.spawn()
  
  const status = await process.status

  if (status.success) {
    opts.reply('成功!')
  }
}) satisfies Command

export default js
