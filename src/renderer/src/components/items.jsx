import { useState, useMemo } from 'react'
import {
  SlInput,
  SlButton,
  SlCopyButton,
  SlIconButton,
  SlAlert,
  SlIcon,
  SlSelect,
  SlOption,
  SlTooltip
} from './shoelace'
import { searchConversion } from '../util/search'
import { itemTypeDetect, TYPE_OPTIONS } from '../util/item'

const ALL_TYPE = 'ALL'
const FAVORITE_TYPE = 'FAVORITE'

export const Items = ({ data, handleSave }) => {
  const [currentInput, setCurrentInput] = useState('')
  const [lengthError, setlengthError] = useState(false)
  const [isSearching, setIsSearching] = useState(false)
  const [searchValue, setSearchValue] = useState('')
  const [filterSearch, setFilterSearch] = useState(ALL_TYPE)
  const list = data.history || []
  const historyLength = data.ui.historyLength
  const lineIsClamped = data.ui.lineClamp
  const showDates = data.ui.showDates
  const showTypes = data.ui.showTypes
  const searchRule = data.ui.searchRule

  const filtered = useMemo(() => {
    let results = list
    if (filterSearch !== ALL_TYPE) {
      if (filterSearch === FAVORITE_TYPE) {
        results = results.filter((r) => r.isFavorite)
      } else {
        results = results.filter((r) => r.type === filterSearch)
      }
    }
    if (searchValue) {
      results = results.filter((l) => {
        const s = searchConversion(l.text, searchRule)
        return s.includes(searchValue)
      })
      return results
    } else {
      return results
    }
  }, [searchValue, filterSearch, data, list])

  const handleFilter = (ev) => {
    const val = ev.target.value
    setFilterSearch(val)
  }

  const handleInput = (ev) => {
    const val = ev.target.value
    setCurrentInput(val)
  }

  const handelAdd = () => {
    if (!currentInput) {
      return
    }

    const newEntry = itemTypeDetect(currentInput)
    const newList = [newEntry, ...list]
    if (newList.length > historyLength) {
      setlengthError(true)
      const update = newList.filter((_, idx) => idx < historyLength)
      handleSave(update)
      return
    }

    handleSave(newList)
    setCurrentInput('')
  }

  const handleDelete = (idx) => {
    const update = list.filter((_, didx) => didx !== idx)
    handleSave(update)
  }

  const handleFavorite = (idx, favoriteValue) => {
    const update = list.map((item, lidx) => {
      const isFavorite = lidx === idx ? favoriteValue : item.isFavorite
      return {
        ...item,
        isFavorite
      }
    })
    handleSave(update)
  }

  const handleMoveToTop = (idx) => {
    // Block just in case
    if (idx === 0) {
      return
    }

    const element = list.splice(idx, 1)[0]
    list.unshift(element)
    handleSave(list)
  }

  const handleSubmit = (ev) => {
    ev.preventDefault()
    handelAdd()
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
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
          <SlButton size="small" onClick={handelAdd} disabled={currentInput.length === 0}>
            Add
          </SlButton>
          <SlIconButton
            name="search-heart"
            label="Search"
            type="submit"
            onClick={() => setIsSearching(!isSearching)}
          />
        </div>
      </form>

      <SlAlert
        variant="danger"
        open={lengthError}
        closable
        onSlAfterHide={() => setlengthError(false)}
      >
        <SlIcon slot="icon" name="exclamation-octagon" />
        <strong>History length.</strong>
        <p>The last item(s) have been removed.</p>
      </SlAlert>

      <div className="zp-search">
        {isSearching && (
          <div className="zp-mg-tp">
            <div className="zp-flex">
              <div className="zp-flex-fill">
                <SlSelect
                  label="Filter Type"
                  size="small"
                  value={filterSearch}
                  onSlChange={handleFilter}
                >
                  <SlOption value={ALL_TYPE}>{ALL_TYPE}</SlOption>
                  <SlOption value={FAVORITE_TYPE}>{FAVORITE_TYPE}</SlOption>
                  {TYPE_OPTIONS.map((type) => {
                    return (
                      <SlOption value={type} key={type}>
                        {type}
                      </SlOption>
                    )
                  })}
                </SlSelect>
              </div>
              <div className="zp-flex-fill">
                <SlInput
                  label="Search History"
                  clearable
                  size="small"
                  onSlInput={(ev) => setSearchValue(ev.target.value)}
                  value={searchValue}
                  placeholder="Search your history"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="zp-divider" />

      <div className={`zp-list ${showDates ? 'show-dates' : ''} ${showTypes ? 'show-types' : ''}`}>
        {filtered.length === 0 && (
          <SlAlert open>
            <SlIcon slot="icon" name="info-circle" />
            {isSearching ? (
              <>{'No results from search'}</>
            ) : (
              <>{'Start adding Zipboards from the input or Tray option. Enjoy.'}</>
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
                  <div className="zp-addon zp-date">{l.date}</div>
                  <div className="zp-addon zp-type">{l.type}</div>
                </div>
                <div>
                  <div>
                    <SlIconButton
                      name={`${l.isFavorite ? 'suit-heart-fill' : 'suit-heart'}`}
                      onClick={() => {
                        const isFavorite = l.isFavorite ? false : true
                        handleFavorite(idx, isFavorite)
                      }}
                    />
                    <SlCopyButton value={l.text} />
                  </div>
                  <div className="zp-fav-action">
                    <SlTooltip content="Move to top">
                      <SlIconButton
                        name="arrow-up-short"
                        label="Move to Top"
                        onClick={() => handleMoveToTop(idx)}
                        disabled={idx === 0}
                      />
                    </SlTooltip>
                    <SlIconButton name="trash2-fill" onClick={() => handleDelete(idx)} />
                  </div>
                </div>
              </div>
            )
          })}
      </div>
    </div>
  )
}
