export const STANDARD_TYPE = 'STANDARD'

// HTTP
const HTTP_CHECK = 'http://'
const HTTPS_CHECK = 'https://'
export const HTTP_TYPE = 'HTTP'

// Image
export const IMAGE_TYPE = 'IMAGE'

// Number w/ specials
export const NUMBER_TYPE = 'NUMBER'

// UUID
export const UUID_TYPE = 'UUID'

export const TYPE_OPTIONS = [STANDARD_TYPE, HTTP_TYPE, IMAGE_TYPE, NUMBER_TYPE, UUID_TYPE]

export function itemTypeDetect(item) {
  // regex values must live within the scope
  const IMAGE_CHECK = /\.(gif|jpe?g|tiff?|png|webp|bmp)$/i
  const NUMBER_CHECK = /^([0-9]|#|\+|\*|-|,)+$/gm
  const UUID_CHECK = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/g
  let itemType = 'STANDARD_TYPE'

  if (IMAGE_CHECK.test(item)) {
    itemType = IMAGE_TYPE
  }

  if (item.includes(HTTPS_CHECK) || item.includes(HTTP_CHECK)) {
    itemType = HTTP_TYPE
  }

  if (NUMBER_CHECK.test(item)) {
    itemType = NUMBER_TYPE
  }

  if (UUID_CHECK.test(item)) {
    itemType = UUID_TYPE
  }

  return {
    text: item,
    date: new Date().toLocaleDateString(),
    type: itemType
  }
}

export function filterHistoryByType(history, type) {
  const updated = history.filter((h) => h.type !== type)
  return updated
}
