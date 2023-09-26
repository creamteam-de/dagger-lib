const mjsResolver = (path, options) => {
  const mjsExtRegex = /\.mjs$/i
  const resolver = options.defaultResolver
  if (mjsExtRegex.test(path)) {
    try {
      return resolver(path.replace(mjsExtRegex, ".mts"), options)
    } catch {
      return resolver()
    }
  }

  return resolver(path, options)
}

module.exports = mjsResolver
