const STANDARD_TYPE = 'STANDARD'

// HTTP
const HTTP_CHECK = 'http://'
const HTTPS_CHECK = 'https://'
const HTTP_TYPE = 'HTTP'

// Image
const IMAGE_CHECK = /\.(gif|jpe?g|tiff?|png|webp|bmp)$/i
const IMAGE_TYPE = 'IMAGE'

export const TYPE_OPTIONS = [STANDARD_TYPE, HTTP_TYPE, IMAGE_TYPE]

export function itemTypeDetect(item) {
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

  return {
    text: item,
    date: new Date().toLocaleDateString(),
    type: STANDARD_TYPE
  }
}
