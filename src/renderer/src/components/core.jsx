import { useState, useMemo } from 'react'
import { SlInput, SlButton, SlAlert, SlIcon, SlSelect, SlOption, SlBadge } from './shoelace'
import { searchConversion } from '../util/search'
import { itemTypeDetect, getDynamicListIcon, TYPE_OPTIONS } from '../util/item'
import { Items } from './items'

const ALL_TYPE = 'ALL'
const FAVORITE_TYPE = 'FAVORITE'

function debounce(func, timeout = 300) {
  let timer
  return (...args) => {
    clearTimeout(timer)
    timer = setTimeout(() => {
      func.apply(this, args)
    }, timeout)
  }
}

const Core = ({ data, saveData }) => {
  const [currentInput, setCurrentInput] = useState('')
  const [lengthError, setlengthError] = useState(false)
  const [isSearching, setIsSearching] = useState(false)
  const [searchValue, setSearchValue] = useState('')
  const [filterSearch, setFilterSearch] = useState(ALL_TYPE)
  const list = data.history || []
  const historyLength = data.ui.historyLength
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

  const handleSearchValue = debounce((ev) => setSearchValue(ev.target.value))

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
      saveData(update)
      return
    }

    saveData(newList)
    setCurrentInput('')
  }

  const handleSubmit = (ev) => {
    ev.preventDefault()
    handelAdd()
  }

  return (
    <>
      <div className="zp-item-handle">
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
            <SlButton
              name="search-heart"
              label="Search"
              size="small"
              type="submit"
              onClick={() => setIsSearching(!isSearching)}
            >
              <SlIcon name="search-heart" />
              {!isSearching && (filterSearch !== ALL_TYPE || searchValue) && (
                <SlBadge variant="warning" pill />
              )}
            </SlButton>
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
                    <SlOption value={ALL_TYPE}>
                      <SlIcon name="wallet-fill" slot="suffix" />
                      {ALL_TYPE}
                    </SlOption>
                    <SlOption value={FAVORITE_TYPE}>
                      <SlIcon name="suit-heart-fill" slot="suffix" />
                      {FAVORITE_TYPE}
                    </SlOption>
                    {TYPE_OPTIONS.map((type) => {
                      return (
                        <SlOption value={type} key={type}>
                          <SlIcon name={getDynamicListIcon(type)} slot="suffix" />
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
                    onSlInput={handleSearchValue}
                    value={searchValue}
                    placeholder="Search your history"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Item List */}
      <div id="zpCore" className="zp-core">
        <div className="zp-cinner">
          <Items data={data} list={filtered} handleSave={saveData} isSearching={isSearching} />
        </div>
      </div>
    </>
  )
}

export default Core
