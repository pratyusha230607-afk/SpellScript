import React from 'react';
import { SpellBlock, BlockType } from '../../types';
import { Trash2, ChevronUp, ChevronDown, Repeat, Wand2, FlaskConical, Move, ShieldAlert, Sparkles, Plus } from 'lucide-react';
import { sound } from '../../utils/sound';

export interface BlockItemProps {
  block: SpellBlock;
  index: number;
  totalBlocks: number;
  onUpdateParams: (id: string, params: Record<string, any>) => void;
  onDelete: (id: string) => void;
  onMoveUp: (index: number) => void;
  onMoveDown: (index: number) => void;
  onAddChild?: (parentId: string, childType: BlockType) => void;
  onDeleteChild?: (parentId: string, childId: string) => void;
  onUpdateChildParams?: (parentId: string, childId: string, params: Record<string, any>) => void;
  activeBlockId: string | null;
  allowedChildTypes?: BlockType[];
}

export const BlockItem: React.FC<BlockItemProps> = ({
  block,
  index,
  totalBlocks,
  onUpdateParams,
  onDelete,
  onMoveUp,
  onMoveDown,
  onAddChild,
  onDeleteChild,
  onUpdateChildParams,
  activeBlockId,
  allowedChildTypes = ['GROW_FLOWER', 'BUILD_BRIDGE', 'MOVE_FORWARD', 'TURN_LEFT', 'TURN_RIGHT', 'CAST_SPELL'],
}) => {
  const isActive = activeBlockId === block.id;

  // Block style theme per type
  const getBlockTheme = (type: BlockType) => {
    switch (type) {
      case 'REPEAT_N':
        return {
          bg: 'bg-emerald-950/60 border-manaMint/60 text-manaMint',
          badge: 'bg-manaMint text-night-950',
          icon: <Repeat className="w-3.5 h-3.5" />,
          title: 'REPEAT',
        };
      case 'SET_VARIABLE':
      case 'ADD_INGREDIENT':
      case 'BREW_POTION':
        return {
          bg: 'bg-pink-950/60 border-spellPink/60 text-spellPink',
          badge: 'bg-spellPink text-night-950',
          icon: <FlaskConical className="w-3.5 h-3.5" />,
          title: 'VARIABLE',
        };
      case 'DEFINE_FUNCTION':
      case 'CALL_FUNCTION':
        return {
          bg: 'bg-purple-950/60 border-magic/60 text-magic-light',
          badge: 'bg-magic text-night-950',
          icon: <Wand2 className="w-3.5 h-3.5" />,
          title: 'FUNCTION',
        };
      case 'PURIFY_RUNE':
      case 'DISPEL_CURSE':
        return {
          bg: 'bg-red-950/60 border-cursedRed/60 text-cursedRed',
          badge: 'bg-cursedRed text-white',
          icon: <ShieldAlert className="w-3.5 h-3.5" />,
          title: 'CURSE BREAK',
        };
      default:
        return {
          bg: 'bg-amber-950/60 border-runeAmber/60 text-runeAmber',
          badge: 'bg-runeAmber text-night-950',
          icon: <Move className="w-3.5 h-3.5" />,
          title: 'ACTION',
        };
    }
  };

  const theme = getBlockTheme(block.type);

  return (
    <div
      className={`relative rounded-xl border-2 transition-all duration-300 p-3 shadow-lg select-none ${theme.bg} ${
        isActive
          ? 'ring-4 ring-moonCream border-moonCream scale-[1.02] shadow-[0_0_25px_rgba(255,242,216,0.6)]'
          : 'hover:border-opacity-100'
      }`}
    >
      {/* Top Header of Block */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full flex items-center gap-1 ${theme.badge}`}>
            {theme.icon}
            {theme.title}
          </span>
          <span className="font-fantasy font-bold text-xs text-moonCream tracking-wide">
            {block.type.replace(/_/g, ' ')}
          </span>
        </div>

        {/* Controls: Move Up, Down, Delete */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => {
              sound.playClick();
              onMoveUp(index);
            }}
            disabled={index === 0}
            className="p-1 rounded text-moonCream/50 hover:text-moonCream hover:bg-white/10 disabled:opacity-20"
            title="Move Up"
          >
            <ChevronUp className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => {
              sound.playClick();
              onMoveDown(index);
            }}
            disabled={index === totalBlocks - 1}
            className="p-1 rounded text-moonCream/50 hover:text-moonCream hover:bg-white/10 disabled:opacity-20"
            title="Move Down"
          >
            <ChevronDown className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => {
              sound.playClick();
              onDelete(block.id);
            }}
            className="p-1 rounded text-red-400/60 hover:text-red-400 hover:bg-red-500/10"
            title="Remove Block"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Block Parameters Config Area */}
      <div className="mt-2.5 flex flex-wrap items-center gap-2 text-xs">
        {/* REPEAT_N Count */}
        {block.type === 'REPEAT_N' && (
          <div className="flex items-center gap-2 bg-night-950/70 border border-manaMint/30 px-2.5 py-1 rounded-lg">
            <span className="text-manaMint font-semibold">Repeat times:</span>
            <input
              type="number"
              min={1}
              max={20}
              value={block.params.count ?? 5}
              onChange={(e) =>
                onUpdateParams(block.id, { ...block.params, count: parseInt(e.target.value) || 1 })
              }
              className="w-14 bg-night-900 border border-manaMint/40 rounded px-1.5 py-0.5 text-center text-moonCream font-code font-bold focus:outline-none focus:border-manaMint"
            />
          </div>
        )}

        {/* SET_VARIABLE Name and Value */}
        {block.type === 'SET_VARIABLE' && (
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1.5 bg-night-950/70 border border-spellPink/30 px-2 py-1 rounded-lg">
              <span className="text-spellPink/80">Flask:</span>
              <input
                type="text"
                value={block.params.variableName || 'mana_flask'}
                onChange={(e) =>
                  onUpdateParams(block.id, { ...block.params, variableName: e.target.value })
                }
                className="w-24 bg-night-900 border border-spellPink/40 rounded px-1.5 py-0.5 text-moonCream font-code font-semibold text-xs focus:outline-none"
              />
            </div>
            <span className="text-moonCream/60 font-bold">=</span>
            <div className="flex items-center gap-1.5 bg-night-950/70 border border-spellPink/30 px-2 py-1 rounded-lg">
              <span className="text-spellPink/80">Value:</span>
              <input
                type="number"
                value={block.params.variableValue ?? 100}
                onChange={(e) =>
                  onUpdateParams(block.id, {
                    ...block.params,
                    variableValue: parseInt(e.target.value) || 0,
                  })
                }
                className="w-16 bg-night-900 border border-spellPink/40 rounded px-1.5 py-0.5 text-moonCream font-code font-bold text-center focus:outline-none"
              />
            </div>
          </div>
        )}

        {/* DEFINE_FUNCTION Name */}
        {block.type === 'DEFINE_FUNCTION' && (
          <div className="flex items-center gap-2 bg-night-950/70 border border-magic/30 px-2.5 py-1 rounded-lg">
            <span className="text-magic-light font-semibold">Spell Name:</span>
            <input
              type="text"
              value={block.params.functionName || 'build_bridge'}
              onChange={(e) =>
                onUpdateParams(block.id, { ...block.params, functionName: e.target.value })
              }
              className="w-28 bg-night-900 border border-magic/40 rounded px-1.5 py-0.5 text-moonCream font-code font-bold focus:outline-none"
            />
            <span className="text-moonCream/60 font-code font-bold">()</span>
          </div>
        )}

        {/* CALL_FUNCTION Name */}
        {block.type === 'CALL_FUNCTION' && (
          <div className="flex items-center gap-2 bg-night-950/70 border border-magic/30 px-2.5 py-1 rounded-lg">
            <span className="text-magic-light font-semibold">Invoke:</span>
            <input
              type="text"
              value={block.params.functionName || 'build_bridge'}
              onChange={(e) =>
                onUpdateParams(block.id, { ...block.params, functionName: e.target.value })
              }
              className="w-28 bg-night-900 border border-magic/40 rounded px-1.5 py-0.5 text-moonCream font-code font-bold focus:outline-none"
            />
            <span className="text-moonCream/60 font-code font-bold">()</span>
          </div>
        )}

        {/* PURIFY_RUNE Target */}
        {block.type === 'PURIFY_RUNE' && (
          <div className="flex items-center gap-2 bg-night-950/70 border border-cursedRed/30 px-2.5 py-1 rounded-lg">
            <span className="text-cursedRed font-semibold">Target Rune #:</span>
            <input
              type="number"
              min={1}
              max={10}
              value={block.params.targetRune ?? 1}
              onChange={(e) =>
                onUpdateParams(block.id, {
                  ...block.params,
                  targetRune: parseInt(e.target.value) || 1,
                })
              }
              className="w-14 bg-night-900 border border-cursedRed/40 rounded px-1.5 py-0.5 text-center text-moonCream font-code font-bold focus:outline-none"
            />
          </div>
        )}

        {/* CAST_SPELL Name */}
        {block.type === 'CAST_SPELL' && (
          <div className="flex items-center gap-2 bg-night-950/70 border border-magic/30 px-2.5 py-1 rounded-lg">
            <span className="text-magic-light font-semibold">Incantation:</span>
            <span className="text-moonCream font-fantasy font-bold">{block.params.spellName || 'Starlight Bolt'}</span>
          </div>
        )}
      </div>

      {/* Nested Children (for REPEAT_N or DEFINE_FUNCTION) */}
      {(block.type === 'REPEAT_N' || block.type === 'DEFINE_FUNCTION') && (
        <div className="mt-3 pl-3 border-l-2 border-dashed border-white/20 space-y-2">
          <div className="text-[10px] uppercase font-bold text-moonCream/50 flex items-center justify-between">
            <span>Enchantment Body:</span>
            {onAddChild && (
              <div className="flex items-center gap-1">
                {allowedChildTypes.slice(0, 3).map((childType) => (
                  <button
                    key={childType}
                    onClick={() => {
                      sound.playClick();
                      onAddChild(block.id, childType);
                    }}
                    className="text-[9px] px-1.5 py-0.5 rounded bg-white/10 hover:bg-white/20 text-moonCream/80 flex items-center gap-1 font-code"
                  >
                    <Plus className="w-2.5 h-2.5" /> {childType.replace(/_/g, ' ')}
                  </button>
                ))}
              </div>
            )}
          </div>

          {block.children && block.children.length > 0 ? (
            block.children.map((childBlock, cIdx) => (
              <div
                key={childBlock.id}
                className={`p-2 rounded-lg bg-night-950/80 border text-xs flex items-center justify-between ${
                  activeBlockId === childBlock.id
                    ? 'border-moonCream ring-2 ring-moonCream shadow-md'
                    : 'border-white/10'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold text-manaMint font-code">
                    {cIdx + 1}. {childBlock.type.replace(/_/g, ' ')}
                  </span>
                  {childBlock.type === 'GROW_FLOWER' && (
                    <span className="text-xs">🌸</span>
                  )}
                  {childBlock.type === 'BUILD_BRIDGE' && (
                    <span className="text-xs">✨</span>
                  )}
                </div>

                {onDeleteChild && (
                  <button
                    onClick={() => {
                      sound.playClick();
                      onDeleteChild(block.id, childBlock.id);
                    }}
                    className="text-red-400/60 hover:text-red-400 p-0.5"
                    title="Remove inner instruction"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                )}
              </div>
            ))
          ) : (
            <div className="text-center py-2 text-[11px] text-moonCream/40 border border-dashed border-white/10 rounded-lg">
              Click an action button above to add an instruction inside this block.
            </div>
          )}
        </div>
      )}
    </div>
  );
};

