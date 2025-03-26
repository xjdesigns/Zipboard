// Handler for when a user pastes the data after update
// Or adds the file manually to the directory (this is a todo, on local save)
export function validate(data) {
  let isValid = true
  console.log('data', data)
  const toValidate = JSON.parse(data)

  for (let [key, value] of Object.entries(toValidate)) {
    console.log('key', key)
    if (key === 'version') {
      if (typeof value !== 'number') {
        isValid = false
      }
    }

    if (key === 'history') {
      if (Array.isArray(value)) {
        for (let i = 0; i < value.length; i++) {
          const keys = Object.keys(value[i])
          keys.forEach((k) => {
            // Required
            if (k === 'text' && typeof value[i][k] !== 'string') {
              isValid = false
            }
            // Optional and be overriden
            if (k === 'date' && typeof value[i][k] !== 'string') {
              value[i][k] = 'na/na/na'
            }
            if (k === 'type' && typeof value[i][k] !== 'string') {
              value[i][k] = 'STANDARD'
            }
            if (k === 'isFavorite' && typeof value[i][k] !== 'boolean') {
              value[i][k] = false
            }
          })
        }
      } else {
        isValid = false
      }
    }

    if (key === 'ui') {
      if (typeof value === 'object' && value !== null) {
        const keys = Object.keys(value)
        keys.forEach((k) => {
          // All are Required
          if (k === 'theme' && (value[k] !== 'dark' || value[k] !== 'light')) {
            value[k] = 'dark'
          }
          if (k === 'lineClamp' && typeof value[k] !== 'boolean') {
            value[k] = true
          }
          if (k === 'historyLength' && typeof value[k] !== 'number') {
            value[k] = 100
          }
          if (k === 'showDates' && typeof value[k] !== 'boolean') {
            value[k] = true
          }
          if (k === 'showType' && typeof value[k] !== 'boolean') {
            value[k] = true
          }
          if (k === 'showType' && (value[k] !== 'strict' || value[k] !== 'loose')) {
            value[k] = 'strict'
          }
          if (k === 'showTypes' && typeof value[k] !== 'boolean') {
            value[k] = true
          }
        })
      } else {
        isValid = false
      }
    }
  }

  console.log('isValid', isValid)
  console.log('toValidate', toValidate)

  return {
    isValid,
    data: toValidate
  }
}
