export default function PageTitle({ title, subtitle }) {
  return (
    <div className="page-title">
      <div>
        <h2>{title}</h2>
        {subtitle ? <p>{subtitle}</p> : null}
      </div>
    </div>
  )
}
