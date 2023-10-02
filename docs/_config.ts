import lume from "lume/mod.ts"

import jsx from "lume/plugins/jsx.ts"
import base_path from "lume/plugins/base_path.ts"
import mdx from "lume/plugins/mdx.ts"
import minify_html from "lume/plugins/minify_html.ts"
import windi from "lume/plugins/windi_css.ts"

const site = lume()

site.use(jsx())
site.use(base_path({
  location: new URL("https://nakasyou.github.io/sushi_bot")
}))
site.use(mdx())
site.use(minify_html())
site.use(windi())

export default site
