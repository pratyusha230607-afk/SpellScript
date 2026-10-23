import React from 'react';
import { BlockType } from '../../types';
import { Plus, Repeat, FlaskConical, Wand2, ShieldAlert, Move, Flower2, Sparkles } from 'lucide-react';
import { sound } from '../../utils/sound';

export interface BlockDrawerProps {
  onAddBlock: (type: BlockType) => void;
  allowedTypes?: BlockType[];
}

export const BlockDrawer: React.FC<BlockDrawerProps> = ({ onAddBlock, allowedTypes }) => {
  const blockCatalog: Array<{
    type: BlockType;
    category: string;
    label: string;
    desc: string;
    color: string;
    icon: React.ReactNode;
  }> = [
    // Dragon Actions
    {
      type: 'MOVE_FORWARD',
      category: 'Movement',
      label: 'Move Forward',
      desc: 'Step 1 tile in facing direction',
      color: 'hover:border-runeAmber text-runeAmber bg-amber-950/40',
      icon: <Move className="w-3.5 h-3.5" />,
    },
    {
      type: 'TURN_LEFT',
      category: 'Movement',
      label: 'Turn Left',
      desc: 'Pivot 90 degrees counter-clockwise',
      color: 'hover:border-runeAmber text-runeAmber bg-amber-950/40',
      icon: <Move className="w-3.5 h-3.5 -scale-x-100" />,
    },
    {
      type: 'TURN_RIGHT',
      category: 'Movement',
      label: 'Turn Right',
      desc: 'Pivot 90 degrees clockwise',
      color: 'hover:border-runeAmber text-runeAmber bg-amber-950/40',
      icon: <Move className="w-3.5 h-3.5" />,
    },
    {
      type: 'COLLECT_CRYSTAL',
      category: 'Movement',
      label: 'Collect Crystal',
      desc: 'Pick up celestial crystal on current tile',
      color: 'hover:border-astralCyan text-astralCyan bg-cyan-950/40',
      icon: <Sparkles className="w-3.5 h-3.5" />,
    },

    // Loops
    {
      type: 'REPEAT_N',
      category: 'Loops',
      label: 'Repeat N Times',
      desc: 'Run enclosed spell instructions N times',
      color: 'hover:border-manaMint text-manaMint bg-emerald-950/40',
      icon: <Repeat className="w-3.5 h-3.5" />,
    },

    // Garden & Environment
    {
      type: 'GROW_FLOWER',
      category: 'Flora',
      label: 'Grow Flower',
      desc: 'Bloom an enchanted flower on plot',
      color: 'hover:border-spellPink text-spellPink bg-pink-950/40',
      icon: <Flower2 className="w-3.5 h-3.5" />,
    },
    {
      type: 'BUILD_BRIDGE',
      category: 'Construct',
      label: 'Build Bridge Tile',
      desc: 'Materialize crystal tile over void',
      color: 'hover:border-astralCyan text-astralCyan bg-cyan-950/40',
      icon: <Sparkles className="w-3.5 h-3.5" />,
    },

    // Variables & Alchemy
    {
      type: 'SET_VARIABLE',
      category: 'Variables',
      label: 'Set Variable',
      desc: 'Store mana or ingredients in a magic flask',
      color: 'hover:border-spellPink text-spellPink bg-pink-950/40',
      icon: <FlaskConical className="w-3.5 h-3.5" />,
    },
    {
      type: 'BREW_POTION',
      category: 'Variables',
      label: 'Brew Potion',
      desc: 'Combine bottle contents in the cauldron',
      color: 'hover:border-spellPink text-spellPink bg-pink-950/40',
      icon: <FlaskConical className="w-3.5 h-3.5" />,
    },

    // Functions
    {
      type: 'DEFINE_FUNCTION',
      category: 'Functions',
      label: 'Define Spell',
      desc: 'Inscribe a reusable named spell scroll',
      color: 'hover:border-magic text-magic-light bg-purple-950/40',
      icon: <Wand2 className="w-3.5 h-3.5" />,
    },
    {
      type: 'CALL_FUNCTION',
      category: 'Functions',
      label: 'Invoke Spell',
      desc: 'Cast a previously defined spell by name',
      color: 'hover:border-magic text-magic-light bg-purple-950/40',
      icon: <Wand2 className="w-3.5 h-3.5" />,
    },

    // Debugging & Runes
    {
      type: 'PURIFY_RUNE',
      category: 'Curse Breaking',
      label: 'Purify Rune',
      desc: 'Channel wand energy to cleanse corrupted rune',
      color: 'hover:border-cursedRed text-cursedRed bg-red-950/40',
      icon: <ShieldAlert className="w-3.5 h-3.5" />,
    },
    {
      type: 'CAST_SPELL',
      category: 'Combat',
      label: 'Cast Starlight Bolt',
      desc: 'Channel radiant bolt dealing boss damage',
      color: 'hover:border-moonCream text-moonCream bg-purple-900/40',
      icon: <Sparkles className="w-3.5 h-3.5" />,
    },
  ];

  // Filter if allowedTypes specified
  const filteredCatalog = allowedTypes
    ? blockCatalog.filter((b) => allowedTypes.includes(b.type))
    : blockCatalog;

  return (
    <div className="bg-night-900/80 border border-magic/30 rounded-2xl p-4 backdrop-blur shadow-xl">
      <div className="flex items-center justify-between mb-3 border-b border-white/10 pb-2">
        <h3 className="font-fantasy font-bold text-sm text-moonCream flex items-center gap-2">
          <span>✨</span> Spell Inscriptions Drawer
        </h3>
        <span className="text-[10px] text-magic-light font-code">Click to Inscribe</span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 max-h-[360px] overflow-y-auto pr-1">
        {filteredCatalog.map((item) => (
          <button
            key={item.type}
            onClick={() => {
              sound.playClick();
              onAddBlock(item.type);
            }}
            className={`p-2.5 rounded-xl border border-white/10 text-left transition-all duration-200 flex flex-col justify-between group shadow-sm hover:scale-[1.02] ${item.color}`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-fantasy font-bold tracking-wide flex items-center gap-1.5">
                {item.icon} {item.label}
              </span>
              <Plus className="w-3.5 h-3.5 opacity-40 group-hover:opacity-100 group-hover:scale-125 transition-all text-moonCream" />
            </div>
            <p className="text-[10px] text-moonCream/60 mt-1 line-clamp-2 leading-tight">
              {item.desc}
            </p>
          </button>
        ))}
      </div>
    </div>
  );
};

