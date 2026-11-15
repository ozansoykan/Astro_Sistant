import { useState } from 'react'
import './HealthAnimation.css'
import {
  BODY_PATH,
  BONES,
  HEAD,
  HEART,
  MUSCLES,
  ORGANS,
  VIEW_H,
  VIEW_W,
} from './anatomy'

const MIRROR = `matrix(-1 0 0 1 ${VIEW_W} 0)`

function Shapes({ set }) {
  if (!set) return null
  return (
    <>
      {set.fills?.map((d, i) => (
        <path key={`f${i}`} className="part-fill" d={d} />
      ))}
      {set.holes?.map((d, i) => (
        <path key={`h${i}`} className="part-hole" d={d} />
      ))}
      {set.tubes?.map(([d, w], i) => (
        <path key={`t${i}`} className="part-tube" d={d} strokeWidth={w} />
      ))}
      {set.strokes?.map(([d, w], i) => (
        <path key={`s${i}`} className="part-stroke" d={d} strokeWidth={w} />
      ))}
      {set.circles?.map(([cx, cy, r], i) => (
        <circle key={`c${i}`} className="part-fill" cx={cx} cy={cy} r={r} />
      ))}
      {set.details?.map((d, i) => (
        <path key={`d${i}`} className="part-detail" d={d} />
      ))}
    </>
  )
}

function Part({ part, index, active, onActivate }) {
  return (
    <g
      className={`part part-${part.key}${active ? ' is-active' : ''}`}
      style={{ '--part': part.color, '--i': index }}
      tabIndex={0}
      role="button"
      aria-label={part.name}
      onMouseEnter={() => onActivate(part.key)}
      onMouseLeave={() => onActivate(null)}
      onFocus={() => onActivate(part.key)}
      onBlur={() => onActivate(null)}
      onClick={() => onActivate(part.key)}
    >
      <title>{part.name}</title>
      <Shapes set={part.side} />
      {part.side && (
        <g transform={MIRROR}>
          <Shapes set={part.side} />
        </g>
      )}
      <Shapes set={part.center} />
    </g>
  )
}

const VIEWS = [
  { key: 'organs', label: 'Organs', parts: ORGANS },
  { key: 'muscles', label: 'Muscles', parts: MUSCLES },
  { key: 'skeleton', label: 'Skeleton', parts: BONES },
]

function HealthAnimation({ bpm, muscle, bone }) {
  const [view, setView] = useState('organs')
  const [activeKey, setActiveKey] = useState(null)

  const beat = `${(60 / bpm).toFixed(2)}s`
  const current = VIEWS.find((v) => v.key === view)
  const activePart = current.parts.find((p) => p.key === activeKey)

  const switchView = (key) => {
    setView(key)
    setActiveKey(null)
  }

  const summary = {
    organs: `Heart beating at ${bpm} bpm. Hover or tap an organ to see how space affects it.`,
    muscles: `Muscle mass is at ${muscle}% of pre-flight level. Hover or tap a muscle group.`,
    skeleton: `Bone density is at ${bone}% of pre-flight level. Hover or tap a bone.`,
  }

  let info
  if (view === 'organs' && activeKey === 'heart') {
    info = (
      <>
        <strong>Heart</strong> — Beating at {bpm} bpm. With less work against gravity, the heart can shrink slightly and become rounder.
      </>
    )
  } else if (activePart) {
    info = (
      <>
        <strong>{activePart.name}</strong> — {activePart.info}
      </>
    )
  } else {
    info = <span className="anat-hint">{summary[view]}</span>
  }

  return (
    <div className={`health-anim view-${view}`} style={{ '--beat': beat }}>
      <div className="anat-head">
        <h3 className="panel-title">Body scan</h3>
        <div className="anat-tabs" role="group" aria-label="Body layer">
          {VIEWS.map((v) => (
            <button
              key={v.key}
              type="button"
              className="anat-tab"
              aria-pressed={view === v.key}
              onClick={() => switchView(v.key)}
            >
              {v.label}
            </button>
          ))}
        </div>
      </div>

      <svg
        className="body-figure"
        viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
        role="group"
        aria-label={`Human body, ${current.label.toLowerCase()} view`}
      >
        <defs>
          <radialGradient id="body-glow" cx="50%" cy="42%" r="58%">
            <stop offset="0%" stopColor="#6ea8ff" stopOpacity="0.22" />
            <stop offset="100%" stopColor="#6ea8ff" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="scan-beam" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#6ea8ff" stopOpacity="0" />
            <stop offset="85%" stopColor="#6ea8ff" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#bcd6ff" stopOpacity="0.9" />
          </linearGradient>
          <clipPath id="body-clip">
            <path d={BODY_PATH} />
            <ellipse cx={HEAD.cx} cy={HEAD.cy} rx={HEAD.rx} ry={HEAD.ry} />
          </clipPath>
        </defs>

        <ellipse cx="120" cy="240" rx="118" ry="236" fill="url(#body-glow)" />

        <g className="body-breath">
          <path className="body-shell" d={BODY_PATH} />
          <ellipse className="body-shell" cx={HEAD.cx} cy={HEAD.cy} rx={HEAD.rx} ry={HEAD.ry} />

          {view === 'organs' && <path className="diaphragm" d="M80 190 Q120 178 160 190" />}

          <g className="layer" key={view}>
            {current.parts.map((part, i) => (
              <Part
                key={part.key}
                part={part}
                index={i}
                active={activeKey === part.key}
                onActivate={setActiveKey}
              />
            ))}
          </g>

          {view === 'organs' && (
            <g transform={`translate(${HEART.x} ${HEART.y})`}>
              <g
                className={`part part-heart${activeKey === 'heart' ? ' is-active' : ''}`}
                style={{ '--part': '#e66767' }}
                tabIndex={0}
                role="button"
                aria-label="Heart"
                onMouseEnter={() => setActiveKey('heart')}
                onMouseLeave={() => setActiveKey(null)}
                onFocus={() => setActiveKey('heart')}
                onBlur={() => setActiveKey(null)}
                onClick={() => setActiveKey('heart')}
              >
                <title>Heart</title>
                <circle className="heart-ring" r="12" />
                <path className="heart-shape" d={HEART.path} />
              </g>
            </g>
          )}
        </g>

        {view === 'skeleton' && (
          <g clipPath="url(#body-clip)" aria-hidden="true">
            <rect className="scan-beam" x="0" y="-60" width={VIEW_W} height="60" fill="url(#scan-beam)" />
          </g>
        )}
      </svg>

      <div className="anat-info" aria-live="polite">
        {info}
      </div>

      <svg className="ecg" viewBox="0 0 300 50" aria-hidden="true" preserveAspectRatio="none">
        <path
          className="ecg-line"
          d="M0 25 L40 25 L48 18 L56 25 L66 25 L72 5 L80 45 L86 25 L100 25 L110 20 L120 25 L150 25 L190 25 L198 18 L206 25 L216 25 L222 5 L230 45 L236 25 L250 25 L260 20 L270 25 L300 25"
        />
      </svg>

      <div className="health-bpm">
        <span className="health-bpm-value">{bpm}</span>
        <span className="health-bpm-unit">bpm · current</span>
      </div>
    </div>
  )
}

export default HealthAnimation
