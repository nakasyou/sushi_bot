import type { Command } from '../main.ts'

const echo = (async (opts) => {
  opts.reply(opts.message.replace("?echo", ""))
}) satisfies Command

export default echo
