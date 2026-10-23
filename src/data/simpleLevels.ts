export interface SimpleLevel {
  id: number;
  title: string;
  category: string;
  conceptBadge: string;
  conceptQuote: string;
  conceptExplanation: string;
  mission: string;
  starterCode: string;
  quickButtons: Array<{ label: string; code: string }>;
  expectedGoalDesc: string;
  hint: string;
  worldType: 'dragon' | 'garden' | 'potion' | 'bridge' | 'curse';
  worldConfig: any;
}

export const SIMPLE_LEVELS: SimpleLevel[] = [
  {
    id: 1,
    title: 'Dragon Steps',
    category: 'Algorithms & Sequencing',
    conceptBadge: '🐲 Algorithms = Step-by-Step Magic',
    conceptQuote: 'Computers follow instructions in order, just like a dragon follows a treasure map.',
    conceptExplanation: 'Give Sparky step-by-step instructions. Move forward 2 times, turn right, move forward 2 times, and collect the crystal!',
    mission: 'Guide baby dragon Sparky to the glowing crystal 💎 and collect it.',
    starterCode: `# 🪄 "type code here" — Inscribe your spell instructions below:
dragon.move_forward()
dragon.move_forward()
dragon.turn_right()
dragon.move_forward()
dragon.move_forward()
dragon.collect_crystal()`,
    quickButtons: [
      { label: '+ move_forward()', code: 'dragon.move_forward()' },
      { label: '+ turn_right()', code: 'dragon.turn_right()' },
      { label: '+ turn_left()', code: 'dragon.turn_left()' },
      { label: '+ collect_crystal()', code: 'dragon.collect_crystal()' },
    ],
    expectedGoalDesc: 'Sparky must reach (2, 2) and call dragon.collect_crystal()',
    hint: 'Sparky starts facing RIGHT. Move forward 2 steps, turn right to face DOWN, move forward 2 steps, and collect the crystal!',
    worldType: 'dragon',
    worldConfig: {
      gridSize: 5,
      startX: 0,
      startY: 0,
      startDir: 'RIGHT',
      targetX: 2,
      targetY: 2,
      obstacles: [{ x: 1, y: 1, type: 'rock' }],
    },
  },
  {
    id: 2,
    title: 'The Blooming Meadow',
    category: 'Loops & Repetition',
    conceptBadge: '🌿 Loops = Repeating Enchantments',
    conceptQuote: 'Instead of casting grow_flower() 6 times, tell magic to repeat 6 times!',
    conceptExplanation: 'Loops save you from typing the same thing over and over. A for-loop repeats enclosed actions N times.',
    mission: 'Grow 6 enchanted flowers across the garden path using a repeat loop.',
    starterCode: `# 🪄 "type code here" — Inscribe your spell instructions below:
for step in range(6):
    grow_flower()`,
    quickButtons: [
      { label: '+ for step in range(6):', code: 'for step in range(6):\n    grow_flower()' },
      { label: '+ grow_flower()', code: '    grow_flower()' },
    ],
    expectedGoalDesc: 'Bloom all 6 enchanted flowers using a repeat loop',
    hint: 'Change the number inside range(6) to grow more or fewer flowers. 6 flowers are needed!',
    worldType: 'garden',
    worldConfig: {
      targetFlowers: 6,
    },
  },
  {
    id: 3,
    title: 'The Magic Flask',
    category: 'Variables & Storage',
    conceptBadge: '⚗️ Variables = Magic Bottles',
    conceptQuote: 'Variables store values inside labeled bottles, like mana points or potion drops.',
    conceptExplanation: 'A variable has a name on the left and a value on the right (mana_flask = 100). When you change the value, the potion reacts!',
    mission: 'Fill your mana_flask with 100 power and add star_dew = 3 to brew the glowing potion.',
    starterCode: `# 🪄 "type code here" — Inscribe your spell instructions below:
mana_flask = 100
star_dew = 3
cauldron.brew_elixir()`,
    quickButtons: [
      { label: '+ mana_flask = 100', code: 'mana_flask = 100' },
      { label: '+ star_dew = 3', code: 'star_dew = 3' },
      { label: '+ brew_elixir()', code: 'cauldron.brew_elixir()' },
    ],
    expectedGoalDesc: 'Set mana_flask = 100 and star_dew = 3, then brew the elixir',
    hint: 'Make sure mana_flask is set to 100 and star_dew is set to 3 before brewing!',
    worldType: 'potion',
    worldConfig: {
      targetVariables: { mana_flask: 100, star_dew: 3 },
      potionName: 'Elixir of Luminescence',
    },
  },
  {
    id: 4,
    title: 'The Starlight Bridge',
    category: 'Functions & Reusable Magic',
    conceptBadge: '🔮 Functions = Reusable Spells',
    conceptQuote: 'Inscribe a spell recipe once (def build_bridge()), then call it anytime!',
    conceptExplanation: 'Functions let you name a bundle of commands so you can reuse them anywhere without re-writing the code.',
    mission: 'Define a function build_bridge() of 4 crystal segments, then call it to cross the void.',
    starterCode: `# 🪄 "type code here" — Inscribe your spell instructions below:
def build_bridge():
    for step in range(4):
        place_starlight_tile()

build_bridge()`,
    quickButtons: [
      { label: '+ def build_bridge():', code: 'def build_bridge():\n    for step in range(4):\n        place_starlight_tile()' },
      { label: '+ build_bridge()', code: 'build_bridge()' },
      { label: '+ place_starlight_tile()', code: '    place_starlight_tile()' },
    ],
    expectedGoalDesc: 'Define build_bridge() and call it to place 4 tiles',
    hint: 'Defining a function creates the recipe. Calling build_bridge() at the end actually casts it!',
    worldType: 'bridge',
    worldConfig: {
      bridgeNeeded: 4,
    },
  },
  {
    id: 5,
    title: 'Break the Curse',
    category: 'Debugging & Diagnostics',
    conceptBadge: '⚡ Debugging = Breaking Curses',
    conceptQuote: 'Bugs are just dark curses in your logic. Find the line that fails and fix it!',
    conceptExplanation: 'The dungeon altar has 3 runes (#1, #2, #3). The current spell tries to purify rune #9, which does not exist! Fix the number.',
    mission: 'Find the bug in the spell! Change rune #9 to rune #3 to break the dark chains.',
    starterCode: `# 🪄 "type code here" — Inscribe your spell instructions below:
purify_rune(1)
purify_rune(2)
purify_rune(9)  # ⚠️ Bug! Rune #9 does not exist. Change this to 3!`,
    quickButtons: [
      { label: '+ purify_rune(1)', code: 'purify_rune(1)' },
      { label: '+ purify_rune(2)', code: 'purify_rune(2)' },
      { label: '+ purify_rune(3)', code: 'purify_rune(3)' },
    ],
    expectedGoalDesc: 'Purify all three runes (1, 2, 3) to unlock the dungeon door',
    hint: 'Look at line 3: purify_rune(9). There are only 3 runes on the altar! Change 9 to 3.',
    worldType: 'curse',
    worldConfig: {
      targetRunes: [1, 2, 3],
    },
  },
];

