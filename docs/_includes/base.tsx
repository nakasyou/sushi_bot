export default (props: {
  children: JSX.Element
  title: string
  styles?: string[]
}) => <html lang='ja'>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width,initial-scale=1" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <meta name="generator" content="Lume" />
    <title>{ props.title }</title>

    {
      (props.styles || []).map(style => <style>{ style }</style>)
    }
  </head>
  <body>
    { props.children }
  </body>
</html>
