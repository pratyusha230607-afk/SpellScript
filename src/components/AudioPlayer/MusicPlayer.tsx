import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Music, Play, Pause, ChevronUp, ChevronDown, Sparkles, Heart } from 'lucide-react';
import { sound, BGM_TRACKS, BgmTrack } from '../../utils/sound';

export const MusicPlayer: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState<boolean>(sound.isBgmPlaying());
  const [volume, setVolume] = useState<number>(sound.getBgmVolume());
  const [isMuted, setIsMuted] = useState<boolean>(sound.getMuted());
  const [currentTrack, setCurrentTrack] = useState<BgmTrack>(sound.getCurrentTrack());
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [hasInteracted, setHasInteracted] = useState<boolean>(false);

  // Sync state with sound engine
  useEffect(() => {
    const handleFirstInteraction = () => {
      if (!hasInteracted) {
        setHasInteracted(true);
        const savedAuto = localStorage.getItem('spellscript_bgm_auto');
        if (savedAuto !== 'false' && !sound.isBgmPlaying()) {
          sound.startBgm(currentTrack.id);
          setIsPlaying(true);
        }
      }
    };

    window.addEventListener('click', handleFirstInteraction, { once: true });
    window.addEventListener('keydown', handleFirstInteraction, { once: true });

    return () => {
      window.removeEventListener('click', handleFirstInteraction);
      window.removeEventListener('keydown', handleFirstInteraction);
    };
  }, [hasInteracted, currentTrack.id]);

  const handleTogglePlay = () => {
    sound.playClick();
    if (isPlaying) {
      sound.stopBgm();
      setIsPlaying(false);
      try {
        localStorage.setItem('spellscript_bgm_auto', 'false');
      } catch {
        // Ignore
      }
    } else {
      sound.startBgm(currentTrack.id);
      setIsPlaying(true);
      try {
        localStorage.setItem('spellscript_bgm_auto', 'true');
      } catch {
        // Ignore
      }
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVol = parseFloat(e.target.value);
    setVolume(newVol);
    sound.setBgmVolume(newVol);
    if (isMuted && newVol > 0) {
      sound.toggleMute();
      setIsMuted(false);
    }
  };

  const handleToggleMute = () => {
    sound.playClick();
    const muted = sound.toggleMute();
    setIsMuted(muted);
  };

  const handleSelectTrack = (track: BgmTrack) => {
    sound.playClick();
    setCurrentTrack(track);
    sound.setTrack(track.id);
    if (!isPlaying) {
      sound.startBgm(track.id);
      setIsPlaying(true);
    }
  };

  const btsTracks = BGM_TRACKS.filter((t) => t.artist === 'BTS');
  const ambientTracks = BGM_TRACKS.filter((t) => t.artist !== 'BTS');

  return (
    <div className="fixed bottom-4 right-4 z-50 select-none font-body">
      {/* Expanded Track & Volume Controls Drawer */}
      {isExpanded && (
        <div className="mb-2.5 p-4 rounded-3xl bg-[#150d2b]/95 backdrop-blur-2xl border-2 border-[#9274D8]/50 shadow-[0_12px_45px_rgba(0,0,0,0.7)] text-[#FFF2D8] w-80 space-y-3.5 animate-scaleUp">
          <div className="flex items-center justify-between pb-2 border-b border-white/10">
            <div className="flex items-center gap-2">
              <span className="text-base">💜</span>
              <span className="font-pixel text-[11px] uppercase tracking-wider text-[#F3A9D4]">
                BTS Jukebox & Vibey Lofi
              </span>
            </div>
            <button
              onClick={() => setIsExpanded(false)}
              className="text-white/60 hover:text-white p-1 rounded-md"
            >
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>

          {/* BTS Section */}
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-[10px] font-pixel text-[#B8E8DC] uppercase tracking-wider px-1">
              <Heart className="w-3 h-3 text-[#F3A9D4] fill-current" />
              <span>BTS Special Hits (Procedural Chiptune & Pads)</span>
            </div>
            <div className="space-y-1 max-h-44 overflow-y-auto pr-1">
              {btsTracks.map((t) => (
                <button
                  key={t.id}
                  onClick={() => handleSelectTrack(t)}
                  className={`w-full text-left p-2 rounded-xl border flex items-center justify-between gap-2 transition-all text-xs ${
                    currentTrack.id === t.id
                      ? 'bg-gradient-to-r from-[#9274D8]/40 to-[#F3A9D4]/20 border-[#F3A9D4] shadow-md text-white font-bold'
                      : 'bg-white/5 border-white/5 hover:bg-white/10 text-white/80'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    <span className="text-base">{t.emoji}</span>
                    <div className="truncate">
                      <div className="truncate text-white font-bold">{t.name}</div>
                      <div className="text-[10px] text-[#F3A9D4] font-normal truncate">{t.vibe}</div>
                    </div>
                  </div>
                  {currentTrack.id === t.id && isPlaying && (
                    <div className="flex items-end gap-0.5 h-3 flex-shrink-0">
                      <div className="w-1 h-full bg-[#5EEAD4] rounded-full animate-pulse" />
                      <div className="w-1 h-2 bg-[#F3A9D4] rounded-full animate-pulse" style={{ animationDelay: '0.2s' }} />
                      <div className="w-1 h-2.5 bg-[#A78BFA] rounded-full animate-pulse" style={{ animationDelay: '0.4s' }} />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Fantasy Ambient Section */}
          <div className="space-y-1 pt-1 border-t border-white/10">
            <div className="text-[10px] font-pixel text-[#A78BFA] uppercase tracking-wider px-1">
              ✨ Fantasy Ambient Chill
            </div>
            <div className="space-y-1">
              {ambientTracks.map((t) => (
                <button
                  key={t.id}
                  onClick={() => handleSelectTrack(t)}
                  className={`w-full text-left p-2 rounded-xl border flex items-center justify-between gap-2 transition-all text-xs ${
                    currentTrack.id === t.id
                      ? 'bg-[#9274D8]/40 border-[#A78BFA] shadow-md text-white font-bold'
                      : 'bg-white/5 border-white/5 hover:bg-white/10 text-white/80'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    <span className="text-base">{t.emoji}</span>
                    <div className="truncate">
                      <div className="truncate text-white font-bold">{t.name}</div>
                      <div className="text-[10px] text-[#B8E8DC] font-normal truncate">{t.vibe}</div>
                    </div>
                  </div>
                  {currentTrack.id === t.id && isPlaying && (
                    <div className="flex items-end gap-0.5 h-3 flex-shrink-0">
                      <div className="w-1 h-full bg-[#5EEAD4] rounded-full animate-pulse" />
                      <div className="w-1 h-2 bg-[#F3A9D4] rounded-full animate-pulse" style={{ animationDelay: '0.2s' }} />
                      <div className="w-1 h-2.5 bg-[#A78BFA] rounded-full animate-pulse" style={{ animationDelay: '0.4s' }} />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Volume Control with High Boost */}
          <div className="pt-2 border-t border-white/10 flex items-center gap-3">
            <button
              onClick={handleToggleMute}
              className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/80 hover:text-white transition-colors"
              title={isMuted ? 'Unmute' : 'Mute'}
            >
              {isMuted || volume === 0 ? (
                <VolumeX className="w-4 h-4 text-red-400" />
              ) : (
                <Volume2 className="w-4 h-4 text-[#5EEAD4]" />
              )}
            </button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={isMuted ? 0 : volume}
              onChange={handleVolumeChange}
              className="flex-1 h-2 bg-white/20 rounded-lg appearance-none cursor-pointer accent-[#F3A9D4]"
            />
            <span className="text-[10px] font-code font-bold text-[#5EEAD4] w-9 text-right">
              {Math.round((isMuted ? 0 : volume) * 100)}%
            </span>
          </div>
        </div>
      )}

      {/* Floating Pill Widget */}
      <div className="flex items-center gap-2 p-1.5 pr-3 rounded-full bg-[#18102e]/95 hover:bg-[#20153d] backdrop-blur-xl border-2 border-[#9274D8]/60 shadow-[0_8px_30px_rgba(0,0,0,0.6)] transition-all duration-300">
        {/* Play / Pause Toggle Button */}
        <button
          onClick={handleTogglePlay}
          className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${
            isPlaying
              ? 'bg-gradient-to-r from-[#9274D8] to-[#F3A9D4] text-white shadow-[0_0_20px_rgba(243,169,212,0.6)] animate-pulse'
              : 'bg-white/10 text-white/70 hover:text-white'
          }`}
          title={isPlaying ? 'Pause Background Music' : 'Play Background Music'}
        >
          {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
        </button>

        {/* Animated Sound Wave Equalizer Bars */}
        <div
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-2.5 cursor-pointer hover:opacity-90 transition-opacity"
        >
          {isPlaying ? (
            <div className="flex items-end gap-1 h-4 px-1">
              <span className="w-1 bg-[#5EEAD4] rounded-full animate-bounce" style={{ height: '70%', animationDuration: '0.6s' }} />
              <span className="w-1 bg-[#F3A9D4] rounded-full animate-bounce" style={{ height: '100%', animationDuration: '0.9s' }} />
              <span className="w-1 bg-[#9274D8] rounded-full animate-bounce" style={{ height: '60%', animationDuration: '0.7s' }} />
              <span className="w-1 bg-[#5EEAD4] rounded-full animate-bounce" style={{ height: '90%', animationDuration: '1.0s' }} />
            </div>
          ) : (
            <Music className="w-4 h-4 text-white/40 ml-1" />
          )}

          {/* Current Track Label */}
          <div className="text-left">
            <div className="flex items-center gap-1 text-xs font-bold text-white max-w-[130px] truncate">
              <span>{currentTrack.emoji}</span>
              <span className="truncate">{currentTrack.name}</span>
            </div>
            <div className="text-[9px] font-pixel text-[#F3A9D4] uppercase tracking-wider">
              {currentTrack.artist ? `💜 ${currentTrack.artist}` : isPlaying ? 'Lo-Fi Ambient' : 'Music Paused'}
            </div>
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsExpanded(!isExpanded);
            }}
            className="text-white/50 hover:text-white p-1 rounded-full transition-colors ml-1"
          >
            {isExpanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>
    </div>
  );
};
