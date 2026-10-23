import React from 'react';
import { Wand2, Sparkles, Trophy, Layers } from 'lucide-react';

export interface FunctionTowerProps {
  bridgeTilesBuilt: number;
  totalBridgeNeeded: number;
  activeFunction: string | null;
  isGoalReached: boolean;
  stepMessage?: string;
  isExecuting?: boolean;
}

export const FunctionTowerWorld: React.FC<FunctionTowerProps> = ({
  bridgeTilesBuilt,
  totalBridgeNeeded = 4,
  activeFunction,
  isGoalReached,
  stepMessage,
  isExecuting,
}) => {
  return (
    <div className="relative w-full h-full min-h-[420px] rounded-2xl bg-gradient-to-b from-[#181236] via-[#120d2a] to-[#0a0718] border border-magic/30 p-6 flex flex-col justify-between overflow-hidden shadow-2xl">
      {/* Astral Cosmos Background */}
      <div className="absolute inset-0 pointer-events-none opacity-40">
        <div className="absolute top-10 left-12 w-2 h-2 rounded-full bg-astralCyan animate-ping" />
        <div className="absolute top-1/3 right-1/4 w-3 h-3 rounded-full bg-magic-glow animate-pulse" />
        <div className="absolute bottom-1/4 left-1/2 w-1.5 h-1.5 rounded-full bg-moonCream animate-ping" />
      </div>

      {/* Top Header */}
      <div className="flex items-center justify-between z-10 bg-night-900/80 backdrop-blur-md px-4 py-2.5 rounded-xl border border-magic/20">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-magic/20 border border-magic/40 flex items-center justify-center text-xl">
            🔮
          </div>
          <div>
            <h4 className="font-fantasy font-bold text-sm text-moonCream tracking-wider">The Bridge of Aether</h4>
            <p className="text-xs text-magic-light flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5" /> Call Stack: <span className="font-code font-bold text-moonCream">{activeFunction ? `main() → ${activeFunction}()` : 'idle'}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-night-950/70 px-3 py-1 rounded-lg border border-magic/30">
            <span className="text-sm">💎</span>
            <span className="text-xs font-bold text-moonCream">
              {bridgeTilesBuilt} / {totalBridgeNeeded} Segments Built
            </span>
          </div>

          {isGoalReached && (
            <div className="flex items-center gap-1.5 bg-magic/20 border border-magic text-magic-light text-xs font-bold px-3 py-1 rounded-lg animate-pulse">
              <Trophy className="w-3.5 h-3.5" /> Chasm Spanned!
            </div>
          )}
        </div>
      </div>

      {/* Main Bridge Floating Islands Canvas */}
      <div className="my-auto py-8 z-10 flex flex-col items-center justify-center">
        <div className="w-full max-w-xl flex items-center justify-between gap-2 px-4">
          {/* Left Floating Island (Start) */}
          <div className="relative flex flex-col items-center">
            <div className="w-20 h-24 rounded-2xl bg-gradient-to-b from-[#3a2d61] to-[#1c1533] border-2 border-magic/60 flex flex-col items-center justify-center shadow-lg">
              <span className="text-2xl animate-bounce">🧙‍♂️</span>
              <span className="text-[10px] font-fantasy text-moonCream/80 mt-1">Starting Cliff</span>
            </div>
            <div className="w-16 h-4 bg-black/40 blur-sm rounded-full -mt-2 -z-10" />
          </div>

          {/* The Bridge Segments Crossing The Astral Void */}
          <div className="flex-1 flex items-center justify-center gap-2 py-4 px-2">
            {Array.from({ length: totalBridgeNeeded }).map((_, idx) => {
              const isBuilt = idx < bridgeTilesBuilt;

              return (
                <div
                  key={idx}
                  className={`flex-1 h-16 rounded-xl border flex flex-col items-center justify-center transition-all duration-500 relative ${
                    isBuilt
                      ? 'bg-gradient-to-t from-magic/80 via-astralCyan/60 to-white/90 border-astralCyan shadow-[0_0_20px_rgba(86,226,216,0.6)] scale-105'
                      : 'bg-night-950/40 border-dashed border-magic/30 opacity-40'
                  }`}
                >
                  {isBuilt ? (
                    <div className="flex flex-col items-center animate-pulse">
                      <span className="text-lg">✨</span>
                      <span className="text-[9px] font-code font-bold text-night-950">
                        seg_{idx + 1}
                      </span>
                    </div>
                  ) : (
                    <span className="text-[10px] text-magic/40 font-code">void</span>
                  )}

                  {/* Active construction spark */}
                  {isExecuting && bridgeTilesBuilt === idx + 1 && (
                    <div className="absolute -top-3 w-4 h-4 text-moonCream animate-ping">
                      ⚡
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Right Floating Island (Destination High Tower) */}
          <div className="relative flex flex-col items-center">
            <div
              className={`w-20 h-24 rounded-2xl border-2 flex flex-col items-center justify-center shadow-lg transition-all ${
                isGoalReached
                  ? 'bg-gradient-to-b from-magic to-night-950 border-manaMint shadow-[0_0_25px_rgba(184,232,220,0.5)]'
                  : 'bg-gradient-to-b from-[#3a2d61] to-[#1c1533] border-magic/60'
              }`}
            >
              <span className="text-2xl animate-pulse">🏰</span>
              <span className="text-[10px] font-fantasy text-moonCream/80 mt-1">High Citadel</span>
            </div>
            <div className="w-16 h-4 bg-black/40 blur-sm rounded-full -mt-2 -z-10" />
          </div>
        </div>
      </div>

      {/* Footer info */}
      <div className="z-10 flex items-center justify-between text-xs bg-night-900/90 border border-magic/20 px-4 py-2.5 rounded-xl">
        <div className="flex items-center gap-2 text-moonCream/90 truncate">
          <Wand2 className="w-4 h-4 text-magic-light shrink-0" />
          <span className="truncate">{stepMessage || 'Define your bridge spell and invoke it to cross!'}</span>
        </div>
        <div className="text-[11px] text-magic-light/80 shrink-0 font-code ml-2">
          def build_bridge()
        </div>
      </div>
    </div>
  );
};

