// Open Notify only serves over plain HTTP (its HTTPS endpoint has no valid certificate).
const ASTROS_URL = 'http://api.open-notify.org/astros.json'

export async function fetchAstronauts() {
  const response = await fetch(ASTROS_URL)
  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`)
  }
  const data = await response.json()
  return data.people
}
