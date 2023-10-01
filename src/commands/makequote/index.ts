import type { Command } from '../../main.ts'
import { createCanvas, loadImage } from '@napi-rs/canvas'

const makequote = (async (opts) => {
  const { client } = opts
  if (!opts.replyData) {
    opts.reply(opts.replyData.content.body)
  }
  
  const canvas = createCanvas(1200, 600)
  const ctx = canvas.getContext("2d")

  const profileInfo = await client.getProfileInfo(opts.replyData.target)

  const avatarUrl = client.mxcUrlToHttp(profileInfo.avatar_url, 600, 600) // アバターのHTTP URL
  const avatar = await loadImage(avatarUrl)

  // 背景の描画
  ctx.fillStyle = "#000"
  ctx.fillRect(0, 0, 1200, 600)

  // アバターの描画
  ctx.drawImage(avatar, 0, 0, 600, 600)

  // アバターをそれっぽく
  const startR = 500
  let r = startR
  ctx.lineWidth = 5
  while (true) {
    const wariai = (r - startR) / (1000 - startR)
    ctx.beginPath()
    ctx.arc(-400, 400, r, 0, Math.PI * 2, true)
    ctx.strokeStyle = `rgba(0, 0, 0, ${wariai < 0 ? 0 : wariai})`
    ctx.stroke()        
    r += 5
    if (r > 1500) {
      break
    }
  }

  // テキストの描画
  ctx.fillStyle = '#fff'
  ctx.font = "50px sans-serif";
  let x = 0
  let y = 0
  ctx.textAlign = "center"
  const charDatas = []
  for (const char of reply.msg) {
    const charSize = ctx.measureText(char)
    if (x + charSize.width > 550) {
      x = 0
      y += 60
    }
    x += charSize.width
    charDatas.push({
      x,y,
      width: charSize.width,
      char,
      charSize
    })
  }
  const xBias = (600 - x) / 2 + 450
  const yBias = (400 - y) / 2 + 20
  for (const charData of charDatas) {
    ctx.fillText(charData.char, charData.x + xBias - charData.charSize.actualBoundingBoxLeft, charData.y + yBias)
  }

  // 名前
  ctx.textAlign = "center"
  ctx.font = "italic 40px sans-serif";
  ctx.fillText('-' + displayname, 900, 500);
  // ユーザーID
  ctx.font = "30px sans-serif";
  ctx.fillStyle = '#bbb'
  ctx.fillText(reply.target, 900, 550);
  const url = canvas.toDataURL()

  const pngData: Uint8Array = await canvas.encode('png') // Uint8Array
  
  const uploaded = client.uploadContent(pngData, {
    type: 'image/png',
    name: 'image.png'
  })

  opts.reply(uploaded.content_uri)
  opts.reply('Image', {
    "info": {
      "h": 600,
      "mimetype": "image/png",
      "w": 1200
    },
    "msgtype": "m.image",
    "url": uploaded.content_uri
  })
}) satisfies Command

export default makequote
