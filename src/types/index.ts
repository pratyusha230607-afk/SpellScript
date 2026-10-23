export type RealmId = 'variables' | 'loops' | 'functions' | 'debugging' | 'algorithms' | 'boss';

export type BlockCategory = 'actions' | 'loops' | 'variables' | 'functions' | 'curse';

export type BlockType =
  // Dragon & Movement
  | 'MOVE_FORWARD'
  | 'TURN_LEFT'
  | 'TURN_RIGHT'
  | 'COLLECT_CRYSTAL'
  | 'CAST_SPELL'
  // Loops
  | 'REPEAT_N'
  // Variables & Potions
  | 'SET_VARIABLE'
  | 'ADD_INGREDIENT'
  | 'BREW_POTION'
  // Functions
  | 'DEFINE_FUNCTION'
  | 'CALL_FUNCTION'
  // Garden & World
  | 'GROW_FLOWER'
  | 'BUILD_BRIDGE'
  // Debugging & Runes
  | 'PURIFY_RUNE'
  | 'DISPEL_CURSE';

export interface SpellBlock {
  id: string;
  type: BlockType;
  params: {
    count?: number;
    variableName?: string;
    variableValue?: string | number;
    ingredient?: 'fireRuby' | 'starDew' | 'moonDust' | 'phoenixAsh';
    amount?: number;
    functionName?: string;
    targetRune?: number;
    bridgeLength?: number;
    spellName?: string;
    color?: string;
  };
  children?: SpellBlock[];
}

export interface QuestLevel {
  id: string;
  realmId: RealmId;
  realmName: string;
  levelNumber: number;
  title: string;
  story: string;
  objective: string;
  starterBlocks: SpellBlock[];
  allowedBlockTypes: BlockType[];
  rewardXp: number;
  rewardGems: number;
  hint1: string;
  hint2: string;
  hint3: string;
  conceptSummary: {
    term: string;
    analogy: string;
    codeExample: string;
  };
  // Specific world configs
  worldType: 'dragon-grid' | 'garden' | 'cauldron' | 'bridge-tower' | 'dungeon-runes' | 'boss-arena';
  worldConfig: any;
}

export interface Realm {
  id: RealmId;
  name: string;
  subtitle: string;
  description: string;
  color: string;
  badge: string;
  iconName: string;
  bgGradient: string;
  levels: QuestLevel[];
}

export interface WizardProfile {
  name: string;
  title: string;
  avatar: string; // Avatar ID
  house: 'Ignis' | 'Aether' | 'Flora' | 'Chronos';
  wand: string;
  familiar: string;
  level: number;
  xp: number;
  maxXp: number;
  mana: number;
  maxMana: number;
  gems: number;
  unlockedSpells: string[];
  completedQuests: string[];
  badges: string[];
  stats: {
    spellsCast: number;
    linesOfMagic: number;
    cursesBroken: number;
    crystalsFound: number;
    flowersBloomed: number;
  };
}

export interface GrimoireEntry {
  id: string;
  title: string;
  category: string;
  realmId: RealmId;
  concept: string;
  magicAnalogy: string;
  description: string;
  codeSnippet: string;
  sampleBlocks: SpellBlock[];
}

