import type { Command } from '../main.ts'
import { tablate } from '../utils/tablate.ts'

const http = (async (opts) => {
  const textUrl = opts.message.replace('?http ', '')
  let url: URL
  try {
    url = new URL(textUrl)
    if (!(['http:', 'https:'].includes(url.protocol))) {
      throw new Error()
    }
  } catch (_error) {
    await opts.reply("正しいURLを入力してください")
    return
  }
  
  let response: Response
  try {
    response = await fetch(url)
  } catch (_error) {
    await opts.reply('httpリクエストの送信中にエラーが発生しました。正しく名前解決ができなかったり、プロトコルが間違っている可能性があります。')
    return
  }
  await opts.reply(tablate(2)`
  ### \`${url}\`へのアクセス結果
  - Status
    - Code: \`response.status.toString()\`
  - Headers:
  \`\`\`
  ${Array.from(response.entries()).map(([key, value]) => `${key}: ${value}`).join('\n')}
  \`\`\`
  `)
}) satisfies Command

export default http
