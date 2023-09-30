import type { Command } from '../main'

const time = (async (opts) => {
  opts.reply(new Date().toString())
}) satisfies Command

export default time
