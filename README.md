# Zipboard APP

An Electron/React Clipboard application

## Recommended IDE Setup

- [VSCode](https://code.visualstudio.com/) + [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) + [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)

## Plans
Add light/dark mode to app settings. Shoelace has a top level class already to allow toggling but the custom CSS is not handling this. When light mode it does not change as I made the base app this is created from to just be dark mode.
Easy change just need to add color variables, verify, and add in the toggle/styling to flip app specific variables that are outside of Shoelace.

## Project Setup

### Install

```bash
$ npm install
```

### Development

```bash
$ npm run dev
```

### Build

```bash
# For windows
$ npm run build:win

# For macOS
$ npm run build:mac

# For Linux
$ npm run build:linux
```
