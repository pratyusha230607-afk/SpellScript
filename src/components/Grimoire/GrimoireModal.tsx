import React, { useState } from 'react';
import { GRIMOIRE_ENTRIES } from '../../data/quests';
import { GrimoireEntry } from '../../types';
import { BookOpen, X, Sparkles, Copy, Check, FlaskConical, Repeat, Wand2, ShieldAlert, Compass } from 'lucide-react';
import { sound } from '../../utils/sound';

export interface GrimoireModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoadSampleToWorkspace?: (entry: GrimoireEntry) => void;
}

export const GrimoireModal: React.FC<GrimoireModalProps> = ({
  isOpen,
  onClose,
  onLoadSampleToWorkspace,
}) => {
  const [selectedEntryId, setSelectedEntryId] = useState<string>(GRIMOIRE_ENTRIES[0].id);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  if (!isOpen) return null;

  const currentEntry = GRIMOIRE_ENTRIES.find((e) => e.id === selectedEntryId) || GRIMOIRE_ENTRIES[0];

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Foundations':
        return <FlaskConical className="w-4 h-4 text-spellPink" />;
      case 'Control Flow':
        return <Repeat className="w-4 h-4 text-manaMint" />;
      case 'Modularity':
        return <Wand2 className="w-4 h-4 text-magic-light" />;
      case 'Diagnostics':
        return <ShieldAlert className="w-4 h-4 text-cursedRed" />;
      default:
        return <Compass className="w-4 h-4 text-runeAmber" />;
    }
  };

  const handleCopy = (text: string, id: string) => {
    sound.playClick();
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-night-950/80 backdrop-blur-md animate-fadeIn">
      {/* The Grimoire Book Container */}
      <div className="relative w-full max-w-4xl max-h-[85vh] bg-gradient-to-br from-[#241a38] via-[#1a1329] to-[#0f0b18] border-2 border-magic/60 rounded-3xl shadow-magic-lg flex flex-col overflow-hidden">
        {/* Book Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-magic/30 bg-night-900/90">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-magic/20 border border-magic/40 flex items-center justify-center text-xl shadow-inner">
              📖
            </div>
            <div>
              <h2 className="font-fantasy font-bold text-lg text-moonCream tracking-wider flex items-center gap-2">
                The Arcane Grimoire <Sparkles className="w-4 h-4 text-spellPink" />
              </h2>
              <p className="text-xs text-manaMint">The Compendium of Code Magic & Lore</p>
            </div>
          </div>

          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-moonCream/60 hover:text-moonCream transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Book Layout: Left Table of Contents, Right Illuminated Page */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-3 overflow-hidden">
          {/* Table of Chapters Sidebar */}
          <div className="p-4 border-r border-magic/20 bg-night-950/40 overflow-y-auto space-y-2">
            <div className="text-[11px] font-fantasy uppercase tracking-widest text-moonCream/50 px-2 py-1">
              Chapters of Logic
            </div>

            {GRIMOIRE_ENTRIES.map((entry) => {
              const isSelected = entry.id === selectedEntryId;

              return (
                <button
                  key={entry.id}
                  onClick={() => {
                    sound.playClick();
                    setSelectedEntryId(entry.id);
                  }}
                  className={`w-full text-left p-3 rounded-xl border transition-all flex items-center gap-3 ${
                    isSelected
                      ? 'bg-magic/25 border-magic text-moonCream shadow-magic'
                      : 'bg-night-900/50 border-white/5 text-moonCream/70 hover:bg-white/5 hover:text-moonCream'
                  }`}
                >
                  <div className="p-2 rounded-lg bg-night-950/60 border border-white/10">
                    {getCategoryIcon(entry.category)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-fantasy font-bold truncate">{entry.title}</div>
                    <div className="text-[10px] text-magic-light truncate">{entry.category}</div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Right Page: Illuminated Concept & Code */}
          <div className="col-span-2 p-6 overflow-y-auto space-y-5 bg-gradient-to-b from-[#1b142b]/60 to-transparent">
            {/* Title & Category Badge */}
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-magic/20 text-magic-light border border-magic/30">
                  {currentEntry.category}
                </span>
                <h3 className="font-fantasy font-bold text-xl text-moonCream mt-1">
                  {currentEntry.title}
                </h3>
              </div>

              {onLoadSampleToWorkspace && (
                <button
                  onClick={() => {
                    sound.playWandCast();
                    onLoadSampleToWorkspace(currentEntry);
                    onClose();
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-magic to-spellPink text-night-950 font-bold text-xs shadow-magic hover:opacity-90 transition-opacity"
                >
                  <Sparkles className="w-3.5 h-3.5" /> Cast in Lab
                </button>
              )}
            </div>

            {/* Fantasy Analogy Callout Card */}
            <div className="p-4 rounded-2xl bg-night-900/80 border border-spellPink/30 space-y-1 shadow-inner">
              <div className="text-xs font-fantasy font-bold text-spellPink flex items-center gap-1.5">
                <span>🪄</span> The Magical Metaphor
              </div>
              <p className="text-xs text-moonCream/90 leading-relaxed">
                {currentEntry.magicAnalogy}
              </p>
            </div>

            {/* Programming Explanation */}
            <div className="space-y-1.5">
              <h4 className="text-xs font-fantasy font-bold text-manaMint uppercase tracking-wider">
                Arcane Mechanics (How it Works)
              </h4>
              <p className="text-xs text-moonCream/80 leading-relaxed">
                {currentEntry.description}
              </p>
            </div>

            {/* Python Code Example Box */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-fantasy font-bold text-moonCream/80 flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5 text-runeAmber" /> Python Spell Formula
                </span>
                <button
                  onClick={() => handleCopy(currentEntry.codeSnippet, currentEntry.id)}
                  className="flex items-center gap-1 text-[11px] text-magic-light hover:text-moonCream px-2 py-0.5 rounded bg-white/5"
                >
                  {copiedId === currentEntry.id ? (
                    <>
                      <Check className="w-3 h-3 text-manaMint" /> Copied
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" /> Copy Snippet
                    </>
                  )}
                </button>
              </div>

              <pre className="bg-night-950/90 border border-magic/30 p-3.5 rounded-xl font-code text-xs text-manaMint overflow-x-auto shadow-inner leading-relaxed">
                <code>{currentEntry.codeSnippet}</code>
              </pre>
            </div>
          </div>
        </div>

        {/* Book Footer */}
        <div className="px-6 py-3 border-t border-magic/20 bg-night-900/90 flex items-center justify-between text-xs text-moonCream/60">
          <span>Grimoire of the High Academy</span>
          <span className="text-magic-light">Preserved for Master Sorcerers</span>
        </div>
      </div>
    </div>
  );
};

