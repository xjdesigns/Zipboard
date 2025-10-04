import { useState } from 'react'
import { SlCopyButton, SlIconButton, SlAlert, SlIcon, SlTooltip } from './shoelace'
import { EditDialog } from './edit-dialog'

export const Items = ({ data, list, handleSave, isSearching }) => {
  const [openedPanel, setOpenedPanel] = useState(null)
  const lineIsClamped = data.ui.lineClamp
  const showDates = data.ui.showDates
  const showTypes = data.ui.showTypes
  const stackActions = data.ui.stackActions ?? false

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

  const handleOpenPanel = (idx) => {
    setOpenedPanel(idx)
  }

  return (
    <div>
      <div className={`zp-list ${showDates ? 'show-dates' : ''} ${showTypes ? 'show-types' : ''}`}>
        {list.length === 0 && (
          <SlAlert open>
            <SlIcon slot="icon" name="info-circle" />
            {isSearching ? (
              <>{'No results from search'}</>
            ) : (
              <>{'Start adding Zipboards from the input or Tray option. Enjoy.'}</>
            )}
          </SlAlert>
        )}

        {list.length > 0 &&
          list.map((l, idx) => {
            return (
              <div
                className={`zp-flex zp-list-anchor ${stackActions ? 'zp-list-stacked' : ''}`}
                key={idx}
              >
                <div className="zp-flex-fill">
                  <div className="zp-list-info">
                    <SlTooltip
                      content={l.tooltip}
                      trigger="click"
                      placement="left"
                      disabled={!l.tooltip}
                    >
                      <div className={`zp-list-dot dot-${l.type}`} />
                      <div
                        className={`zp-list-text ${lineIsClamped ? 'zp-list-text--clamped' : ''}`}
                        title={l.text}
                      >
                        {l.text}
                      </div>
                    </SlTooltip>
                  </div>
                  <div className="zp-addon zp-date">{l.date}</div>
                  <div className="zp-addon zp-type">{l.type}</div>
                </div>
                <div className="zp-fav-btns">
                  <div className="zp-fav-copy">
                    <SlIconButton
                      className="zp-fav-btn"
                      name={`${l.isFavorite ? 'suit-heart-fill' : 'suit-heart'}`}
                      onClick={() => {
                        const isFavorite = l.isFavorite ? false : true
                        handleFavorite(idx, isFavorite)
                      }}
                    />
                    <SlCopyButton value={l.text} className="zp-copy-btn" />
                  </div>
                  <div className="zp-fav-action">
                    <SlIconButton
                      name="pencil-fill"
                      label="Open Panel"
                      onClick={() => handleOpenPanel(idx)}
                    />
                    <SlIconButton name="trash2-fill" onClick={() => handleDelete(idx)} />
                  </div>
                </div>
              </div>
            )
          })}
        {openedPanel !== null && (
          <EditDialog
            isOpen={openedPanel !== null}
            list={list}
            editData={list[openedPanel]}
            currentIndex={openedPanel}
            positionMove={list?.length}
            closeEdit={() => handleOpenPanel(null)}
            handleSave={handleSave}
          />
        )}
      </div>
    </div>
  )
}
