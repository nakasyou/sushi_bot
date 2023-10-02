import type { Command } from '../../main.ts'
import { createCanvas, loadImage, GlobalFonts } from '@napi-rs/canvas'
import { makeImage } from "./make-image.ts"

const makequote = (async (opts) => {
  const { client } = opts
  if (!opts.replyData) {
    opts.reply('リプライで使ってね')
    return
  }

  const profileInfo = await client.getProfileInfo(opts.replyData.userId)

  const avatarUrl = profileInfo.avatar_url ? client.mxcUrlToHttp(profileInfo.avatar_url, 600, 600): '' // アバターのHTTP URL
  const avatar = await loadImage(avatarUrl)

  const pngData = makeImage({
    id: opts.replyData.userId,
    message: opts.message,
    name: profileInfo.displayname || 'Anonymous',
    icon: avatar
  })
  
  const uploaded = await client.uploadContent(pngData, {
    type: 'image/png',
    name: 'image.png'
  })

  opts.imageReply(uploaded.content_uri, {
    w: 1200,
    h: 600,
    mimetype: 'image/png'
  })
}) satisfies Command

export default makequote
