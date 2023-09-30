import type { Command } from '../main'

const omikuji = (async (opts) => {
  /**
   * おみくじ一覧
   */
  const list = "大吉 吉 中吉 小吉 半吉 末吉 末小吉 平吉 凶 小凶 半凶 末凶 大凶".split(" ")
  /**
   * 寿司一覧
   */
  const sushis = "大トロ 中トロ サーモン タコ しめ鯖 はまち えんがわ".split(" ")
  
  const omikujiResult = list[Math.floor(Math.random() * list.length)]
  const sushiResult = sushis[Math.floor(Math.random() * sushis.length)]
  const resultText = `おみくじの結果は、${omikujiResult}です！\n\nラッキー寿司は、${sushiResult}だよー`

  opts.reply(resultText)
}) satisfies Command

export default omikuji
