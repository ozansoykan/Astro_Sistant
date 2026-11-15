// Anatomy drawing data for HealthAnimation (viewBox 0 0 240 480, centre line x = 120).
// `side` shapes are drawn on the viewer's left and mirrored to the right;
// `center` shapes are drawn once.

export const VIEW_W = 240
export const VIEW_H = 480

// Left half of the body outline, from the neck down to the centre between the legs.
const START = [108, 70]
const LEFT_SEGMENTS = [
  [108, 86, 104, 94, 96, 98],
  [82, 102, 68, 104, 62, 114],
  [55, 126, 53, 144, 51, 164],
  [49, 192, 45, 222, 41, 252],
  [39, 268, 37, 282, 35, 296],
  [32, 310, 38, 320, 45, 313],
  [49, 302, 51, 290, 53, 278],
  [58, 244, 62, 212, 66, 182],
  [68, 162, 71, 148, 74, 138],
  [78, 168, 81, 196, 83, 214],
  [81, 236, 76, 252, 78, 272],
  [80, 322, 84, 370, 88, 410],
  [90, 430, 92, 446, 92, 458],
  [84, 466, 82, 476, 94, 476],
  [102, 476, 108, 476, 111, 472],
  [113, 464, 111, 456, 110, 448],
  [110, 410, 112, 362, 114, 330],
  [116, 306, 117, 292, 120, 284],
]

const mx = (x) => VIEW_W - x

function buildOutline() {
  const points = [START, ...LEFT_SEGMENTS.map((s) => [s[4], s[5]])]
  let d = `M${START[0]} ${START[1]}`
  for (const [c1x, c1y, c2x, c2y, x, y] of LEFT_SEGMENTS) {
    d += ` C${c1x} ${c1y} ${c2x} ${c2y} ${x} ${y}`
  }
  for (let i = LEFT_SEGMENTS.length - 1; i >= 0; i--) {
    const [c1x, c1y, c2x, c2y] = LEFT_SEGMENTS[i]
    const [px, py] = points[i]
    d += ` C${mx(c2x)} ${c2y} ${mx(c1x)} ${c1y} ${mx(px)} ${py}`
  }
  return `${d} Z`
}

export const BODY_PATH = buildOutline()
export const HEAD = { cx: 120, cy: 46, rx: 26, ry: 31 }

// ---------------------------------------------------------------- organs

export const ORGANS = [
  {
    key: 'brain',
    name: 'Brain',
    color: '#e87ba4',
    info: 'Fluid shifts toward the head in microgravity, raising pressure around the brain and eyes.',
    center: {
      fills: ['M102 42 C102 28 110 21 120 21 C130 21 138 28 138 42 C138 54 130 61 120 61 C110 61 102 54 102 42 Z'],
      details: [
        'M120 22 L120 60',
        'M106 34 Q112 36 110 42 Q108 48 114 50',
        'M134 34 Q128 36 130 42 Q132 48 126 50',
        'M108 54 Q113 52 116 56',
        'M132 54 Q127 52 124 56',
      ],
    },
  },
  {
    key: 'trachea',
    name: 'Trachea',
    color: '#9ec5f4',
    info: 'Carries air to the lungs. Cabin CO₂ is watched closely because exhaled air does not rise away without gravity.',
    center: {
      fills: ['M116 80 L124 80 L124 124 L116 124 Z'],
      details: ['M116 88 L124 88', 'M116 96 L124 96', 'M116 104 L124 104', 'M116 112 L124 112'],
    },
  },
  {
    key: 'lungs',
    name: 'Lungs',
    color: '#5598e7',
    info: 'Without gravity, blood and air spread more evenly through the lungs, so gas exchange stays efficient.',
    side: {
      fills: ['M114 122 C100 114 88 120 84 136 C80 154 80 170 84 186 C94 192 106 188 114 182 Z'],
      details: ['M114 130 C104 140 96 152 90 166', 'M106 150 L96 160'],
    },
  },
  {
    key: 'liver',
    name: 'Liver',
    color: '#b5653a',
    info: 'Processes nutrients and medication. Its metabolism shifts on long missions.',
    center: {
      fills: ['M82 198 C100 188 118 190 130 196 C128 208 116 216 102 218 C90 220 82 214 80 206 Z'],
    },
  },
  {
    key: 'spleen',
    name: 'Spleen',
    color: '#9085e9',
    info: 'Filters old red blood cells. Astronauts break down more red cells in space ("space anemia").',
    center: {
      fills: ['M150 194 C158 194 160 206 155 214 C150 210 148 200 150 194 Z'],
    },
  },
  {
    key: 'stomach',
    name: 'Stomach',
    color: '#eb8f5a',
    info: 'Food and fluid float inside the stomach, so fullness signals and digestion feel different.',
    center: {
      fills: ['M130 194 C144 188 152 196 152 208 C152 220 142 226 133 224 C126 222 123 217 125 213 C132 213 137 207 135 201 C134 198 132 196 130 194 Z'],
    },
  },
  {
    key: 'large-intestine',
    name: 'Large intestine',
    color: '#c98a52',
    info: 'Absorbs water. The gut bacteria mix changes during spaceflight.',
    center: {
      tubes: [['M98 262 L98 240 Q98 234 104 234 L136 234 Q142 234 142 240 L142 258 Q142 264 136 264 L124 264', 7]],
    },
  },
  {
    key: 'small-intestine',
    name: 'Small intestine',
    color: '#e8b88a',
    info: 'Absorbs most nutrients. Food is moved by muscle waves, so digestion works without gravity.',
    center: {
      tubes: [['M108 244 Q114 240 120 244 Q126 248 132 244 M132 244 Q132 250 126 251 Q120 252 114 251 Q108 252 108 257 Q110 260 116 259', 3.5]],
    },
  },
  {
    key: 'kidneys',
    name: 'Kidneys',
    color: '#c4505a',
    info: 'Calcium released from bones passes through the kidneys, raising the risk of kidney stones.',
    side: {
      fills: ['M90 216 C82 216 80 226 82 234 C84 242 92 242 94 236 C92 232 92 226 95 222 C95 218 93 216 90 216 Z'],
    },
  },
  {
    key: 'pancreas',
    name: 'Pancreas',
    color: '#e6b84a',
    info: 'Controls blood sugar with insulin. Inactivity in space can reduce insulin sensitivity.',
    center: {
      fills: ['M104 224 C118 218 134 220 146 224 C146 229 140 230 134 229 C120 227 110 230 104 230 Z'],
    },
  },
]

