
const getValueByPrefix = (tags, param) => {
  const prefix = `__${param}:`
  const tag = tags.find(tag => tag.indexOf(prefix) === 0)

  return tag ? tag.slice(prefix.length) : tag
}

// usage example
// export const getRecurringProductId = tags =>
//   getValueByPrefix(tags, 'my-tag')
