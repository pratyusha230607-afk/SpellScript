import React from 'react';
import { Sparkles, Trophy, Flower2, SunMedium } from 'lucide-react';

export interface EnchantedGardenProps {
  bloomedCount: number;
  targetCount: number;
  isGoalReached: boolean;
  stepMessage?: string;
  isExecuting?: boolean;
}

export const EnchantedGardenWorld: React.FC<EnchantedGardenProps> = ({
  bloomedCount,
  targetCount,
  isGoalReached,
  stepMessage,
  isExecuting,
}) => {
  // Flower colors & emojis for variety
  const flowerTypes = [
    { emoji: '🌸', color: '#F3A9D4', name: 'Lotus of Aether' },
    { emoji: '🌼', color: '#fed894', name: 'Sun Blossom' },
    { emoji: '🌺', color: '#ff8fd0', name: 'Ember Rose' },
    { emoji: '🌷', color: '#bda6f7', name: 'Twilight Tulip' },
    { emoji: '🌻', color: '#FFB347', name: 'Cosmic Marigold' },
    { emoji: '🪷', color: '#B8E8DC', name: 'Mana Waterlily' },
  ];

  return (
    <div className="relative w-full h-full min-h-[420px] rounded-2xl bg-gradient-to-b from-[#11241f] via-[#141d28] to-[#0c121e] border border-manaMint/30 p-6 flex flex-col justify-between overflow-hidden shadow-2xl">
      {/* Mystical Fireflies & Pollen Particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-8 w-2 h-2 rounded-full bg-manaMint/70 animate-ping" />
        <div className="absolute top-1/2 right-12 w-2.5 h-2.5 rounded-full bg-moonCream/80 animate-pulse" />
        <div className="absolute bottom-16 left-1/4 w-3 h-3 rounded-full bg-spellPink/60 animate-bounce" />
        {/* Soft background radial moonlight */}
        <div className="absolute top-0 right-1/4 w-72 h-72 rounded-full bg-manaMint/10 blur-3xl pointer-events-none" />
      </div>

      {/* Top Header */}
      <div className="flex items-center justify-between z-10 bg-night-900/80 backdrop-blur-md px-4 py-2.5 rounded-xl border border-manaMint/20">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-manaMint/20 border border-manaMint/40 flex items-center justify-center text-xl">
            🌿
          </div>
          <div>
            <h4 className="font-fantasy font-bold text-sm text-moonCream tracking-wider">The Enchanted Garden</h4>
            <p className="text-xs text-manaMint flex items-center gap-1">
              <SunMedium className="w-3.5 h-3.5" /> Flora Resonance Level: <span className="font-bold text-moonCream">{Math.round((bloomedCount / targetCount) * 100)}%</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-night-950/70 px-3 py-1 rounded-lg border border-manaMint/30">
            <Flower2 className="w-4 h-4 text-spellPink" />
            <span className="text-xs font-bold text-moonCream">
              {bloomedCount} / {targetCount} Bloomed
            </span>
          </div>

          {isGoalReached && (
            <div className="flex items-center gap-1.5 bg-manaMint/20 border border-manaMint text-manaMint text-xs font-bold px-3 py-1 rounded-lg animate-pulse">
              <Trophy className="w-3.5 h-3.5" /> Meadow Rejuvenated!
            </div>
          )}
        </div>
      </div>

      {/* Garden Meadow Plots */}
      <div className="my-auto py-6 z-10">
        <div className="max-w-xl mx-auto">
          {/* Garden Soil Path Bed */}
          <div className="relative rounded-3xl bg-[#1b2b24]/80 border-2 border-dashed border-manaMint/30 p-6 backdrop-blur shadow-2xl">
            {/* Wooden decorative border sign */}
            <div className="text-center mb-4">
              <span className="text-xs font-fantasy uppercase tracking-widest text-manaMint/90 px-3 py-1 bg-night-950/60 rounded-full border border-manaMint/20">
                ✦ Sacred Enchanted Soil ✦
              </span>
            </div>

            {/* Grid of Flower Plots */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3.5 justify-center">
              {Array.from({ length: targetCount }).map((_, index) => {
                const isBloomed = index < bloomedCount;
                const flowerType = flowerTypes[index % flowerTypes.length];

                return (
                  <div
                    key={index}
                    className={`relative aspect-square rounded-2xl flex flex-col items-center justify-center p-2 transition-all duration-500 ${
                      isBloomed
                        ? 'bg-gradient-to-t from-emerald-950/90 to-teal-900/60 border border-manaMint shadow-[0_0_20px_rgba(184,232,220,0.35)] scale-105'
                        : 'bg-night-950/60 border border-white/5 opacity-60'
                    }`}
                  >
                    {/* Flower Sprite or Seed */}
                    {isBloomed ? (
                      <div className="relative flex flex-col items-center animate-sparkle">
                        <span className="text-3xl filter drop-shadow-[0_0_8px_rgba(243,169,212,0.9)]">
                          {flowerType.emoji}
                        </span>
                        <span className="text-[10px] font-bold text-manaMint mt-1 tracking-tight">
                          Bloom {index + 1}
                        </span>
                        {/* Shimmer light */}
                        <div
                          className="absolute -inset-1 rounded-full blur-md opacity-40 pointer-events-none"
                          style={{ backgroundColor: flowerType.color }}
                        />
                      </div>
                    ) : (
                      <div className="flex flex-col items-center gap-1 opacity-50">
                        <span className="text-lg">🌱</span>
                        <span className="text-[9px] text-moonCream/40 font-code">
                          plot {index + 1}
                        </span>
                      </div>
                    )}

                    {/* Step indicator active glow */}
                    {isExecuting && bloomedCount === index + 1 && (
                      <div className="absolute inset-0 border-2 border-spellPink rounded-2xl animate-ping pointer-events-none" />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Footer feedback */}
      <div className="z-10 flex items-center justify-between text-xs bg-night-900/90 border border-manaMint/20 px-4 py-2.5 rounded-xl">
        <div className="flex items-center gap-2 text-moonCream/90 truncate">
          <Sparkles className="w-4 h-4 text-manaMint shrink-0 animate-spin-slow" />
          <span className="truncate">{stepMessage || 'Cast your loop spell to cultivate the garden!'}</span>
        </div>
        <div className="text-[11px] text-manaMint/80 shrink-0 font-code ml-2">
          repeat {targetCount} times: grow_flower()
        </div>
      </div>
    </div>
  );
};