export const HEART = {
  x: 128,
  y: 158,
  path: 'M0 9 C-16 -2 -14 -16 -5 -16 C-1 -16 0 -12 0 -11 C0 -12 1 -16 5 -16 C14 -16 16 -2 0 9 Z',
}

// ---------------------------------------------------------------- muscles

export const MUSCLES = [
  {
    key: 'neck',
    name: 'Neck',
    info: 'Neck muscles relax in microgravity, so the head drifts slightly forward into a "neutral body posture".',
    side: {
      fills: ['M112 80 C110 90 107 96 100 101 L104 104 C111 98 115 90 116 80 Z'],
    },
  },
  {
    key: 'shoulders',
    name: 'Shoulders (deltoids)',
    info: 'Upper-body muscles weaken less than legs because the arms are still used to move around the station.',
    side: {
      fills: ['M98 102 C82 100 66 106 62 120 C59 134 60 146 63 152 C69 138 76 126 86 118 C92 112 96 108 98 102 Z'],
      details: ['M90 108 C80 118 70 132 66 146'],
    },
  },
  {
    key: 'chest',
    name: 'Chest (pectorals)',
    info: 'Pushing off walls keeps the chest active, but without load it still loses some strength.',
    side: {
      fills: ['M118 114 C104 108 92 112 84 120 C77 130 78 144 86 152 C100 158 112 156 118 150 Z'],
      details: ['M116 122 C104 124 94 132 88 144', 'M116 136 C106 138 98 142 92 150'],
    },
  },
  {
    key: 'arms',
    name: 'Arms (biceps & forearms)',
    info: 'Used constantly to grab handrails and pull through modules, so arms keep most of their strength.',
    side: {
      fills: [
        'M63 158 C59 172 57 186 58 198 C62 202 67 200 69 192 C71 178 71 164 70 152 Z',
        'M55 208 C51 228 47 248 44 268 C48 272 52 270 54 264 C58 244 61 224 63 208 Z',
      ],
    },
  },
  {
    key: 'abs',
    name: 'Core (abdominals & obliques)',
    info: 'Core muscles hold posture against gravity on Earth. In orbit they lose tone, so crew train them daily.',
    side: {
      fills: [
        'M107 162 L117 162 Q118 162 118 164 L118 180 L106 180 L106 164 Q106 162 107 162 Z',
        'M106 184 L118 184 L118 202 L106 202 Z',
        'M106 206 L118 206 L118 224 L107 224 Q106 224 106 222 Z',
        'M106 228 L118 228 L118 250 Q112 248 108 242 Z',
        'M86 162 C83 184 83 206 87 230 C92 238 100 240 102 232 L102 168 C96 162 91 160 86 162 Z',
      ],
    },
  },
  {
    key: 'thighs',
    name: 'Thighs (quadriceps)',
    info: 'Thigh muscles lose the most: up to 20% on long missions without exercise. Treadmill and squats slow this.',
    side: {
      fills: ['M84 280 C82 306 84 334 92 356 C98 362 106 360 110 352 C114 328 114 302 112 288 C104 278 92 276 84 280 Z'],
      details: ['M98 284 C96 306 98 332 102 354', 'M88 300 C90 320 94 340 98 352'],
    },
  },
  {
    key: 'calves',
    name: 'Lower legs (calves & shins)',
    info: 'These carry body weight on Earth. In orbit they can shrink 10–20%, which is why crew wear bungee harnesses on the treadmill.',
    side: {
      fills: ['M90 374 C88 398 90 422 94 444 C98 447 103 445 104 440 C108 416 110 392 108 372 C102 366 94 366 90 374 Z'],
      details: ['M99 378 C98 400 99 422 100 440'],
    },
  },
]

