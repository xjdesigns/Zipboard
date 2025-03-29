import { useState, useEffect } from 'react'
import { SlAnimation } from './components/shoelace'
import Header from './components/header'
import Core from './components/core'
import { Footer } from './components/footer'
import { toggleTheme } from './util/theme'
import { itemTypeDetect, filterHistoryByType } from './util/item'
import logo from './assets/icon.png'

function App() {
  const [data, setData] = useState(null)
  const [mounted, setMounted] = useState(false)
  const [appHasLoaded, setAppHasLoaded] = useState(false)

  useEffect(() => {
    if (!appHasLoaded) {
      setAppHasLoaded(true)
      window.electron.ipcRenderer.send('APP_IS_READY')
    }
  }, [appHasLoaded])

  useEffect(() => {
    if (!data) {
      window.electron.ipcRenderer.once('APP_LOADED', (_, args) => {
        if (args && !data) {
          setData(args)

          if (!mounted) {
            setMounted(true)
          }
        } else {
          window.electron.ipcRenderer.removeAllListeners('APP_IS_READY')
          window.electron.ipcRenderer.removeAllListeners('APP_LOADED')
        }
      })
    }
  }, [data])

  useEffect(() => {
    if (mounted) {
      window.electron.ipcRenderer.on('COPY_FROM_CLIPBOARD', (_, args) => {
        const { clipboardText, isFavorite } = args
        const newEntry = itemTypeDetect(clipboardText, isFavorite)
        clipboardUpdate(newEntry)
      })
    }
  }, [mounted])

  const clipboardUpdate = (newEntry) => {
    setData((prev) => {
      const newData = {
        ...prev,
        history: [newEntry, ...prev.history]
      }
      window.electron.ipcRenderer.send('SAVE_FILE', newData)
      return newData
    })
  }

  useEffect(() => {
    if (mounted) {
      const theme = data.ui.theme
      toggleTheme(theme)
    }
  }, [mounted])

  const handleSaveUI = (val, key) => {
    if (key === 'historyLength') {
      if (data.history.length > val) {
        const updatedHistory = data.history.filter((_, idx) => {
          return idx < val
        })

        setData((prev) => {
          const updated = {
            ...prev,
            ui: {
              ...prev.ui,
              [key]: val
            },
            history: updatedHistory
          }
          window.electron.ipcRenderer.send('SAVE_FILE', updated)
          return updated
        })
        return
      }
    }

    const newData = { ...data }
    newData.ui[key] = val
    window.electron.ipcRenderer.send('SAVE_FILE', newData)
    setData(newData)
  }

  const handleSaveList = (updatedList) => {
    const newData = { ...data, history: updatedList }
    window.electron.ipcRenderer.send('SAVE_FILE', newData)
    setData(newData)
  }

  const handleClearHistory = (canDeleteFavorite = false) => {
    let history = []
    if (!canDeleteFavorite) {
      history = data.history.filter((d) => d.isFavorite)
    }
    const newData = { ...data, history }
    window.electron.ipcRenderer.send('SAVE_FILE', newData)
    setData(newData)
  }

  const handleClearHistoryType = (type, canDeleteFavorite = false) => {
    const history = filterHistoryByType(data.history, type, canDeleteFavorite)
    const newData = { ...data, history }
    window.electron.ipcRenderer.send('SAVE_FILE', newData)
    setData(newData)
  }

  return (
    <div className={`zp-app ${!data ? 'is-loading' : ''}`}>
      {!data && (
        <div className="zp-app-loader">
          <SlAnimation name="bounce" duration={2000} play>
            <img src={logo} alt="Zipboard Logo" className="zp-header-logo" />
          </SlAnimation>
        </div>
      )}

      {data && (
        <>
          <Header
            data={data}
            handleSaveUI={handleSaveUI}
            clearHistory={handleClearHistory}
            clearHistoryType={handleClearHistoryType}
          />
          <Core data={data} saveData={handleSaveList} />
          <Footer data={data} />
        </>
      )}
    </div>
  )
}

export default App
