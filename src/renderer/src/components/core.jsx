import { Items } from './items'

const Core = ({ data, saveData }) => {
  return (
    <div id="zpCore" className="zp-core">
      <div className="zp-cinner">
        <Items data={data} handleSave={saveData} />
      </div>
    </div>
  )
}

export default Core
