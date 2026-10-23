import React from 'react';
import { ShieldAlert, Sparkles, Trophy, Unlock, Lock } from 'lucide-react';

export interface DebuggingDungeonProps {
  purifiedRunes: number[];
  targetRunes: number[];
  isDoorUnlocked: boolean;
  stepMessage?: string;
  isExecuting?: boolean;
}

export const DebuggingDungeonWorld: React.FC<DebuggingDungeonProps> = ({
  purifiedRunes,
  targetRunes = [1, 2, 3],
  isDoorUnlocked,
  stepMessage,
  isExecuting,
}) => {
  const runeDetails = [
    { id: 1, symbol: 'ᚠ', name: 'Fehu', desc: 'Rune of Power' },
    { id: 2, symbol: 'ᚢ', name: 'Uruz', desc: 'Rune of Strength' },
    { id: 3, symbol: 'ᚦ', name: 'Thuris', desc: 'Rune of Warding' },
  ];

  return (
    <div className="relative w-full h-full min-h-[420px] rounded-2xl bg-gradient-to-b from-[#2d1216] via-[#1a0e14] to-[#0c0609] border border-cursedRed/40 p-6 flex flex-col justify-between overflow-hidden shadow-2xl">
      {/* Cursed Crimson Wisps */}
      <div className="absolute inset-0 pointer-events-none opacity-40">
        <div className="absolute top-1/4 left-10 w-24 h-24 rounded-full bg-cursedRed/20 blur-2xl animate-pulse" />
        <div className="absolute top-1/2 right-12 w-32 h-32 rounded-full bg-orange-600/20 blur-3xl" />
      </div>

      {/* Top Header */}
      <div className="flex items-center justify-between z-10 bg-night-900/80 backdrop-blur-md px-4 py-2.5 rounded-xl border border-cursedRed/30">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-cursedRed/20 border border-cursedRed/50 flex items-center justify-center text-xl">
            ⚡
          </div>
          <div>
            <h4 className="font-fantasy font-bold text-sm text-moonCream tracking-wider">The Obsidian Dungeon Gate</h4>
            <p className="text-xs text-spellPink/90 flex items-center gap-1.5">
              <ShieldAlert className="w-3.5 h-3.5 text-cursedRed" /> Curse Status: <span className="font-bold text-moonCream">{isDoorUnlocked ? 'PURIFIED' : 'ACTIVE HEX'}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-night-950/70 px-3 py-1 rounded-lg border border-cursedRed/30">
            {isDoorUnlocked ? (
              <Unlock className="w-4 h-4 text-manaMint" />
            ) : (
              <Lock className="w-4 h-4 text-cursedRed" />
            )}
            <span className="text-xs font-bold text-moonCream">
              {purifiedRunes.length} / {targetRunes.length} Runes Purified
            </span>
          </div>

          {isDoorUnlocked && (
            <div className="flex items-center gap-1.5 bg-manaMint/20 border border-manaMint text-manaMint text-xs font-bold px-3 py-1 rounded-lg animate-pulse">
              <Trophy className="w-3.5 h-3.5" /> Door Unlocked!
            </div>
          )}
        </div>
      </div>

      {/* Main Altar: The 3 Runes and The Locked Vault */}
      <div className="my-auto py-4 z-10 grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
        {/* Runes Altar */}
        <div className="flex flex-col items-center gap-4 bg-night-950/60 border border-white/10 rounded-2xl p-5 backdrop-blur">
          <span className="text-xs font-fantasy uppercase tracking-wider text-moonCream/70">
            Altar of Corrupted Runes
          </span>

          <div className="flex items-center gap-4">
            {runeDetails.map((rune) => {
              const isPurified = purifiedRunes.includes(rune.id);

              return (
                <div
                  key={rune.id}
                  className={`w-20 h-24 rounded-2xl border-2 flex flex-col items-center justify-center p-2 transition-all duration-500 relative ${
                    isPurified
                      ? 'bg-gradient-to-b from-manaMint/30 to-teal-950/80 border-manaMint shadow-[0_0_20px_rgba(184,232,220,0.5)] scale-105'
                      : 'bg-gradient-to-b from-cursedRed/20 to-night-950 border-cursedRed/70 shadow-[0_0_15px_rgba(255,89,100,0.3)] animate-pulse'
                  }`}
                >
                  <span
                    className={`text-3xl font-fantasy font-bold transition-all ${
                      isPurified
                        ? 'text-manaMint filter drop-shadow-[0_0_10px_rgba(184,232,220,0.9)]'
                        : 'text-cursedRed filter drop-shadow-[0_0_10px_rgba(255,89,100,0.9)]'
                    }`}
                  >
                    {rune.symbol}
                  </span>

                  <span className="text-[10px] font-bold text-moonCream/80 mt-1">
                    Rune #{rune.id}
                  </span>

                  <span className="text-[9px] text-moonCream/50">
                    {rune.name}
                  </span>

                  {/* Status pill */}
                  <div
                    className={`mt-1 text-[8px] px-1.5 py-0.5 rounded font-bold uppercase ${
                      isPurified
                        ? 'bg-manaMint text-night-950'
                        : 'bg-cursedRed/80 text-white'
                    }`}
                  >
                    {isPurified ? 'CLEANSED' : 'CURSED'}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* The Giant Obsidian Vault Door */}
        <div className="flex flex-col items-center justify-center">
          <div
            className={`relative w-48 h-56 rounded-t-full border-4 flex flex-col items-center justify-center p-4 transition-all duration-700 shadow-2xl ${
              isDoorUnlocked
                ? 'bg-gradient-to-b from-teal-900/60 to-night-950 border-manaMint shadow-[0_0_35px_rgba(184,232,220,0.5)]'
                : 'bg-gradient-to-b from-[#21171a] to-night-950 border-red-950/80 shadow-[0_0_20px_rgba(255,89,100,0.2)]'
            }`}
          >
            {/* Dungeon Archway Runes */}
            <div className="absolute top-3 text-[10px] text-moonCream/40 font-code tracking-widest">
              VAULT OF MALAKAR
            </div>

            {/* Chains overlay if locked */}
            {!isDoorUnlocked ? (
              <div className="flex flex-col items-center animate-pulse">
                <span className="text-4xl">⛓️</span>
                <span className="text-3xl -mt-2">🔒</span>
                <span className="text-[11px] font-bold text-cursedRed mt-2 text-center">
                  SEALED BY CURSE
                </span>
              </div>
            ) : (
              <div className="flex flex-col items-center animate-bounce">
                <Sparkles className="w-10 h-10 text-manaMint animate-spin-slow" />
                <span className="text-2xl mt-1">🚪✨</span>
                <span className="text-[11px] font-bold text-manaMint mt-2 tracking-wider">
                  CHAINS DISSOLVED
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer info */}
      <div className="z-10 flex items-center justify-between text-xs bg-night-900/90 border border-cursedRed/30 px-4 py-2.5 rounded-xl">
        <div className="flex items-center gap-2 text-moonCream/90 truncate">
          <Sparkles className="w-4 h-4 text-cursedRed shrink-0 animate-spin-slow" />
          <span className="truncate">{stepMessage || 'Find the bug in the spell recipe and purify all 3 runes!'}</span>
        </div>
        <div className="text-[11px] text-cursedRed/90 shrink-0 font-code ml-2">
          purify_rune(1..3)
        </div>
      </div>
    </div>
  );
};

