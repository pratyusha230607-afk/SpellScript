import React, { useState } from 'react';
import { HelpCircle, ChevronRight, Sparkles, AlertCircle, Lightbulb, CheckCircle2 } from 'lucide-react';
import { sound } from '../../utils/sound';

export interface MentorProps {
  hint1: string;
  hint2: string;
  hint3: string;
  conceptSummary: {
    term: string;
    analogy: string;
    codeExample: string;
  };
  lastError?: string | null;
  isSuccess?: boolean;
}

export const ArchmageMentor: React.FC<MentorProps> = ({
  hint1,
  hint2,
  hint3,
  conceptSummary,
  lastError,
  isSuccess,
}) => {
  const [hintTier, setHintTier] = useState<number>(0);
  const [showConcept, setShowConcept] = useState<boolean>(false);

  const hints = [hint1, hint2, hint3];

  const handleNextHint = () => {
    sound.playClick();
    if (hintTier < 3) {
      setHintTier((prev) => prev + 1);
    }
  };

  return (
    <div className="bg-gradient-to-b from-[#211936] to-[#140f24] border border-magic/40 rounded-2xl p-4 shadow-xl relative overflow-hidden">
      {/* Mentor Header */}
      <div className="flex items-center justify-between pb-3 border-b border-white/10">
        <div className="flex items-center gap-3">
          {/* Animated Mentor Avatar */}
          <div className="relative">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-magic to-spellPink flex items-center justify-center text-xl shadow-lg border border-moonCream/30">
              🧙‍♀️
            </div>
            <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-manaMint border-2 border-night-950 flex items-center justify-center text-[8px] font-bold text-night-950">
              AI
            </div>
          </div>

          <div>
            <h4 className="font-fantasy font-bold text-sm text-moonCream flex items-center gap-1.5">
              Archmage Lumina <Sparkles className="w-3.5 h-3.5 text-spellPink" />
            </h4>
            <p className="text-[11px] text-manaMint">Academy Logic Mentor</p>
          </div>
        </div>

        <button
          onClick={() => {
            sound.playClick();
            setShowConcept(!showConcept);
          }}
          className="text-xs flex items-center gap-1 px-2.5 py-1 rounded-lg bg-magic/20 hover:bg-magic/30 border border-magic/40 text-magic-light transition-all"
        >
          <Lightbulb className="w-3.5 h-3.5" />
          <span>{showConcept ? 'Hide Concept' : 'Concept Analogy'}</span>
        </button>
      </div>

      {/* Dynamic Feedback Area */}
      <div className="mt-3 space-y-2.5">
        {/* Error or Bug alert if failed */}
        {lastError ? (
          <div className="p-3 rounded-xl bg-red-950/70 border border-cursedRed text-xs text-spellPink flex items-start gap-2.5 animate-shake">
            <AlertCircle className="w-4 h-4 text-cursedRed shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-cursedRed">Curse / Error Detected:</span>
              <p className="mt-0.5 text-moonCream/90">{lastError}</p>
            </div>
          </div>
        ) : isSuccess ? (
          <div className="p-3 rounded-xl bg-emerald-950/70 border border-manaMint text-xs text-manaMint flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-manaMint shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-manaMint">Brilliant Incantation!</span>
              <p className="mt-0.5 text-moonCream/90">
                Your logical instructions harmonized with the world. Ready for the next realm?
              </p>
            </div>
          </div>
        ) : (
          <div className="text-xs text-moonCream/80 italic bg-night-950/50 p-2.5 rounded-xl border border-white/5">
            "Observe the cause and effect of each instruction. When ready, summon your magic!"
          </div>
        )}

        {/* Concept Analogy Card if toggled */}
        {showConcept && (
          <div className="p-3 rounded-xl bg-purple-950/60 border border-magic/30 text-xs space-y-1.5 transition-all">
            <div className="font-fantasy font-bold text-moonCream flex items-center gap-1">
              <span>📜</span> {conceptSummary.term}
            </div>
            <p className="text-magic-light">
              <strong className="text-moonCream">Fantasy Analogy:</strong> {conceptSummary.analogy}
            </p>
            <pre className="bg-night-950/80 p-2 rounded text-[11px] font-code text-manaMint overflow-x-auto mt-1 border border-white/5">
              <code>{conceptSummary.codeExample}</code>
            </pre>
          </div>
        )}

        {/* Progressive Hints Section */}
        <div className="pt-2 border-t border-white/10">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-moonCream/70 flex items-center gap-1">
              <HelpCircle className="w-3.5 h-3.5 text-runeAmber" />
              Wisdom Hints ({hintTier}/3)
            </span>

            {hintTier < 3 ? (
              <button
                onClick={handleNextHint}
                className="text-xs font-bold text-runeAmber hover:text-yellow-300 flex items-center gap-1 transition-colors"
              >
                <span>{hintTier === 0 ? 'Request Hint' : 'Deeper Hint'}</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <span className="text-[10px] text-manaMint font-bold">All Hints Revealed</span>
            )}
          </div>

          {hintTier > 0 && (
            <div className="space-y-1.5">
              {hints.slice(0, hintTier).map((hint, idx) => (
                <div
                  key={idx}
                  className="p-2.5 rounded-lg bg-night-950/70 border border-runeAmber/30 text-xs text-moonCream flex items-start gap-2 shadow-sm"
                >
                  <span className="text-xs font-bold text-runeAmber shrink-0 font-code">
                    #{idx + 1}
                  </span>
                  <p className="text-moonCream/90 leading-snug">{hint}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

