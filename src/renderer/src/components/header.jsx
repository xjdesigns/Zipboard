import { useState } from 'react'
import { SlButton, SlIcon, SlDialog, SlSwitch, SlInput } from './shoelace'
import logo from '../assets/icon.png'

const Header = ({ data, handleSaveUI, clearHistory }) => {
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [historyLength, setHistoryLength] = useState(data.ui.historyLength)
  const [isLineClamped, setLineClamped] = useState(data.ui.lineClamp)
  const [showDates, setShowDates] = useState(data.ui.showDates)

  // There is a bug with the value not being proper here from value
  // On add value check and set to be safe
  const handleHistoryLength = (ev) => {
    const val = ev.target.value
    if (!val) {
      setHistoryLength(10)
      return
    }
    if (parseInt(val, 10) > 300) {
      setHistoryLength(300)
      return
    }

    setHistoryLength(val)
  }

  const handleAddValues = () => {
    let valueToSave = historyLength
    if (!valueToSave) {
      valueToSave = 10
      setHistoryLength(10)
      return
    }
    if (parseInt(valueToSave, 10) > 300) {
      valueToSave = 300
      setHistoryLength(300)
      return
    }
    handleSaveUI(valueToSave, 'historyLength')
  }

  const handleLineClamp = (ev) => {
    const checked = ev.target.checked
    setLineClamped(checked)
    handleSaveUI(checked, 'lineClamp')
  }

  const handleShowDates = (ev) => {
    const checked = ev.target.checked
    setShowDates(checked)
    handleSaveUI(checked, 'showDates')
  }

  return (
    <>
      <header className="zp-header">
        <img src={logo} alt="Zipboard Logo" className="zp-header-logo" />
        <div className="zp-h-title">Zipboard</div>

        <div className="zp-h-actions">
          <SlButton onClick={() => setSettingsOpen(true)} size="small" circle>
            <SlIcon name="gear-wide-connected" />
          </SlButton>
        </div>
      </header>

      <SlDialog
        label="App Settings"
        open={settingsOpen}
        onSlAfterHide={() => setSettingsOpen(false)}
      >
        <div>
          <div className="zp-flex zp-flex--end">
            <div className="zp-flex-fill">
              <SlInput
                label="History"
                type="number"
                size="small"
                min="10"
                max="300"
                value={historyLength}
                onSlInput={handleHistoryLength}
              />
            </div>
            <SlButton size="small" onClick={handleAddValues}>
              Update
            </SlButton>
          </div>
          <div className="zp-text-small zp-text-small--dim">
            If your history exceeds the length it will be trimmed and saved
          </div>
        </div>
        <div className="zp-divider" />
        <div className="zp-mg-bt">
          <SlSwitch checked={isLineClamped} onSlChange={handleLineClamp}>
            Line Clamp
          </SlSwitch>
        </div>
        <div>
          <SlSwitch checked={showDates} onSlChange={handleShowDates}>
            Show Dates
          </SlSwitch>
        </div>
        <div className="zp-divider" />
        <div>
          <SlButton size="small" variant="warning" outline onClick={clearHistory}>
            Clear History
          </SlButton>
        </div>

        <SlButton
          slot="footer"
          size="small"
          variant="primary"
          onClick={() => setSettingsOpen(false)}
        >
          Close
        </SlButton>
      </SlDialog>
    </>
  )
}

export default Header