// ---------------------------------------------------------------- skeleton

const RIBS = Array.from({ length: 7 }, (_, i) => {
  const y = 118 + i * 11
  const reach = 84 + i * 0.5
  return [`M116 ${y} C102 ${y - 6} ${reach} ${y} ${reach + 2} ${y + 16}`, 3.2]
})

export const BONES = [
  {
    key: 'skull',
    name: 'Skull',
    info: 'Not weight-bearing, so it barely changes. It may even gain a little density as fluid shifts upward.',
    center: {
      fills: [
        'M98 44 C98 26 108 18 120 18 C132 18 142 26 142 44 C142 54 138 60 134 64 L132 74 C126 78 114 78 108 74 L106 64 C102 60 98 54 98 44 Z',
      ],
      holes: [
        'M106 44 C106 40 114 40 116 44 C116 50 106 50 106 44 Z',
        'M124 44 C126 40 134 40 134 44 C134 50 124 50 124 44 Z',
        'M118 52 L122 52 L120 58 Z',
      ],
      details: ['M110 68 L130 68', 'M114 68 L114 74', 'M120 68 L120 76', 'M126 68 L126 74'],
    },
  },
  {
    key: 'spine',
    name: 'Spine',
    info: 'Without compression the discs expand: astronauts grow up to 5 cm taller in orbit, which often causes back pain.',
    center: {
      fills: [
        ...[82, 89].map((y) => `M116 ${y} L124 ${y} L124 ${y + 5} L116 ${y + 5} Z`),
        ...[194, 204, 214, 224, 234].map((y) => `M114 ${y} L126 ${y} L126 ${y + 7} L114 ${y + 7} Z`),
      ],
    },
  },
  {
    key: 'ribs',
    name: 'Rib cage & sternum',
    info: 'Protects the heart and lungs. Ribs change little because they are not weight-bearing.',
    side: {
      strokes: [...RIBS, ['M116 102 C104 100 88 102 70 108', 4]],
    },
    center: {
      fills: ['M117 108 L123 108 Q124 108 124 110 L124 168 L120 174 L116 168 L116 110 Q116 108 117 108 Z'],
    },
  },
  {
    key: 'arm-bones',
    name: 'Arm bones',
    info: 'Arms lose less density than legs because they still push and pull against handrails.',
    side: {
      strokes: [
        ['M66 114 L58 198', 6],
        ['M55 206 L45 268', 3],
        ['M60 206 L50 268', 3],
        ['M46 274 L42 296', 2],
        ['M49 274 L46 298', 2],
        ['M52 274 L50 296', 2],
      ],
      circles: [[66, 112, 6], [58, 201, 5]],
    },
  },
  {
    key: 'pelvis',
    name: 'Pelvis',
    info: 'The hips lose bone fastest in space, about 1–1.5% every month.',
    side: {
      fills: ['M116 246 C102 242 88 244 82 254 C80 266 88 276 102 278 C108 279 114 276 116 270 Z'],
      holes: ['M100 262 C96 262 94 268 98 272 C102 274 106 270 104 266 C103 263 102 262 100 262 Z'],
    },
    center: {
      fills: ['M114 246 L126 246 L124 272 Q120 278 116 272 Z'],
    },
  },
  {
    key: 'femur',
    name: 'Thigh bone (femur)',
    info: 'One of the most affected weight-bearing bones. Lost density can take years to recover after landing.',
    side: {
      strokes: [['M100 280 L100 354', 7]],
      circles: [[100, 360, 6]],
    },
  },
  {
    key: 'lower-leg',
    name: 'Shin & foot bones',
    info: 'Feet no longer carry weight in orbit. Even the thick skin on the soles softens and peels.',
    side: {
      strokes: [
        ['M101 370 L102 446', 6],
        ['M92 374 L94 442', 3],
        ['M97 454 L90 470', 2.5],
        ['M102 454 L100 472', 2.5],
        ['M107 454 L108 470', 2.5],
      ],
    },
  },
]
