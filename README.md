# AstroSistant

AstroSistant is a React dashboard for exploring astronauts currently in space and viewing health trends through interactive charts and status summaries.

> **Demo notice:** Astronaut names and spacecraft are retrieved from the Open Notify API. Health metrics are deterministic simulated examples inspired by typical microgravity trends; they are not real astronaut measurements and are not for medical use.

## Features

- Search astronauts by name or spacecraft and browse their profiles.
- View simulated bone and muscle density trends over a 180-day mission.
- Explore a 24-hour heart-rate chart and sleep-duration data for the last seven nights.
- Review concise status cards for bone density, muscle mass, heart rate, and sleep.
- Read the project presentation in [`AstroSistant_Sunum.pdf`](./AstroSistant_Sunum.pdf).

## Run locally

Requirements: Node.js and npm.

```bash
npm install
npm run dev
```

Vite prints the local development URL in the terminal.

## Checks

```bash
npm run lint
npm run build
```

## Tech stack

- React 19
- Vite
- JavaScript and CSS
