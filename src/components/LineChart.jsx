import { useState } from 'react'

const WIDTH = 320
const HEIGHT = 130
const PAD = { top: 10, right: 44, bottom: 20, left: 32 }

function LineChart({ title, data, xKey, formatX, series, domain, ticks, unit }) {
  const [active, setActive] = useState(null)
  const [min, max] = domain
  const innerW = WIDTH - PAD.left - PAD.right
  const innerH = HEIGHT - PAD.top - PAD.bottom

  const x = (i) => PAD.left + (i / (data.length - 1)) * innerW
  const y = (v) => PAD.top + (1 - (v - min) / (max - min)) * innerH

  const handleMove = (event) => {
    const rect = event.currentTarget.getBoundingClientRect()
    const px = ((event.clientX - rect.left) / rect.width) * WIDTH
    const i = Math.round(((px - PAD.left) / innerW) * (data.length - 1))
    setActive(Math.max(0, Math.min(data.length - 1, i)))
  }

  const lastIndex = data.length - 1
  const activePoint = active === null ? null : data[active]

  // End labels: keep at least 11px apart so close values don't overlap.
  const labelY = {}
  series
    .map((s) => ({ key: s.key, y: y(data[lastIndex][s.key]) }))
    .sort((a, b) => a.y - b.y)
    .forEach((item, i, list) => {
      const prev = i > 0 ? labelY[list[i - 1].key] : -Infinity
      labelY[item.key] = Math.max(item.y, prev + 11)
    })

  return (
    <figure className="chart">
      <figcaption className="chart-head">
        <span className="chart-title">{title}</span>
        {series.length > 1 && (
          <span className="chart-legend">
            {series.map((s) => (
              <span key={s.key} className="chart-legend-item">
                <span className="chart-swatch" style={{ background: s.color }} />
                {s.label}
              </span>
            ))}
          </span>
        )}
      </figcaption>

      <div className="chart-body">
        <svg
          viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
          className="chart-svg"
          onMouseMove={handleMove}
          onMouseLeave={() => setActive(null)}
          role="img"
          aria-label={title}
        >
          {ticks.map((t) => (
            <g key={t}>
              <line className="chart-grid" x1={PAD.left} x2={WIDTH - PAD.right} y1={y(t)} y2={y(t)} />
              <text className="chart-axis" x={PAD.left - 6} y={y(t)} dy="0.32em" textAnchor="end">
                {t}
              </text>
            </g>
          ))}

          {data.map((d, i) =>
            i % 2 === 0 || data.length <= 7 ? (
              <text key={i} className="chart-axis" x={x(i)} y={HEIGHT - 4} textAnchor="middle">
                {formatX(d[xKey])}
              </text>
            ) : null,
          )}

          {active !== null && (
            <line className="chart-crosshair" x1={x(active)} x2={x(active)} y1={PAD.top} y2={PAD.top + innerH} />
          )}

          {series.map((s) => (
            <g key={s.key}>
              <polyline
                className="chart-line"
                stroke={s.color}
                points={data.map((d, i) => `${x(i)},${y(d[s.key])}`).join(' ')}
              />
              <circle className="chart-end" cx={x(lastIndex)} cy={y(data[lastIndex][s.key])} r="4" fill={s.color} />
              <text className="chart-label" x={x(lastIndex) + 8} y={labelY[s.key]} dy="0.32em">
                {data[lastIndex][s.key]}
              </text>
              {active !== null && (
                <circle className="chart-dot" cx={x(active)} cy={y(data[active][s.key])} r="4" fill={s.color} />
              )}
            </g>
          ))}
        </svg>

        {activePoint && (
          <div
            className="chart-tooltip"
            style={{
              left: `${(x(active) / WIDTH) * 100}%`,
              transform: active > data.length / 2 ? 'translateX(calc(-100% - 10px))' : 'translateX(10px)',
            }}
          >
            <div className="chart-tooltip-x">{formatX(activePoint[xKey])}</div>
            {series.map((s) => (
              <div key={s.key} className="chart-tooltip-row">
                <span className="chart-swatch" style={{ background: s.color }} />
                {s.label}
                <strong>
                  {activePoint[s.key]}
                  {unit}
                </strong>
              </div>
            ))}
          </div>
        )}
      </div>
    </figure>
  )
}

export default LineChart
