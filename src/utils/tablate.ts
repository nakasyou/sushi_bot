/**
 * Tablate
 */
export const tablate = (tabSize: number) => {
  const replaceRegExp = new RegExp(`^ {${tabSize}}`, 'mg')
  return (strings: TemplateStringsArray, ...placeHolders: any[]) => {
    let result = ''

    let i = 0
    for (const string of strings) {
      result += string.replaceAll(replaceRegExp, '')
      result += placeHolders[i] || ''
      i ++
    }
    return result
  }
}
