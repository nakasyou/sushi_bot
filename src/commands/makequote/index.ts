import type { Command } from '../../main.ts'
import { createCanvas } from '@napi-rs/canvas'

const makequote = (async (opts) => {
  const canvas = createCanvas(1200, 600)
  const ctx = canvas.getContext("2d")
  
  opts.reply(opts.message.replace("?echo", ""))
}) satisfies Command

export default makequote
