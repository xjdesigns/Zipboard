import { useState } from 'react'
import { SlButton, SlIcon, SlDialog, SlSwitch, SlInput } from './shoelace'
import logo from '../assets/icon.png'

const Header = ({ data, handleSaveUI }) => {
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [maxValues, setMaxValues] = useState(data.ui.maxValues)
  const [isLineClamped, setLineClamped] = useState(data.ui.lineClamp)

  // There is a bug with the value not being proper here from value
  // On add value check and set to be safe
  const handleMaxValues = (ev) => {
    const val = ev.target.value
    if (!val) {
      setMaxValues(10)
      return
    }
    if (parseInt(val, 10) > 300) {
      setMaxValues(300)
      return
    }

    setMaxValues(val)
  }

  const handleAddValues = () => {
    let valueToSave = maxValues
    if (!valueToSave) {
      valueToSave = 10
      setMaxValues(10)
      return
    }
    if (parseInt(valueToSave, 10) > 300) {
      valueToSave = 300
      setMaxValues(300)
      return
    }
    handleSaveUI(valueToSave, 'maxValues')
  }

  const handleLineClamp = (ev) => {
    const checked = ev.target.checked
    setLineClamped(checked)
    handleSaveUI(checked, 'lineClamp')
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
                label="Max values"
                type="number"
                size="small"
                min="10"
                max="300"
                value={maxValues}
                onSlInput={handleMaxValues}
              />
            </div>
            <SlButton size="small" onClick={handleAddValues}>
              Add
            </SlButton>
          </div>
        </div>
        <div className="zp-divider" />
        <div>
          <SlSwitch checked={isLineClamped} onSlChange={handleLineClamp}>
            Line Clamp
          </SlSwitch>
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
