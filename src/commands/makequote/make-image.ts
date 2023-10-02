import { createCanvas, loadImage, GlobalFonts, Image } from '@napi-rs/canvas'

export const makeImage = async (init: {
  id: string
  message: string
  name: string
  icon: Image
}): Promise<Uint8Array> => {
  const canvas = createCanvas(1200, 600)
  const ctx = canvas.getContext("2d")

  // 背景の描画
  ctx.fillStyle = "#000"
  ctx.fillRect(0, 0, 1200, 600)

  // アバターの描画
  ctx.drawImage(init.icon, 0, 0, 600, 600)

  // アバターをそれっぽく
  const startR = 500
  let r = startR
  ctx.lineWidth = 2
  while (true) {
    const wariai = (r - startR) / (1000 - startR)
    ctx.beginPath()
    ctx.arc(-400, 400, r, 0, Math.PI * 2, true)
    ctx.strokeStyle = `rgba(0, 0, 0, ${wariai < 0 ? 0 : wariai})`
    ctx.stroke()
    r += 2
    if (r > 1500) {
      break
    }
  }

  /**
   * フォント
   */
  const fontName = `"Noto Sans CJK JP" "Noto Sans Mono CJK JP"`

  // テキストの描画
  ctx.fillStyle = '#fff'
  ctx.font = "50px " + fontName;

  interface CharData {
    x: number
    y: number
    width: number
    char: string
    charSize: number
  }
  let x = 0
  let y = 0
  ctx.textAlign = "center"
  const lineDatas: CharData[][] = []
  let lineData: CharData[] = []
  for (const char of init.message) {
    const charSize = ctx.measureText(char)
    if (x > 500) {
      x = 0
      y += 60
      lineDatas.push(lineData)
      lineData = []
    } else {
      x += charSize.width
    }
    lineData.push({
      x,y,
      width: charSize.width,
      char,
      charSize
    })
  }
  lineDatas.push(lineData)

  const xBias = (600 - x) / 2 + 400
  const yBias = (400 - y) / 2 + 20
  for (const lineData of lineDatas) {
    const line = lineData.map((charData) => charData.char).join('')
    ctx.fillText(line, lineData[0].x + 900, lineData[0].y + 200)
  }

  // 名前
  ctx.textAlign = "center"
  ctx.font = "italic 40px " + fontName;
  ctx.fillText('-' + init.name, 900, 500);
  // ユーザーID
  ctx.font = "30px " + fontName;
  ctx.fillStyle = '#bbb'
  ctx.fillText(init.id, 900, 550);

  const pngData: Uint8Array = await canvas.encode('png') // Uint8Array
  return pngData
}

if (import.meta.main) {
  const image = await makeImage({
    id: '@nakasyou:matrix.org',
    icon: await loadImage('https://github.com/nakasyou.png'),
    name: "Shotaro Nakamura",
    message: "abcdefghijklmnopqrstuvwxyz"
  })
  await Deno.writeFile('./tmp/nakasyou.png', image)
}
