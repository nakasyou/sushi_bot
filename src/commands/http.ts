import type { Command } from '../main.ts'

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

  await opts.reply(response.status)
}) satisfies Command

export default http
