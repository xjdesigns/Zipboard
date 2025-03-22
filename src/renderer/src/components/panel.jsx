import { useState } from 'react'
import { SlIconButton } from './shoelace'

// eslint-disable-next-line react/prop-types
const Panel = ({ title = '', open = false, children }) => {
  const [isOpen, setIsOpen] = useState(open)

  return (
    <div className={`xble-panel ${isOpen ? 'is-open' : ''}`}>
      <div className="xble-phead">
        <div className="xble-phead-title">{title}</div>
        <div className="xble-phead-action">
          <SlIconButton name="chevron-right" label="panel" onClick={() => setIsOpen(!isOpen)} />
        </div>
      </div>

      <div className="xble-pbody">{children}</div>
    </div>
  )
}

export default Panel
