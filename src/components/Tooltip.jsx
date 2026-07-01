export default function Tooltip({ text, children }) {
  return (
    <span className="tooltip-wrapper" data-tooltip={text}>
      {children}
    </span>
  )
}