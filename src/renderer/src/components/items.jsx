import { useState } from 'react'
import { SlInput, SlButton, SlCopyButton, SlIconButton } from './shoelace'

export const Items = ({ data, handleSave }) => {
  const [currentInput, setCurrentInput] = useState('')
  const [list, setList] = useState(data.history || [])
  const lineIsClamped = data.ui.lineClamp

  const handleInput = (ev) => {
    const val = ev.target.value
    setCurrentInput(val)
  }

  const handelAdd = () => {
    setList((prev) => {
      const newList = [...prev, currentInput]
      // handleSave(newList)
      return newList
    })
    setCurrentInput('')
  }

  const handleDelete = (idx) => {
    const update = list.filter((_, didx) => didx !== idx)
    // handleSave(update)
    setList(update)
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
          />
        </div>
        <SlButton size="small" onClick={handelAdd}>
          Add
        </SlButton>
      </div>

      <div className="zp-divider" />

      <div className="zp-list">
        {list.map((l, idx) => {
          return (
            <div className="zp-flex zp-list-anchor" key={idx}>
              <div className="zp-flex-fill">
                <div className="zp-list-info">
                  <div className="zp-list-dot" />
                  <div
                    className={`zp-list-text ${lineIsClamped ? 'zp-list-text--clamped' : ''}`}
                    title={l}
                  >
                    {l}
                  </div>
                </div>
              </div>
              <div>
                <SlIconButton name="trash2-fill" onClick={() => handleDelete(idx)} />
                <SlCopyButton value={l} />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
