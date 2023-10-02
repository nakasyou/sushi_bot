import type { Command } from '../main.ts'

const http = (async (opts) => {
  opts.reply(opts.message)
  opts.reply(opts.message)
  const textUrl = opts.message.replace('?http ', '')
  let url: URL
  try {
    url = new URL(textUrl)
  } catch (_error) {
    opts.reply("正しいURLを入力してください")
  }
  const response = await fetch(url)
  opts.reply(reponse.status)
}) satisfies Command

export default http
