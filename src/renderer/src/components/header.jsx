import { useState } from 'react'
import {
  SlButtonGroup,
  SlButton,
  SlIcon,
  SlDialog,
  SlSwitch,
  SlInput,
  SlSelect,
  SlOption,
  SlAnimation
} from './shoelace'
import { toggleTheme } from '../util/theme'
import { TYPE_OPTIONS } from '../util/item'
import logo from '../assets/icon.png'

const Header = ({ data, handleSaveUI, clearHistory, clearHistoryType }) => {
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [showClear, setShowClear] = useState(false)
  const [historyLength, setHistoryLength] = useState(data.ui.historyLength)
  const [isLineClamped, setLineClamped] = useState(data.ui.lineClamp)
  const [showDates, setShowDates] = useState(data.ui.showDates)
  const [showTypes, setShowTypes] = useState(data.ui.showTypes)
  const searchRule = data.ui.searchRule

  // There is a bug with the value not being proper here from value
  // On add value check and set to be safe
  const handleHistoryLength = (ev) => {
    const val = ev.target.value
    const intVal = parseInt(val, 10)
    if (!intVal) {
      setHistoryLength(10)
      return
    }
    if (intVal > 300) {
      setHistoryLength(300)
      return
    }

    setHistoryLength(intVal)
  }

  const handleAddValues = () => {
    let valueToSave = historyLength
    if (!historyLength) {
      valueToSave = 10
      setHistoryLength(10)
      return
    }
    if (valueToSave > 300) {
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

  const handleShowTypes = (ev) => {
    const checked = ev.target.checked
    setShowTypes(checked)
    handleSaveUI(checked, 'showTypes')
  }

  const handleSearchRule = (ev) => {
    const rule = ev.target.value
    handleSaveUI(rule, 'searchRule')
  }

  const handleTheme = (ev) => {
    const theme = ev.target.value
    toggleTheme(theme)
    handleSaveUI(theme, 'theme')
  }

  const handleModalClose = (ev) => {
    if (ev.target.localName === 'sl-select') {
      return
    }
    setSettingsOpen(false)
    setShowClear(false)
  }

  const scrollToTop = () => {
    const el = document.querySelector('#zpCore')
    el.scrollTop = 0
  }

  return (
    <>
      <header className="zp-header">
        <img src={logo} alt="Zipboard Logo" className="zp-header-logo" />
        <div className="zp-h-title">Zipboard</div>

        <div className="zp-h-actions">
          <SlButton onClick={scrollToTop} size="small" circle>
            <SlIcon name="arrow-bar-up" />
          </SlButton>
          <SlButton onClick={() => setSettingsOpen(true)} size="small" circle>
            <SlIcon name="gear-wide-connected" />
          </SlButton>
        </div>
      </header>

      <SlDialog label="App Settings" open={settingsOpen} onSlAfterHide={handleModalClose}>
        {!showClear && (
          <div>
            <div>
              <div className="zp-theme-select">
                <SlSelect label="Theme" size="small" value={data.ui.theme} onSlChange={handleTheme}>
                  <SlOption value="dark">
                    <SlIcon name="moon" slot="suffix" />
                    Dark
                  </SlOption>
                  <SlOption value="light">
                    <SlIcon name="brightness-high" slot="suffix" />
                    Light
                  </SlOption>
                </SlSelect>
              </div>
              <div className="zp-divider" />
              <div className="zp-mg-bt">
                <SlSelect
                  label="Search Rule"
                  size="small"
                  value={searchRule}
                  onSlChange={handleSearchRule}
                >
                  <SlOption value="strict">Strict</SlOption>
                  <SlOption value="loose">Loose</SlOption>
                </SlSelect>
              </div>
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
              <SlSwitch checked={isLineClamped} onSlChange={handleLineClamp} size="small">
                Line Clamp
              </SlSwitch>
            </div>
            <div className="zp-mg-bt">
              <SlSwitch checked={showDates} onSlChange={handleShowDates} size="small">
                Show Dates
              </SlSwitch>
            </div>
            <div>
              <SlSwitch checked={showTypes} onSlChange={handleShowTypes} size="small">
                Show Types
              </SlSwitch>
            </div>
            <div className="zp-divider" />
            <div>
              <SlButton
                size="small"
                variant="warning"
                outline
                onClick={() => setShowClear(true)}
                disabled={data.history.length === 0}
              >
                Manage History
              </SlButton>
            </div>
          </div>
        )}

        {showClear && (
          <div>
            <div className="zp-logo-history">
              <SlAnimation name="bounce" duration={2000} play>
                <img src={logo} alt="Zipboard Logo" />
              </SlAnimation>
            </div>
            <div className="zp-mg-bt">
              This will remove all or some of your history, are you sure?
            </div>
            <div className="zp-btn-full zp-mg-bt">
              <SlButton
                size="small"
                variant="warning"
                outline
                onClick={clearHistory}
                disabled={data.history.length === 0}
              >
                Clear ALL History
              </SlButton>
            </div>
            {TYPE_OPTIONS.map((type) => {
              return (
                <div className="zp-btn-full zp-mg-bt" key={type}>
                  <SlButton
                    size="small"
                    variant="neutral"
                    outline
                    onClick={() => clearHistoryType(type)}
                    disabled={data.history.length === 0}
                  >
                    Clear {type}
                  </SlButton>
                </div>
              )
            })}
          </div>
        )}

        <SlButtonGroup slot="footer">
          {showClear && (
            <SlButton size="small" variant="default" onClick={() => setShowClear(false)}>
              Back
            </SlButton>
          )}
          <SlButton size="small" variant="primary" onClick={() => setSettingsOpen(false)}>
            Close
          </SlButton>
        </SlButtonGroup>
      </SlDialog>
    </>
  )
}

export default Header
