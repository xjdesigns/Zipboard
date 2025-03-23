export const Footer = ({ data }) => {
  return (
    <div className="zp-footer">
      <div className="zp-text-small">Created by Jason Jacobson</div>
      <div className="zp-text-small">History: {data.history.length}</div>
    </div>
  )
}
