import { useState, useMemo } from 'react'
import { SlInput, SlButton, SlCopyButton, SlIconButton, SlAlert, SlIcon } from './shoelace'

export const Items = ({ data, handleSave }) => {
  const [currentInput, setCurrentInput] = useState('')
  // TODO: Remove this in favor of a save to handle history changes
  // const [list, setList] = useState(data.history || [])
  const [lengthError, setlengthError] = useState(false)
  const [isSearching, setIsSearching] = useState(false)
  const [searchValue, setSearchValue] = useState('')
  const list = data.history || []
  const lineIsClamped = data.ui.lineClamp
  const showDates = data.ui.showDates

  const filtered = useMemo(() => {
    if (searchValue) {
      const results = list.filter((l) => {
        return l.text.includes(searchValue)
      })
      return results
    } else {
      return list
    }
  }, [searchValue, data])

  const handleInput = (ev) => {
    const val = ev.target.value
    setCurrentInput(val)
  }

  const handelAdd = () => {
    const newEntry = {
      text: currentInput,
      date: new Date().toLocaleDateString(),
      type: 'STANDARD'
    }
    const newList = [newEntry, ...list]
    if (newList.length > data.ui.historyLength) {
      setlengthError(true)
      return
    }

    handleSave(newList)
    // setList(newList)
    setCurrentInput('')
  }

  const handleDelete = (idx) => {
    const update = list.filter((_, didx) => didx !== idx)
    handleSave(update)
    // setList(update)
  }

  return (
    <div>
      <div className="zp-flex">
        <div className="zp-flex-fill">
          <SlInput
            clearable
            size="small"
            help-text="Paste a link to save"
            onSlInput={handleInput}
            value={currentInput}
            placeholder="Something cool to reuse"
          />
        </div>
        <SlButton size="small" onClick={handelAdd}>
          Add
        </SlButton>
        <SlIconButton
          name="search-heart"
          label="Search"
          onClick={() => setIsSearching(!isSearching)}
        />
      </div>

      <SlAlert
        variant="danger"
        open={lengthError}
        closable
        onSlAfterHide={() => setlengthError(false)}
      >
        <SlIcon slot="icon" name="exclamation-octagon" />
        <strong>Cannot exceed your history length.</strong>
      </SlAlert>

      <div className="zp-search">
        {isSearching && (
          <div className="zp-mg-tp">
            <SlInput
              clearable
              size="small"
              onSlInput={(ev) => setSearchValue(ev.target.value)}
              value={searchValue}
              placeholder="Search your saved history"
            />
          </div>
        )}
      </div>

      <div className="zp-divider" />

      <div className={`zp-list ${showDates ? 'show-dates' : ''}`}>
        {filtered.length === 0 && (
          <SlAlert open>
            <SlIcon slot="icon" name="info-circle" />
            {isSearching ? (
              <>{'No results from search'}</>
            ) : (
              <>{'Start adding clipboards from the input above or Tray option. Enjoy.'}</>
            )}
          </SlAlert>
        )}

        {filtered.length > 0 &&
          filtered.map((l, idx) => {
            return (
              <div className="zp-flex zp-list-anchor" key={idx}>
                <div className="zp-flex-fill">
                  <div className="zp-list-info">
                    <div className={`zp-list-dot dot-${l.type}`} />
                    <div
                      className={`zp-list-text ${lineIsClamped ? 'zp-list-text--clamped' : ''}`}
                      title={l.text}
                    >
                      {l.text}
                    </div>
                  </div>
                  <div className="zp-ldate">{l.date}</div>
                </div>
                <div>
                  <SlIconButton name="trash2-fill" onClick={() => handleDelete(idx)} />
                  <SlCopyButton value={l.text} />
                </div>
              </div>
            )
          })}
      </div>
    </div>
  )
}
