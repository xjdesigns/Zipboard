export function searchConversion(text, type) {
  if (type === 'loose') {
    return text.toLowerCase()
  }
  return text
}
