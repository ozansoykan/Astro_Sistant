import LineChart from './LineChart'
import './HealthCharts.css'

const COLORS = {
  muscle: '#3987e5',
  bone: '#d95926',
  heart: '#e66767',
  sleep: '#9085e9',
}

function HealthCharts({ data }) {
  return (
    <div className="health-charts">
      <h3 className="panel-title">Health data</h3>

      <LineChart
        title="Muscle & bone density (% of baseline)"
        data={data.density}
        xKey="day"
        formatX={(d) => `D${d}`}
        series={[
          { key: 'muscle', label: 'Muscle', color: COLORS.muscle },
          { key: 'bone', label: 'Bone', color: COLORS.bone },
        ]}
        domain={[84, 101]}
        ticks={[85, 90, 95, 100]}
        unit="%"
      />

      <LineChart
        title="Heart rate over 24 h (bpm)"
        data={data.heartRate}
        xKey="hour"
        formatX={(h) => `${String(h).padStart(2, '0')}:00`}
        series={[{ key: 'bpm', label: 'Heart rate', color: COLORS.heart }]}
        domain={[40, 130]}
        ticks={[40, 70, 100, 130]}
        unit=" bpm"
      />

      <LineChart
        title="Sleep, last 7 nights (hours)"
        data={data.sleep}
        xKey="night"
        formatX={(n) => `N${n}`}
        series={[{ key: 'hours', label: 'Sleep', color: COLORS.sleep }]}
        domain={[4, 9]}
        ticks={[4, 6, 8]}
        unit=" h"
      />

      <p className="health-note">Simulated data based on typical microgravity effects.</p>
    </div>
  )
}

export default HealthCharts
