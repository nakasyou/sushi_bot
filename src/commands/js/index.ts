import { optionalCallExpression } from '@babel/types'
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
    deno: {
      permissions: {

      }
    },
    type: 'module',
  })
  worker.onmessage = (evt) => {
    worker.terminate()
    opts.reply(`実行が完了しました！\n\nResult:\`\`\`json\n${evt.data}\`\`\``)
  }
  worker.onerror = (evt) => {
    // エラー
    worker.terminate()
    opts.reply(`
エラーが発生しました。
\`${evt.message} ( line ${evt.lineno - 1}, col ${evt.colno})\`
\`\`\`javascript
${evt.lineno > 2 ? code.split('\n')[evt.lineno - 2] : ''}
${code.split('\n')[evt.lineno - 1]}
${[...Array(evt.colno)].map(() => '').join(' ')}^ここ
${evt.lineno < code.split('\n').length ? code.split('\n')[evt.lineno] : ''}
\`\`\``)
  }
}) satisfies Command

export default js
