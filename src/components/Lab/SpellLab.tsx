import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { QuestLevel, SpellBlock, BlockType, WizardProfile } from '../../types';
import { BlockItem } from '../BlockEditor/BlockItem';
import { BlockDrawer } from '../BlockEditor/BlockDrawer';
import { CodeViewer } from '../BlockEditor/CodeViewer';
import { InteractiveCodeEditor } from '../BlockEditor/InteractiveCodeEditor';
import { ArchmageMentor } from '../Mentors/ArchmageMentor';
import { DragonGridWorld } from '../GameWorlds/DragonGridWorld';
import { EnchantedGardenWorld } from '../GameWorlds/EnchantedGardenWorld';
import { PotionCauldronWorld } from '../GameWorlds/PotionCauldronWorld';
import { FunctionTowerWorld } from '../GameWorlds/FunctionTowerWorld';
import { DebuggingDungeonWorld } from '../GameWorlds/DebuggingDungeonWorld';
import { BossBattleWorld } from '../GameWorlds/BossBattleWorld';
import {
  Play,
  RotateCcw,
  Sparkles,
  Trophy,
  Code2,
  LayoutGrid,
  ChevronRight,
  StepForward,
  FastForward,
} from 'lucide-react';
import { sound } from '../../utils/sound';

export interface SpellLabProps {
  currentLevel: QuestLevel;
  profile: WizardProfile;
  onLevelComplete: (levelId: string, earnedXp: number, earnedGems: number) => void;
  onNextLevel?: () => void;
  onBackToMap: () => void;
  onOpenGuide: () => void;
}

