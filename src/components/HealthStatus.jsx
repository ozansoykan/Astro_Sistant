import './HealthStatus.css'

const LEVELS = {
  good: { label: 'Normal', icon: '✓' },
  warning: { label: 'Watch', icon: '!' },
  serious: { label: 'At risk', icon: '▲' },
}

function HealthStatus({ items }) {
  return (
    <div className="health-status">
      <h3 className="panel-title">Health status</h3>
      <ul className="status-list">
        {items.map((item) => {
          const level = LEVELS[item.level]
          return (
            <li key={item.key} className={`status-card status-${item.level}`}>
              <div className="status-card-head">
                <span className="status-card-title">{item.title}</span>
                <span className="status-badge">
                  <span className="status-icon" aria-hidden="true">{level.icon}</span>
                  {level.label}
                </span>
              </div>
              <div className="status-card-value">{item.value}</div>
              <p className="status-card-text">{item.text}</p>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

export default HealthStatus
