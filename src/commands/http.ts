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
  const response = await fetch(url)
  await opts.reply(reponse.status)
}) satisfies Command

export default http
