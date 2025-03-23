export function toggleTheme(theme) {
  const html = document.querySelector('html')
  const darkTheme = `sl-theme-dark`
  const lightTheme = `sl-theme-light`

  if (theme === 'dark') {
    if (!html.classList.contains(darkTheme)) {
      html.classList.add(darkTheme)
    }
    html.classList.remove(lightTheme)
  }

  if (theme === 'light') {
    if (!html.classList.contains(lightTheme)) {
      html.classList.add(lightTheme)
    }
    html.classList.remove(darkTheme)
  }
}
