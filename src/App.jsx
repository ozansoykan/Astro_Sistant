import { useState, useEffect } from 'react'
import './App.css'
import Header from './components/Header'
import Footer from './components/Footer'
import HealthAnimation from './components/HealthAnimation'
import HealthCharts from './components/HealthCharts'
import HealthStatus from './components/HealthStatus'
import { fetchAstronauts } from './services/api'
import { getHealthData, getHealthStatus } from './services/health'

function App() {
  const [astronauts, setAstronauts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [search, setSearch] = useState('')
  const [index, setIndex] = useState(0)

  const handleSearchChange = (value) => {
    setSearch(value)
    setIndex(0)
  }

  useEffect(() => {
    const getAstronauts = async () => {
      try {
        const data = await fetchAstronauts()
        setAstronauts(data)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    getAstronauts()
  }, [])

  const query = search.trim().toLowerCase()
  const filtered = astronauts.filter(
    (a) =>
      a.name.toLowerCase().includes(query) ||
      a.craft.toLowerCase().includes(query),
  )

  const current = Math.max(0, Math.min(index, filtered.length - 1))
  const person = loading || error ? null : filtered[current]

  let sidebar
  if (loading) {
    sidebar = <div className="status">Loading...</div>
  } else if (error) {
    sidebar = <div className="status error">Error: {error}</div>
  } else if (!person) {
    sidebar = <div className="status">No astronauts match "{search}"</div>
  } else {
    const initials = person.name
      .split(' ')
      .map((part) => part[0])
      .join('')
      .slice(0, 2)
      .toUpperCase()

    sidebar = (
      <article className="profile">
        <div className="profile-avatar" aria-hidden="true">{initials}</div>
        <h2 className="profile-name">{person.name}</h2>
        <dl className="profile-data">
          <dt>Craft</dt>
          <dd>{person.craft}</dd>
          <dt>Status</dt>
          <dd>In space</dd>
        </dl>

        {filtered.length > 1 && (
          <div className="profile-nav">
            <button
              type="button"
              onClick={() => setIndex(current - 1)}
              disabled={current === 0}
              aria-label="Previous astronaut"
            >
              ←
            </button>
            <span>
              {current + 1} / {filtered.length}
            </span>
            <button
              type="button"
              onClick={() => setIndex(current + 1)}
              disabled={current === filtered.length - 1}
              aria-label="Next astronaut"
            >
              →
            </button>
          </div>
        )}
      </article>
    )
  }

  let content
  if (person) {
    const health = getHealthData(person.name)
    const hourSlot = Math.floor(new Date().getHours() / 2)
    const bpm = health.heartRate[hourSlot].bpm
    const latest = health.density[health.density.length - 1]

    content = (
      <>
        <div className="content-panel content-left">
          <HealthAnimation bpm={bpm} muscle={latest.muscle} bone={latest.bone} />
        </div>
        <div className="content-panel content-right">
          <HealthCharts data={health} />
        </div>
        <div className="content-panel content-bottom">
          <HealthStatus items={getHealthStatus(health)} />
        </div>
      </>
    )
  } else {
    content = (
      <div className="content-panel content-empty">
        Select an astronaut to see health data
      </div>
    )
  }

  return (
    <>
      <Header search={search} onSearchChange={handleSearchChange} />
      <main className="layout">
        <aside className="sidebar">
          <h1>Astronauts in Space</h1>
          {sidebar}
        </aside>
        <section className="content">{content}</section>
      </main>
      <Footer />
    </>
  )
}

export default App
