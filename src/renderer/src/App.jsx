import { useState, useEffect } from 'react'
import { SlSpinner, SlAnimation } from './components/shoelace'
import Header from './components/header'
import Core from './components/core'
import { Footer } from './components/footer'
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
          console.log('args', args)
          setMounted(true)
          setData(args)
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
        console.log('COPY_FROM_CLIPBOARD::: args', args)
      })
    }
  }, [mounted])

  const handleSaveUI = (val, key) => {
    const newData = { ...data }
    newData.ui[key] = val
    // window.electron.ipcRenderer.send('SAVE_FILE', newData)
    setData(newData)
  }

  const handleSaveList = (updatedList) => {
    const newData = { ...data, listItems: updatedList }
    window.electron.ipcRenderer.send('SAVE_FILE', newData)
    setData(newData)
  }

  return (
    <div className={`zp-app ${!data ? 'is-loading' : ''}`}>
      {!data && (
        // <div className="zp-app-loader">
        //   <SlSpinner />
        //   <div>Loading...</div>
        // </div>
        <div className="zp-app-loader">
          <SlAnimation name="bounce" duration={2000} play>
            <img src={logo} alt="Zipboard Logo" className="zp-header-logo" />
          </SlAnimation>
        </div>
      )}

      {/* <div className="zp-app-loader">
        <SlAnimation name="bounce" duration={2000} play>
          <img src={logo} alt="Zipboard Logo" className="zp-header-logo" />
        </SlAnimation>
      </div> */}

      {data && (
        <>
          <Header data={data} handleSaveUI={handleSaveUI} />
          <Core data={data} saveData={handleSaveList} />
          <Footer />
        </>
      )}
    </div>
  )
}

export default App