export const SpellLab: React.FC<SpellLabProps> = ({
  currentLevel,
  profile,
  onLevelComplete,
  onNextLevel,
  onBackToMap,
  onOpenGuide,
}) => {
  // Blocks in current recipe
  const [blocks, setBlocks] = useState<SpellBlock[]>(currentLevel.starterBlocks);
  const [viewMode, setViewMode] = useState<'blocks' | 'type-code' | 'preview'>('blocks');

  // Execution state
  const [isExecuting, setIsExecuting] = useState<boolean>(false);
  const [activeBlockId, setActiveBlockId] = useState<string | null>(null);
  const [stepMessage, setStepMessage] = useState<string>('Ready to cast spell.');
  const [lastError, setLastError] = useState<string | null>(null);
  const [isLevelSuccess, setIsLevelSuccess] = useState<boolean>(false);
  const [speedMultiplier, setSpeedMultiplier] = useState<number>(1); // 1x, 2x, 4x

  // World states:
  // 1. Dragon World State
  const [dragonPos, setDragonPos] = useState<{
    x: number;
    y: number;
    direction: 'UP' | 'RIGHT' | 'DOWN' | 'LEFT';
  }>({
    x: currentLevel.worldConfig?.startX ?? 0,
    y: currentLevel.worldConfig?.startY ?? 0,
    direction: currentLevel.worldConfig?.startDir ?? 'RIGHT',
  });
  const [crystalsCollected, setCrystalsCollected] = useState<number>(0);

  // 2. Garden World State
  const [bloomedFlowers, setBloomedFlowers] = useState<number>(0);

  // 3. Potion Cauldron State
  const [variables, setVariables] = useState<Record<string, any>>({});

  // 4. Function Tower State
  const [bridgeTiles, setBridgeTiles] = useState<number>(0);
  const [activeFunc, setActiveFunc] = useState<string | null>(null);

  // 5. Debugging Dungeon State
  const [purifiedRunes, setPurifiedRunes] = useState<number[]>([]);

  // 6. Boss Battle State
  const [bossHp, setBossHp] = useState<number>(currentLevel.worldConfig?.bossMaxHp ?? 100);
  const [playerHp, setPlayerHp] = useState<number>(currentLevel.worldConfig?.playerMaxHp ?? 100);
  const [hasShield, setHasShield] = useState<boolean>(false);
  const [bossState, setBossState] = useState<'idle' | 'hit' | 'defeated'>('idle');

  // Sync starter blocks when level changes
  useEffect(() => {
    setBlocks(JSON.parse(JSON.stringify(currentLevel.starterBlocks)));
    resetWorld();
  }, [currentLevel.id]);

  // Reset World Simulation
  const resetWorld = () => {
    setIsExecuting(false);
    setActiveBlockId(null);
    setLastError(null);
    setIsLevelSuccess(false);
    setStepMessage('World reset to initial state.');

    // Dragon
    setDragonPos({
      x: currentLevel.worldConfig?.startX ?? 0,
      y: currentLevel.worldConfig?.startY ?? 0,
      direction: currentLevel.worldConfig?.startDir ?? 'RIGHT',
    });
    setCrystalsCollected(0);

    // Garden
    setBloomedFlowers(0);

    // Cauldron
    setVariables({});

    // Tower
    setBridgeTiles(0);
    setActiveFunc(null);

    // Dungeon
    setPurifiedRunes([]);

    // Boss
    setBossHp(currentLevel.worldConfig?.bossMaxHp ?? 100);
    setPlayerHp(currentLevel.worldConfig?.playerMaxHp ?? 100);
    setHasShield(false);
    setBossState('idle');
  };

  // Block Manipulation Handlers
  const handleAddBlock = (type: BlockType) => {
    const newBlock: SpellBlock = {
      id: `b-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      type,
      params: {
        count: type === 'REPEAT_N' ? 5 : undefined,
        variableName: type === 'SET_VARIABLE' ? 'mana_flask' : undefined,
        variableValue: type === 'SET_VARIABLE' ? 100 : undefined,
        functionName: type === 'DEFINE_FUNCTION' || type === 'CALL_FUNCTION' ? 'build_bridge' : undefined,
        targetRune: type === 'PURIFY_RUNE' ? 1 : undefined,
        spellName: type === 'CAST_SPELL' ? 'Starlight Bolt' : undefined,
        color: type === 'GROW_FLOWER' ? '#F3A9D4' : undefined,
      },
      children: type === 'REPEAT_N' || type === 'DEFINE_FUNCTION' ? [] : undefined,
    };
    setBlocks([...blocks, newBlock]);
  };

  const handleUpdateParams = (id: string, params: Record<string, any>) => {
    setBlocks(blocks.map((b) => (b.id === id ? { ...b, params } : b)));
  };

  const handleDeleteBlock = (id: string) => {
    setBlocks(blocks.filter((b) => b.id !== id));
  };

  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    const updated = [...blocks];
    const temp = updated[index];
    updated[index] = updated[index - 1];
    updated[index - 1] = temp;
    setBlocks(updated);
  };

  const handleMoveDown = (index: number) => {
    if (index === blocks.length - 1) return;
    const updated = [...blocks];
    const temp = updated[index];
    updated[index] = updated[index + 1];
    updated[index + 1] = temp;
    setBlocks(updated);
  };

  const handleAddChild = (parentId: string, childType: BlockType) => {
    const childBlock: SpellBlock = {
      id: `bc-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      type: childType,
      params: {
        color: '#F3A9D4',
        spellName: 'Starlight Bolt',
      },
    };
    setBlocks(
      blocks.map((b) => {
        if (b.id === parentId) {
          return {
            ...b,
            children: [...(b.children || []), childBlock],
          };
        }
        return b;
      })
    );
  };

  const handleDeleteChild = (parentId: string, childId: string) => {
    setBlocks(
      blocks.map((b) => {
        if (b.id === parentId) {
          return {
            ...b,
            children: (b.children || []).filter((c) => c.id !== childId),
          };
        }
        return b;
      })
    );
  };

  // Helper delay function respecting speed multiplier
  const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms / speedMultiplier));

  // The Code-to-Magic Interpreter
  const executeSpell = async () => {
    if (isExecuting) return;
    setIsExecuting(true);
    setLastError(null);
    setStepMessage('Chanting spell incantations...');
    sound.playWandCast();

    // Local simulation states
    let localDragon = { ...dragonPos };
    let localCrystals = 0;
    let localBloomed = 0;
    let localVars: Record<string, any> = { ...variables };
    let localBridge = 0;
    let localRunes: number[] = [];
    let localBossHp = 100;
    let localHasShield = false;

    try {
      // Step through each block
      for (const block of blocks) {
        setActiveBlockId(block.id);

        if (block.type === 'SET_VARIABLE') {
          sound.playPotionBubble();
          const name = block.params.variableName || 'mana';
          const val = block.params.variableValue ?? 100;
          localVars[name] = val;
          setVariables({ ...localVars });
          setStepMessage(`Assigned variable ${name} = ${val}`);
          await delay(600);
        } else if (block.type === 'BREW_POTION') {
          sound.playPotionBubble();
          setStepMessage('Transmuting potion in cauldron...');
          await delay(800);
        } else if (block.type === 'REPEAT_N') {
          const repeatCount = block.params.count ?? 5;
          setStepMessage(`Starting enchantment loop: repeat ${repeatCount} times`);
          await delay(300);

          for (let step = 0; step < repeatCount; step++) {
            if (block.children && block.children.length > 0) {
              for (const child of block.children) {
                setActiveBlockId(child.id);

                if (child.type === 'GROW_FLOWER') {
                  localBloomed++;
                  setBloomedFlowers(localBloomed);
                  sound.playFlowerBloom();
                  setStepMessage(`Flower #${localBloomed} bloomed along the path!`);
                  await delay(450);
                } else if (child.type === 'BUILD_BRIDGE') {
                  localBridge++;
                  setBridgeTiles(localBridge);
                  sound.playWandCast();
                  setStepMessage(`Constructed bridge segment #${localBridge}`);
                  await delay(450);
                } else if (child.type === 'CAST_SPELL') {
                  sound.playWandCast();
                  localBossHp = Math.max(0, localBossHp - 15);
                  setBossHp(localBossHp);
                  setBossState('hit');
                  setStepMessage(`Starlight Bolt strike! Boss takes 15 dmg (${localBossHp} HP remain)`);
                  await delay(500);
                  setBossState('idle');
                } else if (child.type === 'MOVE_FORWARD') {
                  localDragon = executeMoveForward(localDragon);
                  setDragonPos({ ...localDragon });
                  sound.playDragonStep();
                  setStepMessage(`Sparky moved forward to (${localDragon.x}, ${localDragon.y})`);
                  await delay(450);
                }
              }
            } else {
              // Standalone empty loop
              await delay(200);
            }
          }
          setActiveBlockId(block.id);
        } else if (block.type === 'MOVE_FORWARD') {
          localDragon = executeMoveForward(localDragon);
          setDragonPos({ ...localDragon });
          sound.playDragonStep();
          setStepMessage(`Sparky stepped forward to (${localDragon.x}, ${localDragon.y})`);
          await delay(500);
        } else if (block.type === 'TURN_LEFT') {
          localDragon = executeTurn(localDragon, 'LEFT');
          setDragonPos({ ...localDragon });
          sound.playClick();
          setStepMessage(`Sparky pivoted left to face ${localDragon.direction}`);
          await delay(450);
        } else if (block.type === 'TURN_RIGHT') {
          localDragon = executeTurn(localDragon, 'RIGHT');
          setDragonPos({ ...localDragon });
          sound.playClick();
          setStepMessage(`Sparky pivoted right to face ${localDragon.direction}`);
          await delay(450);
        } else if (block.type === 'COLLECT_CRYSTAL') {
          const targetX = currentLevel.worldConfig?.targetX ?? 2;
          const targetY = currentLevel.worldConfig?.targetY ?? 2;
          if (localDragon.x === targetX && localDragon.y === targetY) {
            localCrystals++;
            setCrystalsCollected(localCrystals);
            sound.playFlowerBloom();
            setStepMessage(`Celestial Crystal collected at (${targetX}, ${targetY})!`);
          } else {
            sound.playError();
            throw new Error(
              `Sparky tried to collect crystal at (${localDragon.x}, ${localDragon.y}), but crystal is at (${targetX}, ${targetY})!`
            );
          }
          await delay(500);
        } else if (block.type === 'DEFINE_FUNCTION') {
          sound.playWandCast();
          const funcName = block.params.functionName || 'build_bridge';
          setStepMessage(`Function "${funcName}()" inscribed into memory.`);
          await delay(500);
        } else if (block.type === 'CALL_FUNCTION') {
          const funcName = block.params.functionName || 'build_bridge';
          setActiveFunc(funcName);
          setStepMessage(`Invoking function "${funcName}()"...`);

          if (funcName === 'holy_smite') {
            sound.playVictoryFanfare();
            localBossHp = 0;
            setBossHp(0);
            setBossState('defeated');
            setStepMessage('Holy Smite delivers the final 40 damage! The Overlord collapses!');
            await delay(800);
          } else {
            // Find definition in blocks
            const defBlock = blocks.find(
              (b) => b.type === 'DEFINE_FUNCTION' && b.params.functionName === funcName
            );
            if (defBlock && defBlock.children) {
              for (const child of defBlock.children) {
                if (child.type === 'REPEAT_N') {
                  const cnt = child.params.count ?? 4;
                  for (let s = 0; s < cnt; s++) {
                    localBridge++;
                    setBridgeTiles(localBridge);
                    sound.playWandCast();
                    await delay(400);
                  }
                } else if (child.type === 'BUILD_BRIDGE') {
                  localBridge++;
                  setBridgeTiles(localBridge);
                  sound.playWandCast();
                  await delay(400);
                }
              }
            } else {
              // Default fallback bridge
              localBridge = 4;
              setBridgeTiles(4);
              sound.playWandCast();
              await delay(600);
            }
          }
          setActiveFunc(null);
        } else if (block.type === 'PURIFY_RUNE') {
          const target = block.params.targetRune ?? 1;
          if (target > 3 || target < 1) {
            sound.playError();
            throw new Error(
              `Invalid Rune Target #${target}! The altar only contains Runes #1, #2, and #3.`
            );
          }
          if (!localRunes.includes(target)) {
            localRunes.push(target);
            setPurifiedRunes([...localRunes]);
            sound.playCurseBreak();
            setStepMessage(`Purified corrupted rune #${target}!`);
          }
          await delay(600);
        } else if (block.type === 'CAST_SPELL') {
          sound.playWandCast();
          localBossHp = Math.max(0, localBossHp - 15);
          setBossHp(localBossHp);
          setBossState('hit');
          setStepMessage(`Starlight Bolt deals 15 damage!`);
          await delay(450);
          setBossState('idle');
        }
      }

      // Check Level Win Conditions
      validateLevelCompletion(
        localDragon,
        localCrystals,
        localBloomed,
        localVars,
        localBridge,
        localRunes,
        localBossHp
      );
    } catch (err: any) {
      sound.playError();
      setLastError(err.message || 'Spell fizzled unexpectedly.');
      setStepMessage(`Execution halted: ${err.message}`);
    } finally {
      setIsExecuting(false);
      setActiveBlockId(null);
    }
  };

  // Turn movement helper
  const executeTurn = (
    dragon: { x: number; y: number; direction: 'UP' | 'RIGHT' | 'DOWN' | 'LEFT' },
    dir: 'LEFT' | 'RIGHT'
  ) => {
    const directions: Array<'UP' | 'RIGHT' | 'DOWN' | 'LEFT'> = ['UP', 'RIGHT', 'DOWN', 'LEFT'];
    const currentIdx = directions.indexOf(dragon.direction);
    const newIdx = dir === 'RIGHT' ? (currentIdx + 1) % 4 : (currentIdx + 3) % 4;
    return { ...dragon, direction: directions[newIdx] };
  };

  // Step forward movement helper with obstacle check
  const executeMoveForward = (dragon: {
    x: number;
    y: number;
    direction: 'UP' | 'RIGHT' | 'DOWN' | 'LEFT';
  }) => {
    let nextX = dragon.x;
    let nextY = dragon.y;

    if (dragon.direction === 'UP') nextY -= 1;
    if (dragon.direction === 'DOWN') nextY += 1;
    if (dragon.direction === 'LEFT') nextX -= 1;
    if (dragon.direction === 'RIGHT') nextX += 1;

    // Bounds check
    const gridSize = currentLevel.worldConfig?.gridSize ?? 5;
    if (nextX < 0 || nextX >= gridSize || nextY < 0 || nextY >= gridSize) {
      throw new Error(`Sparky tried to step off the grid boundary at (${nextX}, ${nextY})!`);
    }

    // Obstacle check
    const obstacles: Array<{ x: number; y: number; type: string }> =
      currentLevel.worldConfig?.obstacles || [];
    const hitObstacle = obstacles.find((o) => o.x === nextX && o.y === nextY);
    if (hitObstacle) {
      throw new Error(
        `Sparky ran into a ${hitObstacle.type === 'fire' ? 'fire brazier' : 'stone boulder'} at (${nextX}, ${nextY})! Turn around.`
      );
    }

    return { ...dragon, x: nextX, y: nextY };
  };

  // Validate win conditions based on worldType
  const validateLevelCompletion = (
    dragon: any,
    crystals: number,
    bloomed: number,
    vars: Record<string, any>,
    bridge: number,
    runes: number[],
    bossHealth: number
  ) => {
    let success = false;

    if (currentLevel.worldType === 'dragon-grid') {
      const targetX = currentLevel.worldConfig?.targetX ?? 2;
      const targetY = currentLevel.worldConfig?.targetY ?? 2;
      if (dragon.x === targetX && dragon.y === targetY && crystals >= 1) {
        success = true;
      } else {
        setLastError(
          `Sparky finished at (${dragon.x}, ${dragon.y}), but must reach the crystal at (${targetX}, ${targetY}) and collect it!`
        );
      }
    } else if (currentLevel.worldType === 'garden') {
      const target = currentLevel.worldConfig?.targetFlowerCount ?? 6;
      if (bloomed >= target) {
        success = true;
      } else {
        setLastError(`Garden needs ${target} flowers to blossom, but only ${bloomed} bloomed! Check loop count.`);
      }
    } else if (currentLevel.worldType === 'cauldron') {
      const targetVars = currentLevel.worldConfig?.targetVariables || {};
      const allMatched = Object.keys(targetVars).every((k) => vars[k] === targetVars[k]);
      if (allMatched) {
        success = true;
      } else {
        setLastError('The potion ingredients do not match the recipe. Check your flask values.');
      }
    } else if (currentLevel.worldType === 'bridge-tower') {
      const needed = currentLevel.worldConfig?.chasmWidth ?? 4;
      if (bridge >= needed) {
        success = true;
      } else {
        setLastError(`Bridge needs ${needed} segments to reach the tower, but only ${bridge} were built.`);
      }
    } else if (currentLevel.worldType === 'dungeon-runes') {
      if (runes.includes(1) && runes.includes(2) && runes.includes(3)) {
        success = true;
      } else {
        setLastError('Not all 3 runes were cleansed. Make sure runes #1, #2, and #3 are purified.');
      }
    } else if (currentLevel.worldType === 'boss-arena') {
      if (bossHealth <= 0) {
        success = true;
      } else {
        setLastError(`The Glitch Chimera still has ${bossHealth} HP! Use Starlight Bolt and holy_smite.`);
      }
    }

    if (success) {
      sound.playVictoryFanfare();
      setIsLevelSuccess(true);
      setStepMessage('🎉 Quest completed with magical excellence!');
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#9274D8', '#F3A9D4', '#B8E8DC', '#FFF2D8', '#FFB347'],
      });
      onLevelComplete(currentLevel.id, currentLevel.rewardXp, currentLevel.rewardGems);
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6 animate-fadeIn pb-12">
      {/* Top Quest Briefing Banner */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-gradient-to-r from-night-900/90 via-[#211936]/80 to-night-900/90 border border-magic/30 p-5 rounded-3xl shadow-xl">
        <div className="flex items-center gap-4">
          <button
            onClick={() => {
              sound.playClick();
              onBackToMap();
            }}
            className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-moonCream/80 text-xs font-fantasy flex items-center gap-1.5 transition-colors border border-white/10"
          >
            ← Map
          </button>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-spellPink font-fantasy">
                {currentLevel.realmName} • Quest {currentLevel.levelNumber}
              </span>
              {isLevelSuccess && (
                <span className="bg-manaMint/20 text-manaMint text-[10px] font-bold px-2 py-0.5 rounded-full border border-manaMint/40 flex items-center gap-1">
                  <Trophy className="w-3 h-3" /> Mastered
                </span>
              )}
            </div>
            <h2 className="font-fantasy font-bold text-xl text-moonCream mt-0.5">
              {currentLevel.title}
            </h2>
          </div>
        </div>

        {/* Rewards and Next Level Button */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              sound.playWandCast();
              onOpenGuide();
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-magic/20 hover:bg-magic/30 border border-magic/40 text-magic-light text-xs font-fantasy font-bold transition-all hover:scale-105"
          >
            <Sparkles className="w-3.5 h-3.5 text-spellPink" />
            <span className="hidden sm:inline">Step-by-Step Guide</span>
            <span className="sm:hidden">Guide</span>
          </button>

          <div className="flex items-center gap-2 bg-night-950/70 border border-white/10 px-3 py-1.5 rounded-xl text-xs">
            <span className="text-runeAmber font-code font-bold">+{currentLevel.rewardXp} XP</span>
            <span className="text-spellPink font-code font-bold">+{currentLevel.rewardGems} 💎</span>
          </div>

          {isLevelSuccess && onNextLevel && (
            <button
              onClick={() => {
                sound.playWandCast();
                onNextLevel();
              }}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-magic to-spellPink text-night-950 font-bold text-xs shadow-magic hover:opacity-95 transition-all hover:scale-105"
            >
              <span>Next Quest</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Quick Guide & "type code here" Banner */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-2xl bg-gradient-to-r from-night-900/90 via-[#261b40]/80 to-night-900/90 border border-spellPink/30 shadow-md text-xs">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-spellPink/20 border border-spellPink/40 flex items-center justify-center text-sm shrink-0">
            🪄
          </div>
          <div>
            <span className="font-fantasy font-bold text-moonCream">
              Apprentice Step Guide:
            </span>{' '}
            <span className="text-moonCream/80">
              Arrange blocks below or select <strong className="text-spellPink font-code">"type code here"</strong> to write code directly. Press Cast Spell to bring the world alive!
            </span>
          </div>
        </div>

        <button
          onClick={onOpenGuide}
          className="px-2.5 py-1 rounded-lg bg-manaMint/20 hover:bg-manaMint/30 border border-manaMint/40 text-manaMint text-[11px] font-bold font-fantasy flex items-center gap-1 transition-all shrink-0"
        >
          <span>Step-by-Step Guide</span>
          <ChevronRight className="w-3 h-3" />
        </button>
      </div>

      {/* Main Two-Column Playground Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Code / Spell Recipe Editor (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Action Toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-night-900/90 border border-magic/30 p-3 rounded-2xl shadow-md">
            {/* Play, Step, Reset Buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={executeSpell}
                disabled={isExecuting}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-magic to-spellPink text-night-950 font-bold text-xs shadow-magic hover:opacity-90 disabled:opacity-50 transition-all hover:scale-105"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>{isExecuting ? 'Casting...' : 'Cast Spell'}</span>
              </button>

              <button
                onClick={resetWorld}
                disabled={isExecuting}
                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-moonCream/80 hover:text-moonCream border border-white/10 transition-colors"
                title="Reset Simulation"
              >
                <RotateCcw className="w-4 h-4" />
              </button>

              {/* Speed Multiplier Button */}
              <button
                onClick={() => {
                  sound.playClick();
                  setSpeedMultiplier(speedMultiplier === 1 ? 2 : speedMultiplier === 2 ? 4 : 1);
                }}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-manaMint border border-white/10 text-xs font-code font-bold transition-colors"
                title="Execution Speed"
              >
                <FastForward className="w-3.5 h-3.5" />
                <span>{speedMultiplier}x</span>
              </button>
            </div>

            {/* View Mode Switcher: Blocks vs Type Code vs Python Code */}
            <div className="flex items-center bg-night-950/80 p-1 rounded-xl border border-white/10 text-xs">
              <button
                onClick={() => {
                  sound.playClick();
                  setViewMode('blocks');
                }}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-lg font-fantasy font-semibold transition-all ${
                  viewMode === 'blocks'
                    ? 'bg-magic text-night-950 shadow-sm'
                    : 'text-moonCream/60 hover:text-moonCream'
                }`}
              >
                <LayoutGrid className="w-3.5 h-3.5" /> Blocks
              </button>

              <button
                onClick={() => {
                  sound.playClick();
                  setViewMode('type-code');
                }}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-lg font-fantasy font-semibold transition-all ${
                  viewMode === 'type-code'
                    ? 'bg-spellPink text-night-950 shadow-sm font-bold'
                    : 'text-spellPink/80 hover:text-spellPink'
                }`}
                title="Type code directly"
              >
                <span>✍️</span> "type code here"
              </button>

              <button
                onClick={() => {
                  sound.playClick();
                  setViewMode('preview');
                }}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-lg font-fantasy font-semibold transition-all ${
                  viewMode === 'preview'
                    ? 'bg-magic text-night-950 shadow-sm'
                    : 'text-moonCream/60 hover:text-moonCream'
                }`}
              >
                <Code2 className="w-3.5 h-3.5" /> Python View
              </button>
            </div>
          </div>

          {/* Spell Recipe Canvas or Interactive Code Editor or Preview */}
          {viewMode === 'blocks' ? (
            <div className="space-y-4">
              {/* Recipe Instruction List */}
              <div className="p-4 rounded-3xl bg-night-900/60 border-2 border-magic/30 backdrop-blur shadow-inner min-h-[280px] space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-white/10 text-xs">
                  <span className="font-fantasy font-bold text-moonCream flex items-center gap-2">
                    <span>📜</span> Active Spell Recipe ({blocks.length} instructions)
                  </span>
                  <span className="text-[10px] text-magic-light font-code">
                    Runs Top-to-Bottom
                  </span>
                </div>

                {blocks.length === 0 ? (
                  <div className="text-center py-10 text-xs text-moonCream/40 border border-dashed border-white/10 rounded-2xl">
                    No spell instructions in recipe. Select blocks from the drawer below or switch to "type code here"!
                  </div>
                ) : (
                  blocks.map((block, idx) => (
                    <BlockItem
                      key={block.id}
                      block={block}
                      index={idx}
                      totalBlocks={blocks.length}
                      onUpdateParams={handleUpdateParams}
                      onDelete={handleDeleteBlock}
                      onMoveUp={handleMoveUp}
                      onMoveDown={handleMoveDown}
                      onAddChild={handleAddChild}
                      onDeleteChild={handleDeleteChild}
                      activeBlockId={activeBlockId}
                      allowedChildTypes={currentLevel.allowedBlockTypes}
                    />
                  ))
                )}
              </div>

              {/* Block Drawer for Adding New Commands */}
              <BlockDrawer
                onAddBlock={handleAddBlock}
                allowedTypes={currentLevel.allowedBlockTypes}
              />
            </div>
          ) : viewMode === 'type-code' ? (
            <div className="min-h-[460px]">
              <InteractiveCodeEditor
                initialBlocks={blocks}
                onApplyCode={(newBlocks) => setBlocks(newBlocks)}
                onExecuteNow={executeSpell}
                isExecuting={isExecuting}
                allowedTypes={currentLevel.allowedBlockTypes}
                currentLevel={currentLevel}
              />
            </div>
          ) : (
            <div className="h-[460px]">
              <CodeViewer blocks={blocks} />
            </div>
          )}

          {/* AI Mentor Assistant */}
          <ArchmageMentor
            hint1={currentLevel.hint1}
            hint2={currentLevel.hint2}
            hint3={currentLevel.hint3}
            conceptSummary={currentLevel.conceptSummary}
            lastError={lastError}
            isSuccess={isLevelSuccess}
          />
        </div>

        {/* Right Column: Live Game World Simulation (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="sticky top-4">
            {/* Render matching interactive world */}
            {currentLevel.worldType === 'dragon-grid' && (
              <DragonGridWorld
                gridSize={currentLevel.worldConfig?.gridSize ?? 5}
                dragonPos={dragonPos}
                targetPos={{
                  x: currentLevel.worldConfig?.targetX ?? 2,
                  y: currentLevel.worldConfig?.targetY ?? 2,
                }}
                obstacles={currentLevel.worldConfig?.obstacles ?? []}
                crystalsCollected={crystalsCollected}
                totalCrystalsNeeded={1}
                isGoalReached={isLevelSuccess}
                stepMessage={stepMessage}
                isExecuting={isExecuting}
              />
            )}

            {currentLevel.worldType === 'garden' && (
              <EnchantedGardenWorld
                bloomedCount={bloomedFlowers}
                targetCount={currentLevel.worldConfig?.targetFlowerCount ?? 6}
                isGoalReached={isLevelSuccess}
                stepMessage={stepMessage}
                isExecuting={isExecuting}
              />
            )}

            {currentLevel.worldType === 'cauldron' && (
              <PotionCauldronWorld
                variables={variables}
                targetVariables={currentLevel.worldConfig?.targetVariables ?? {}}
                potionName={currentLevel.worldConfig?.potionName ?? 'Elixir'}
                isGoalReached={isLevelSuccess}
                stepMessage={stepMessage}
                isExecuting={isExecuting}
              />
            )}

            {currentLevel.worldType === 'bridge-tower' && (
              <FunctionTowerWorld
                bridgeTilesBuilt={bridgeTiles}
                totalBridgeNeeded={currentLevel.worldConfig?.chasmWidth ?? 4}
                activeFunction={activeFunc}
                isGoalReached={isLevelSuccess}
                stepMessage={stepMessage}
                isExecuting={isExecuting}
              />
            )}

            {currentLevel.worldType === 'dungeon-runes' && (
              <DebuggingDungeonWorld
                purifiedRunes={purifiedRunes}
                targetRunes={[1, 2, 3]}
                isDoorUnlocked={isLevelSuccess}
                stepMessage={stepMessage}
                isExecuting={isExecuting}
              />
            )}

            {currentLevel.worldType === 'boss-arena' && (
              <BossBattleWorld
                bossHp={bossHp}
                maxBossHp={currentLevel.worldConfig?.bossMaxHp ?? 100}
                playerHp={playerHp}
                maxPlayerHp={currentLevel.worldConfig?.playerMaxHp ?? 100}
                hasShield={hasShield}
                bossState={bossState}
                stepMessage={stepMessage}
                isExecuting={isExecuting}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

