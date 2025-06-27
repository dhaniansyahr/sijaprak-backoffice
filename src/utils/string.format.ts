export function kebabCaseToTitleCase(str: string) {
  return str.replace(/-/g, ' ').replace(/\b\w/g, char => char.toUpperCase())
}
export function getTitleByPath(options: any, path: any, parentTitle = ''): any {
  const normalizedPath = path.endsWith('/') ? path.slice(0, -1) : path
  let matchedTitle = null
  let longestMatchLength = 0

  for (const option of options) {
    const normalizedOptionPath = option.path?.endsWith('/') ? option.path.slice(0, -1) : option.path

    if (normalizedOptionPath && normalizedPath.startsWith(normalizedOptionPath)) {
      if (normalizedOptionPath.length > longestMatchLength) {
        // matchedTitle = parentTitle ? `${parentTitle} > ${option.title}` : option.title;
        matchedTitle = option.title
        longestMatchLength = normalizedOptionPath.length
      }
    }

    if (option.children) {
      const result = getTitleByPath(option.children, path, option.title)
      if (result && result.length > longestMatchLength) {
        matchedTitle = result
        longestMatchLength = result.length
      }
    }
  }

  return matchedTitle
}
