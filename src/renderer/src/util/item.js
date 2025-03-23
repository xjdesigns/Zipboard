export const STANDARD_TYPE = 'STANDARD'

// HTTP
const HTTP_CHECK = 'http://'
const HTTPS_CHECK = 'https://'
export const HTTP_TYPE = 'HTTP'

// Image
export const IMAGE_TYPE = 'IMAGE'

// Number w/ specials
export const NUMBER_TYPE = 'NUMBER'

export const TYPE_OPTIONS = [STANDARD_TYPE, HTTP_TYPE, IMAGE_TYPE, NUMBER_TYPE]

export function itemTypeDetect(item) {
  // regex values must live within the scope
  const IMAGE_CHECK = /\.(gif|jpe?g|tiff?|png|webp|bmp)$/i
  const NUMBER_CHECK = /^([0-9]|#|\+|\*|-|,)+$/gm

  if (item.includes(HTTPS_CHECK) || item.includes(HTTP_CHECK)) {
    return {
      text: item,
      date: new Date().toLocaleDateString(),
      type: HTTP_TYPE
    }
  }

  if (IMAGE_CHECK.test(item)) {
    return {
      text: item,
      date: new Date().toLocaleDateString(),
      type: IMAGE_TYPE
    }
  }

  if (NUMBER_CHECK.test(item)) {
    return {
      text: item,
      date: new Date().toLocaleDateString(),
      type: NUMBER_TYPE
    }
  }

  return {
    text: item,
    date: new Date().toLocaleDateString(),
    type: STANDARD_TYPE
  }
}

export function filterHistoryByType(history, type) {
  const updated = history.filter((h) => h.type !== type)
  return updated
}
