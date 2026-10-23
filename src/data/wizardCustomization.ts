export interface AvatarOption {
  id: string;
  name: string;
  title: string;
  emoji: string;
  description: string;
  color: string;
}

export interface HouseOption {
  id: 'Ignis' | 'Aether' | 'Flora' | 'Chronos';
  name: string;
  motto: string;
  element: string;
  color: string;
  icon: string;
  description: string;
}

export interface WandOption {
  id: string;
  name: string;
  core: string;
  wood: string;
  power: string;
  icon: string;
}

export interface FamiliarOption {
  id: string;
  name: string;
  species: string;
  emoji: string;
  trait: string;
  description: string;
}

export interface AchievementBadge {
  id: string;
  title: string;
  icon: string;
  description: string;
  unlockedCondition: string;
}

export const AVATAR_OPTIONS: AvatarOption[] = [
  {
    id: 'apprentice',
    name: 'Astral Apprentice',
    title: 'Novice of the Arcane',
    emoji: '🧙',
    description: 'A curious learner eager to decipher ancient code runes and weave starlight.',
    color: '#9274D8',
  },
  {
    id: 'pyromancer',
    name: 'Ember Weaver',
    title: 'Adept of Ignis',
    emoji: '🔥',
    description: 'Channels fierce fiery algorithms that ignite quickly and burn through bugs.',
    color: '#FFB347',
  },
  {
    id: 'druid',
    name: 'Flora Sage',
    title: 'Keeper of the Looping Woods',
    emoji: '🧝',
    description: 'Naturally attuned to repeating cycles, flourishing gardens, and peaceful growth.',
    color: '#B8E8DC',
  },
  {
    id: 'star-scholar',
    name: 'Cosmic Chronicler',
    title: 'Architect of Function Tower',
    emoji: '⭐',
    description: 'Designs reusable grand celestial structures and crystal clear architectures.',
    color: '#56E2D8',
  },
  {
    id: 'shadow-breaker',
    name: 'Curse Dispelist',
    title: 'Scourge of the Debugging Dungeon',
    emoji: '🕵️',
    description: 'Has keen eyes that catch off-by-one hexes and corrupted memory curses.',
    color: '#F3A9D4',
  },
  {
    id: 'dragonkin',
    name: 'Dragon Whisperer',
    title: 'Lord of Algorithms',
    emoji: '🐲',
    description: 'Walks alongside mythical beasts and guides hatchlings through labyrinthine paths.',
    color: '#fed894',
  },
];

export const HOUSE_OPTIONS: HouseOption[] = [
  {
    id: 'Ignis',
    name: 'House Ignis',
    motto: 'Passion In Every Spark',
    element: 'Fire',
    color: '#FF8A65',
    icon: '🔥',
    description: 'Courageous wizards who tackle difficult bugs head-on with boundless energy.',
  },
  {
    id: 'Aether',
    name: 'House Aether',
    motto: 'Truth Written In Starlight',
    element: 'Cosmos',
    color: '#9274D8',
    icon: '✨',
    description: 'Deep thinkers who design elegant functions, algorithms, and clean architecture.',
  },
  {
    id: 'Flora',
    name: 'House Flora',
    motto: 'Harmony Through Repetition',
    element: 'Nature',
    color: '#81C784',
    icon: '🌿',
    description: 'Masters of organic loops and patient development, nurturing enchanted worlds.',
  },
  {
    id: 'Chronos',
    name: 'House Chronos',
    motto: 'Order Beyond The Void',
    element: 'Time',
    color: '#4DD0E1',
    icon: '⏳',
    description: 'Analytical minds skilled at step-by-step debugging, time complexity, and logic.',
  },
];

export const WAND_OPTIONS: WandOption[] = [
  {
    id: 'phoenix-oak',
    name: 'Phoenix Oak Wand',
    core: 'Phoenix Feather Core',
    wood: 'Ancient Sun Oak',
    power: '+15% Spell Cast Velocity',
    icon: '🪄',
  },
  {
    id: 'starlight-crystal',
    name: 'Starlight Quartz Scepter',
    core: 'Astral Meteor Shard',
    wood: 'Petrified Nebula Driftwood',
    power: '+20% Mana Capacity',
    icon: '💎',
  },
  {
    id: 'elder-willow',
    name: 'Elder Willow Bough',
    core: 'Unicorn Mane Fiber',
    wood: 'Weeping Willow',
    power: '+10% Loop Efficiency',
    icon: '🌱',
  },
  {
    id: 'obsidian-dragon',
    name: 'Obsidian Drake Rod',
    core: 'Dragonheart String',
    wood: 'Volcanic Obsidian',
    power: '+25% Curse Shatter Force',
    icon: '⚡',
  },
];

export const FAMILIAR_OPTIONS: FamiliarOption[] = [
  {
    id: 'sparky',
    name: 'Sparky',
    species: 'Baby Sun Dragon',
    emoji: '🐲',
    trait: 'Loves collecting glowing crystals and navigating mazes.',
    description: 'Guides your algorithms and breathes joyful sparks upon quest completion.',
  },
  {
    id: 'lumos',
    name: 'Lumos',
    species: 'Cosmic Starlight Owl',
    emoji: '🦉',
    trait: 'Perched on your shoulder, spots syntax bugs from afar.',
    description: 'Whispers hints into your ear whenever your spell encounters a syntax hex.',
  },
  {
    id: 'nyx',
    name: 'Nyx',
    species: 'Shadow Veil Cat',
    emoji: '🐈‍⬛',
    trait: 'Slips effortlessly between dimensions and memory stacks.',
    description: 'Protects your mana flask from overflowing and purifies rogue curses.',
  },
  {
    id: 'sprout',
    name: 'Sprout',
    species: 'Moss Bloom Sprite',
    emoji: '🧚',
    trait: 'Accelerates botanical enchantments and loop cycles.',
    description: 'Dances along garden pathways, ensuring every flower blooms on cue.',
  },
];

export const ALL_BADGES: AchievementBadge[] = [
  {
    id: 'first-spell',
    title: 'First Incantation',
    icon: '✨',
    description: 'Cast your very first spell script successfully.',
    unlockedCondition: 'Complete any level.',
  },
  {
    id: 'potion-master',
    title: 'Alchemist Novice',
    icon: '⚗️',
    description: 'Stored mana and brewed elixirs using variables.',
    unlockedCondition: 'Complete Variable Village quests.',
  },
  {
    id: 'master-gardener',
    title: 'Flora Enchanter',
    icon: '🌸',
    description: 'Bloomed over 15 enchanted flowers using loops.',
    unlockedCondition: 'Complete Looping Woods quests.',
  },
  {
    id: 'architect-of-sky',
    title: 'Citadel Architect',
    icon: '🔮',
    description: 'Built a reusable starlight bridge with functions.',
    unlockedCondition: 'Complete Function Tower quest.',
  },
  {
    id: 'curse-breaker',
    title: 'Curse Shatterer',
    icon: '⚡',
    description: 'Fixed corrupted runes and opened the dungeon vault.',
    unlockedCondition: 'Complete Debugging Dungeon quest.',
  },
  {
    id: 'dragon-rider',
    title: 'Dragon Navigator',
    icon: '🐲',
    description: 'Guided Sparky to all cosmic crystals without a misstep.',
    unlockedCondition: 'Complete Algorithm Kingdom quests.',
  },
  {
    id: 'grand-archmage',
    title: 'Grand Archmage',
    icon: '👑',
    description: 'Defeated the Glitch Chimera in the Boss Arena!',
    unlockedCondition: 'Defeat the Boss Chimera.',
  },
];

