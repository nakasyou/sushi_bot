import type { Command } from '../../main.ts'
import { createCanvas } from 'canvas'

const makequote = (async (opts) => {
  const canvas = createCanvas(1200, 600)
  opts.reply(opts.message.replace("?echo", ""))
}) satisfies Command

export default makequote
