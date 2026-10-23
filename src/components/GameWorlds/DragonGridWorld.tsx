import React from 'react';
import { Sparkles, Trophy, Compass, Shield } from 'lucide-react';

export interface DragonGridProps {
  gridSize?: number;
  dragonPos: { x: number; y: number; direction: 'UP' | 'RIGHT' | 'DOWN' | 'LEFT' };
  targetPos: { x: number; y: number };
  obstacles?: Array<{ x: number; y: number; type: string }>;
  crystalsCollected: number;
  totalCrystalsNeeded: number;
  isGoalReached: boolean;
  stepMessage?: string;
  isExecuting?: boolean;
}

export const DragonGridWorld: React.FC<DragonGridProps> = ({
  gridSize = 5,
  dragonPos,
  targetPos,
  obstacles = [],
  crystalsCollected,
  totalCrystalsNeeded = 1,
  isGoalReached,
  stepMessage,
  isExecuting,
}) => {
  // Rotations for the baby dragon based on direction
  const rotationMap = {
    RIGHT: 'rotate-0',
    DOWN: 'rotate-90',
    LEFT: 'rotate-180 -scale-y-100', // flip when facing left so it is not upside down
    UP: '-rotate-90',
  };

  return (
    <div className="relative w-full h-full min-h-[420px] rounded-2xl bg-gradient-to-b from-[#19142b] to-[#0f0b1c] border border-magic/30 p-6 flex flex-col justify-between overflow-hidden shadow-2xl">
      {/* Background ambient glow stars */}
      <div className="absolute inset-0 pointer-events-none opacity-40">
        <div className="absolute top-6 left-10 w-2 h-2 rounded-full bg-manaMint animate-ping" />
        <div className="absolute top-1/4 right-16 w-3 h-3 rounded-full bg-spellPink animate-pulse" />
        <div className="absolute bottom-10 left-1/3 w-2 h-2 rounded-full bg-moonCream/80 animate-ping" />
      </div>

      {/* Header bar inside world */}
      <div className="flex items-center justify-between z-10 bg-night-900/80 backdrop-blur-md px-4 py-2.5 rounded-xl border border-magic/20">
        <div className="flex items-center gap-3">
          <span className="text-2xl animate-bounce">🐲</span>
          <div>
            <h4 className="font-fantasy font-bold text-sm text-moonCream tracking-wider">Sparky's Labyrinth</h4>
            <p className="text-xs text-manaMint/90 flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5 text-runeAmber" /> Facing: <span className="font-semibold text-moonCream">{dragonPos.direction}</span> ({dragonPos.x}, {dragonPos.y})
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-night-950/70 px-3 py-1 rounded-lg border border-magic/30">
            <span className="text-lg">💎</span>
            <span className="text-xs font-bold text-moonCream">
              {crystalsCollected} / {totalCrystalsNeeded} Crystals
            </span>
          </div>
          {isGoalReached && (
            <div className="flex items-center gap-1.5 bg-manaMint/20 border border-manaMint text-manaMint text-xs font-bold px-3 py-1 rounded-lg animate-pulse">
              <Trophy className="w-3.5 h-3.5" /> Portal Opened!
            </div>
          )}
        </div>
      </div>

      {/* The 2D Interactive Grid */}
      <div className="my-auto py-4 flex items-center justify-center z-10">
        <div
          className="grid gap-2.5 p-3 rounded-2xl bg-night-900/60 border border-magic/30 backdrop-blur shadow-inner"
          style={{
            gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))`,
            width: '100%',
            maxWidth: '380px',
            aspectRatio: '1 / 1',
          }}
        >
          {Array.from({ length: gridSize * gridSize }).map((_, index) => {
            const x = index % gridSize;
            const y = Math.floor(index / gridSize);

            const isDragonHere = dragonPos.x === x && dragonPos.y === y;
            const isTargetHere = targetPos.x === x && targetPos.y === y;
            const obstacle = obstacles.find((o) => o.x === x && o.y === y);

            return (
              <div
                key={`${x}-${y}`}
                className={`relative rounded-xl border flex items-center justify-center transition-all duration-300 ${
                  isDragonHere
                    ? 'bg-magic/25 border-magic shadow-magic scale-105'
                    : isTargetHere
                    ? 'bg-runeAmber/20 border-runeAmber/70 animate-pulse'
                    : obstacle
                    ? 'bg-night-950/80 border-red-900/40'
                    : 'bg-night-800/40 border-magic/15 hover:border-magic/40'
                }`}
              >
                {/* Coordinates tiny indicator */}
                <span className="absolute top-1 left-1.5 text-[9px] text-magic-light/40 select-none">
                  {x},{y}
                </span>

                {/* Target Crystal */}
                {isTargetHere && (
                  <div className="relative flex items-center justify-center">
                    <span className="text-3xl filter drop-shadow-[0_0_12px_rgba(255,179,71,0.9)] animate-float">
                      💎
                    </span>
                    <div className="absolute -inset-1 bg-runeAmber/30 blur-md rounded-full -z-10" />
                  </div>
                )}

                {/* Obstacle Rock or Fire */}
                {obstacle && (
                  <span className="text-2xl filter drop-shadow-md select-none">
                    {obstacle.type === 'fire' ? '🔥' : '🪨'}
                  </span>
                )}

                {/* Dragon Sprite */}
                {isDragonHere && (
                  <div
                    className={`relative z-20 flex items-center justify-center transition-transform duration-300 ${rotationMap[dragonPos.direction]}`}
                  >
                    <div className="relative text-3xl filter drop-shadow-[0_0_10px_rgba(184,232,220,0.8)]">
                      🐲
                    </div>
                    {isExecuting && (
                      <Sparkles className="absolute -top-2 -right-2 w-4 h-4 text-spellPink animate-spin-slow" />
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer status feedback banner */}
      <div className="z-10 flex items-center justify-between text-xs bg-night-900/90 border border-magic/20 px-4 py-2 rounded-xl">
        <div className="flex items-center gap-2 text-moonCream/90 truncate">
          <Shield className="w-3.5 h-3.5 text-magic-light shrink-0" />
          <span className="truncate">{stepMessage || 'Assemble blocks and cast your spell to guide Sparky!'}</span>
        </div>
        <div className="flex items-center gap-1.5 text-manaMint text-[11px] shrink-0 font-medium ml-2">
          <span>Grid 5x5</span>
        </div>
      </div>
    </div>
  );
};

