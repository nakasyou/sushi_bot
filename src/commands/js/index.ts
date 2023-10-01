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

  const blobCode: Blob = new Blob([code], {
    type: 'text/javascript'
  })
  const codeUrl = URL.createObjectURL(blobCode)
  
  const worker = new Worker(codeUrl, {
    deno: true,
    type: 'module',
  })
  worker.onmessage = (data) => {
    console.log(data)
  }
}) satisfies Command

export default js
