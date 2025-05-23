import { app, shell, BrowserWindow, ipcMain, Tray, Menu, nativeImage, clipboard } from 'electron'
import { join } from 'path'
import fs from 'node:fs'
// import os from 'node:os'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import trayImage from '../../resources/zipboard.png?asset'
// const FILE_LOCATION = join(__dirname, '../../resources/savefile.json')
const BASE_FILE_LOCATION = join(__dirname, '../../resources/base-save.json')
const logSaveResults = false
const DOCS_LOCATION = app.getPath('home')

let mainWindow
function createWindow() {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 500,
    minWidth: 320,
    height: 990,
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.zipboard')

  // Create the Tray and Native Image Icon
  const image = nativeImage.createFromPath(trayImage)
  const tray = new Tray(image)

  // Create the tray menu
  const template = [
    { label: 'Zipload App', enabled: false },
    { type: 'separator' },
    {
      label: 'Add Clipboard',
      click: () => {
        const text = clipboard.readText()
        if (text && text.length) {
          mainWindow.webContents.send('COPY_FROM_CLIPBOARD', {
            clipboardText: `${text}`,
            isFavorite: false
          })
        }
      }
    },
    {
      label: 'Add Clipboard Fav',
      click: () => {
        const text = clipboard.readText()
        if (text && text.length) {
          mainWindow.webContents.send('COPY_FROM_CLIPBOARD', {
            clipboardText: `${text}`,
            isFavorite: true
          })
        }
      }
    },
    { type: 'separator' },
    {
      label: 'Copy favorites',
      submenu: [
        {
          label: 'Copy first fav',
          click: () => {
            getFileDataForCopy(0)
          }
        },
        {
          label: 'Copy second fav',
          click: () => {
            getFileDataForCopy(1)
          }
        },
        {
          label: 'Copy third fav',
          click: () => {
            getFileDataForCopy(2)
          }
        },
        {
          label: 'Copy fourth fav',
          click: () => {
            getFileDataForCopy(3)
          }
        }
      ]
    },
    { type: 'separator' },
    {
      label: 'Show',
      click: () => {
        mainWindow.restore()
      }
    },
    {
      label: 'Hide',
      click: () => {
        mainWindow.minimize()
      }
    },
    { type: 'separator' },
    {
      label: 'Quit',
      click: () => {
        app.quit()
      }
    }
  ]

  // Create the menu and set it to the Tray
  const mainMenu = Menu.buildFromTemplate(template)
  tray.setToolTip('My App')
  tray.setContextMenu(mainMenu)

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  ipcMain.on('APP_IS_READY', (event) => {
    setTimeout(() => {
      console.warn('APP_IS_READY event')
      // getFileData(event, 'APP_LOADED')
      getAppData(event, 'APP_LOADED')
    }, 2000)
  })

  ipcMain.on('SAVE_FILE', (_, data) => {
    if (logSaveResults) {
      console.warn('SAVE FILE data', data)
    }

    const file = JSON.stringify(data, null, '  ')
    fs.writeFile(`${DOCS_LOCATION}/.zipboard.json`, file, (err) => {
      if (err) {
        console.error(err)
      } else {
        console.warn('Save File Successful')
      }
    })
  })

  // IPC test
  ipcMain.on('ping', () => console.log('pong'))
  app.on('ping', () => {
    mainWindow.webContents.send('TESTING', { data: {} })
  })

  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.
// function getFileData(event, channel) {
//   fs.readFile(FILE_LOCATION, (err, data) => {
//     if (err) console.error('No File Located')
//     if (err) {
//       event.sender.send(channel, {})
//       return
//     }
//     const file = JSON.parse(data)
//     event.sender.send(channel, file)
//   })
// }

function getAppData(event, channel) {
  fs.readFile(`${DOCS_LOCATION}/.zipboard.json`, (err, data) => {
    if (err) {
      console.error('No File Located, writing base file')
      fs.readFile(BASE_FILE_LOCATION, (err, data) => {
        if (err) {
          event.sender.send('APP_DATA_LOAD_ERROR', {})
          return
        }
        fs.writeFile(`${DOCS_LOCATION}/.zipboard.json`, data, (err) => {
          if (err) {
            console.log('err', err)
            event.sender.send('APP_DATA_LOAD_ERROR', {})
            return
          }
        })
        const file = JSON.parse(data)
        event.sender.send(channel, file)
      })
      return
    }
    const file = JSON.parse(data)
    event.sender.send(channel, file)
  })
}

function getFileDataForCopy(idx) {
  fs.readFile(`${DOCS_LOCATION}/.zipboard.json`, (err, data) => {
    if (err) console.error('No File Located')
    if (err) {
      return
    }
    const file = JSON.parse(data)
    const filtered = file.history.filter((i) => i.isFavorite)
    const whichToCopy = filtered.find((_, fidx) => fidx === idx)
    if (whichToCopy) {
      clipboard.writeText(whichToCopy.text)
    } else {
      clipboard.writeText('No match to copy')
    }
  })
}
