import { Items } from './items'

const Core = ({ data, saveData }) => {
  return (
    <div className="zp-core">
      <div className="zp-cinner">
        <Items data={data} handleSave={saveData} />
      </div>
    </div>
  )
}

export default Core
