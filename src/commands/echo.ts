import type { Command } from '../main'

const echo = (async (opts) => {
  opts.reply(opts.message.replace("?echo", ""))
}) satisfies Command

export default echo
