// Simulated astronaut health data.
// Open Notify only returns names and crafts, so values are generated from
// published microgravity trends and seeded by the astronaut's name: the same
// person always gets the same numbers.

function hashString(text) {
  let hash = 2166136261
  for (let i = 0; i < text.length; i++) {
    hash ^= text.charCodeAt(i)
    hash = Math.imul(hash, 16777619)
  }
  return hash >>> 0
}

function createRandom(seed) {
  let state = seed
  return () => {
    state = (state + 0x6d2b79f5) | 0
    let t = Math.imul(state ^ (state >>> 15), 1 | state)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

const round = (value, digits = 1) => Number(value.toFixed(digits))

export function getHealthData(name) {
  const random = createRandom(hashString(name))
  const between = (min, max) => min + random() * (max - min)

  // Bone & muscle density over a 180-day mission, % of pre-flight baseline.
  // Weight-bearing bone loses ~1–1.5% per month; muscle loss slows with exercise.
  const boneRate = between(0.9, 1.6)
  const muscleLoss = between(5, 13)
  const missionDays = Array.from({ length: 13 }, (_, i) => i * 15)
  const density = missionDays.map((day) => ({
    day,
    bone: round(100 - (day / 30) * boneRate + between(-0.3, 0.3)),
    muscle: round(
      100 - muscleLoss * (1 - Math.exp(-day / 60)) + between(-0.4, 0.4),
    ),
  }))
  density[0] = { day: 0, bone: 100, muscle: 100 }

  // Heart rate over one day, every 2 hours (sleep 22:00–06:00, exercise at 14:00).
  const restingRate = between(52, 66)
  const heartRate = Array.from({ length: 12 }, (_, i) => {
    const hour = i * 2
    let bpm
    if (hour < 6 || hour >= 22) bpm = restingRate + between(-3, 2)
    else if (hour === 14) bpm = between(105, 125)
    else bpm = restingRate + between(10, 20)
    return { hour, bpm: Math.round(bpm) }
  })

  // Sleep over the last 7 nights, in hours.
  const sleepBase = between(5.6, 7.2)
  const sleep = Array.from({ length: 7 }, (_, i) => ({
    night: i + 1,
    hours: round(Math.min(8.5, Math.max(4.5, sleepBase + between(-0.8, 0.8)))),
  }))

  return { density, heartRate, sleep }
}

const average = (values) =>
  values.reduce((sum, value) => sum + value, 0) / values.length

function byThresholds(value, good, warning) {
  if (value <= good) return 'good'
  if (value <= warning) return 'warning'
  return 'serious'
}

export function getHealthStatus(data) {
  const last = data.density[data.density.length - 1]
  const boneLoss = round(100 - last.bone)
  const muscleLoss = round(100 - last.muscle)
  const bpms = data.heartRate.map((p) => p.bpm)
  const resting = Math.min(...bpms)
  const peak = Math.max(...bpms)
  const sleepAvg = round(average(data.sleep.map((n) => n.hours)))

  let heartLevel = 'good'
  if (resting > 80 || peak > 140) heartLevel = 'serious'
  else if (resting > 70 || peak > 125) heartLevel = 'warning'

  let sleepLevel = 'good'
  if (sleepAvg < 6) sleepLevel = 'serious'
  else if (sleepAvg < 7) sleepLevel = 'warning'

  return [
    {
      key: 'bone',
      title: 'Bone density',
      value: `−${boneLoss}%`,
      level: byThresholds(boneLoss, 5, 10),
      text:
        boneLoss <= 5
          ? 'Bone loss is within the expected range. Resistance training is keeping the skeleton loaded.'
          : 'Bone loss is above 5%. Without gravity the hips and spine lose mineral fastest; increase resistance exercise and calcium/vitamin D intake.',
    },
    {
      key: 'muscle',
      title: 'Muscle mass',
      value: `−${muscleLoss}%`,
      level: byThresholds(muscleLoss, 5, 10),
      text:
        muscleLoss <= 5
          ? 'Muscle mass is well preserved. The daily exercise routine is working.'
          : 'Leg and back muscles are shrinking because they no longer carry body weight. More treadmill and ARED sessions are recommended.',
    },
    {
      key: 'heart',
      title: 'Heart rhythm',
      value: `${resting}–${peak} bpm`,
      level: heartLevel,
      text:
        heartLevel === 'good'
          ? 'Resting rate and exercise peak are both normal. The heart is adapting to fluid shifting toward the upper body.'
          : 'Heart rate is higher than ideal. Monitor hydration and stress, and check for rhythm irregularities.',
    },
    {
      key: 'sleep',
      title: 'Sleep',
      value: `${sleepAvg} h / night`,
      level: sleepLevel,
      text:
        sleepLevel === 'good'
          ? 'Sleep duration meets the 7-hour target.'
          : 'Sleep is under the 7-hour target. A sunrise every 90 minutes disrupts the body clock; keep a fixed schedule and dim lights before rest.',
    },
  ]
}
