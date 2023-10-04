import type { Command } from '../main'

const wp = (async (opts) => {
  /**
   * 検索対象
   */
  const targetWord = opts.message.split("\n")[0].replace("?wp ", "")

  const json = await fetch(
    "https://ja.wikipedia.org/w/api.php?format=json&action=query&prop=extracts&exintro&explaintext&redirects=1&titles=" + targetWord
  ).then(res => res.json())

  const data: any = Object.values(json.query.pages)[0]
  if (data.missing === "") {
    opts.reply(
      "### SushiBot Wikipedia Search\n`" + targetWord +
      "`というページはWikipediaに存在しませんでした...",
    )
  } else {
    const result = (data.extract || '').replaceAll("\n", "\n\n");
    opts.reply(`### Wikipedia: ${targetWord}\n${result}`);
  }
}) satisfies Command

export default wp
