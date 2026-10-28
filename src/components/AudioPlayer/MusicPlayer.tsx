import React, { useState, useEffect, useRef } from 'react';
import {
  Volume2,
  VolumeX,
  Music,
  Play,
  Pause,
  ChevronUp,
  ChevronDown,
  Search,
  Sparkles,
  Radio,
  Disc3,
  Loader2,
  ExternalLink,
} from 'lucide-react';
import { sound, BGM_TRACKS, BgmTrack } from '../../utils/sound';

interface OnlineTrack {
  id: string;
  name: string;
  artist: string;
  albumArt?: string;
  audioUrl: string;
}

export const MusicPlayer: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState<boolean>(sound.isBgmPlaying());
  const [volume, setVolume] = useState<number>(sound.getBgmVolume());
  const [isMuted, setIsMuted] = useState<boolean>(sound.getMuted());
  const [currentTrack, setCurrentTrack] = useState<BgmTrack>(sound.getCurrentTrack());
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [hasInteracted, setHasInteracted] = useState<boolean>(false);

  // Free To Use music search state
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [searchResults, setSearchResults] = useState<OnlineTrack[]>([]);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [currentOnlineTrack, setCurrentOnlineTrack] = useState<OnlineTrack | null>(null);
  const [activeMode, setActiveMode] = useState<'presets' | 'search'>('presets');

  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Sync state with sound engine
  useEffect(() => {
    const handleFirstInteraction = () => {
      if (!hasInteracted) {
        setHasInteracted(true);
        const savedAuto = localStorage.getItem('spellscript_bgm_auto');
        if (savedAuto !== 'false' && !sound.isBgmPlaying() && !currentOnlineTrack) {
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
  }, [hasInteracted, currentTrack.id, currentOnlineTrack]);

  // Handle Online Audio Element Volume
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  const handleTogglePlay = () => {
    sound.playClick();
    if (currentOnlineTrack && audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.play();
        setIsPlaying(true);
      }
      return;
    }

    if (isPlaying) {
      sound.stopBgm();
      setIsPlaying(false);
      try {
        localStorage.setItem('spellscript_bgm_auto', 'false');
      } catch {}
    } else {
      sound.startBgm(currentTrack.id);
      setIsPlaying(true);
      try {
        localStorage.setItem('spellscript_bgm_auto', 'true');
      } catch {}
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVol = parseFloat(e.target.value);
    setVolume(newVol);
    sound.setBgmVolume(newVol);
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : newVol;
    }
    if (isMuted && newVol > 0) {
      sound.toggleMute();
      setIsMuted(false);
    }
  };

  const handleToggleMute = () => {
    sound.playClick();
    const muted = sound.toggleMute();
    setIsMuted(muted);
    if (audioRef.current) {
      audioRef.current.muted = muted;
    }
  };

  const handleSelectPreset = (track: BgmTrack) => {
    sound.playClick();
    if (audioRef.current) {
      audioRef.current.pause();
    }
    setCurrentOnlineTrack(null);
    setCurrentTrack(track);
    sound.setTrack(track.id);
    sound.startBgm(track.id);
    setIsPlaying(true);
  };

  const handleSearchMusic = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    setSearchError(null);
    sound.playClick();
    try {
      const params = new URLSearchParams({
        query: searchQuery.trim(),
        limit: '18',
      });
      const apiBase = import.meta.env.DEV ? '/music-api' : 'https://api.freetouse.com';
      const res = await fetch(`${apiBase}/v3/music/tracks/search?${params}`);
      if (!res.ok) throw new Error(`Music search failed (${res.status}).`);
      const data = await res.json();
      if (data.ok === false) throw new Error(data.error || 'Music search failed.');
      const tracks: OnlineTrack[] = (data.data ?? [])
        .filter((item: any) => !item.is_premium && item.files?.mp3)
        .slice(0, 9)
        .map((item: any) => ({
          id: item.id,
          name: item.title || 'Untitled track',
          artist: (item.artists ?? []).map((entry: any) => entry[1]?.name).filter(Boolean).join(', ') || 'Unknown artist',
          albumArt: item.thumbnails?.sm,
          audioUrl: item.files.mp3,
        }));
      setSearchResults(tracks);
      if (tracks.length === 0) setSearchError('No free tracks found. Try another search.');
    } catch (err) {
      setSearchResults([]);
      setSearchError(err instanceof Error ? err.message : 'Could not search for music.');
    } finally {
      setIsSearching(false);
    }
  };

  const handlePlayOnlineTrack = (track: OnlineTrack) => {
    sound.playClick();
    sound.stopBgm(); // stop procedural chiptune synth
    setCurrentOnlineTrack(track);
    setIsPlaying(true);

    if (audioRef.current) {
      audioRef.current.src = track.audioUrl;
      audioRef.current.volume = isMuted ? 0 : volume;
      audioRef.current.play().catch(() => setIsPlaying(false));
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 select-none font-body">
      {/* Hidden audio element for online streams */}
      <audio
        ref={audioRef}
        onEnded={() => setIsPlaying(false)}
        onError={() => setIsPlaying(false)}
      />

      {/* Expanded Track & Volume Controls Drawer */}
      {isExpanded && (
        <div className="mb-2.5 p-4 rounded-3xl bg-[#120a24]/95 backdrop-blur-2xl border-2 border-magic/40 shadow-[0_12px_45px_rgba(0,0,0,0.8)] text-[#FFF2D8] w-84 sm:w-96 space-y-3.5 animate-fadeIn">
          {/* Header & Mode Switcher */}
          <div className="flex items-center justify-between pb-2 border-b border-white/10">
            <div className="flex items-center gap-2">
              <span className="text-base">🎵</span>
              <span className="font-pixel text-[11px] uppercase tracking-wider text-spellPink">
                Arcane Jukebox
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setActiveMode(activeMode === 'presets' ? 'search' : 'presets')}
                className="px-2.5 py-1 rounded-lg bg-magic/20 hover:bg-magic/35 border border-magic/30 text-[10px] font-fantasy font-bold text-manaMint transition-colors cursor-pointer"
              >
                {activeMode === 'presets' ? '🔍 Search Songs' : '✨ Presets'}
              </button>
              <button
                onClick={() => setIsExpanded(false)}
                className="text-white/60 hover:text-white p-1 rounded-md"
              >
                <ChevronDown className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* MODE 1: Free To Use music search */}
          {activeMode === 'search' ? (
            <div className="space-y-2.5">
              <form onSubmit={handleSearchMusic} className="flex gap-1.5">
                <input
                  type="text"
                  placeholder="Search royalty-free music..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 bg-black/50 border border-white/15 focus:border-manaMint rounded-xl px-3 py-1.5 text-xs text-white placeholder-white/40 focus:outline-none"
                />
                <button
                  type="submit"
                  disabled={isSearching}
                  className="px-3 py-1.5 bg-gradient-to-r from-magic to-spellPink text-night-950 font-bold rounded-xl text-xs flex items-center justify-center cursor-pointer shadow-sm hover:opacity-95"
                >
                  {isSearching ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Search className="w-3.5 h-3.5" />}
                </button>
              </form>

              {/* Search Results */}
              <div className="space-y-1.5 max-h-52 overflow-y-auto pr-1">
                {searchResults.length === 0 && !isSearching && !searchError && (
                  <div className="text-center py-4 text-xs text-white/50 space-y-1">
                    <Disc3 className="w-6 h-6 mx-auto text-magic opacity-40 animate-spin-slow" />
                    <div>Search free, non-premium tracks.</div>
                  </div>
                )}
                {searchError && <div className="text-center py-3 text-xs text-amber-200">{searchError}</div>}
                {searchResults.map((t) => (
                  <div key={t.id} className="p-2 rounded-xl border bg-white/5 border-white/5 space-y-1.5">
                    <button
                      onClick={() => handlePlayOnlineTrack(t)}
                      className="w-full text-left flex items-center justify-between gap-2.5 text-xs cursor-pointer"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        {t.albumArt ? (
                          <img src={t.albumArt} alt="" className="w-8 h-8 rounded-lg object-cover shadow" />
                        ) : (
                          <div className="w-8 h-8 rounded-lg bg-magic/20 flex items-center justify-center text-xs">🎵</div>
                        )}
                        <div className="min-w-0">
                          <div className="truncate text-white font-bold">{t.name}</div>
                          <div className="text-[10px] text-manaMint truncate">{t.artist}</div>
                        </div>
                      </div>
                      {currentOnlineTrack?.id === t.id && isPlaying ? (
                        <Pause className="w-3.5 h-3.5 text-spellPink shrink-0" />
                      ) : (
                        <Play className="w-3.5 h-3.5 text-white/60 shrink-0 fill-current" />
                      )}
                    </button>
                    <div className="text-[9px] text-white/55 leading-snug">
                      {t.name} by {t.artist} · Free music by{' '}
                      <a href="https://freetouse.com/music" target="_blank" rel="noreferrer" className="text-spellPink hover:underline inline-flex items-center gap-0.5">
                        Free To Use <ExternalLink className="w-2.5 h-2.5" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            /* MODE 2: Built-in Procedural Presets (Synth, Chiptune, BTS, Ambient) */
            <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
              <div className="text-[10px] font-pixel text-manaMint uppercase tracking-wider px-1">
                ✦ Magical Presets & Chiptunes
              </div>
              {BGM_TRACKS.map((t) => (
                <button
                  key={t.id}
                  onClick={() => handleSelectPreset(t)}
                  className={`w-full text-left p-2 rounded-xl border flex items-center justify-between gap-2 transition-all text-xs cursor-pointer ${
                    !currentOnlineTrack && currentTrack.id === t.id && isPlaying
                      ? 'bg-gradient-to-r from-magic/40 to-spellPink/20 border-spellPink text-white font-bold'
                      : 'bg-white/5 border-white/5 hover:bg-white/10 text-white/80'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    <span className="text-base">{t.emoji}</span>
                    <div className="truncate">
                      <div className="truncate text-white font-bold text-xs">{t.name}</div>
                      <div className="text-[10px] text-spellPink truncate">{t.vibe}</div>
                    </div>
                  </div>
                  {!currentOnlineTrack && currentTrack.id === t.id && isPlaying && (
                    <div className="flex items-end gap-0.5 h-3 flex-shrink-0">
                      <div className="w-1 h-full bg-manaMint rounded-full animate-pulse" />
                      <div className="w-1 h-2 bg-spellPink rounded-full animate-pulse" style={{ animationDelay: '0.2s' }} />
                      <div className="w-1 h-2.5 bg-magic rounded-full animate-pulse" style={{ animationDelay: '0.4s' }} />
                    </div>
                  )}
                </button>
              ))}
            </div>
          )}

          {/* Volume Control */}
          <div className="pt-2 border-t border-white/10 flex items-center gap-3">
            <button
              onClick={handleToggleMute}
              className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/80 hover:text-white transition-colors cursor-pointer"
              title={isMuted ? 'Unmute' : 'Mute'}
            >
              {isMuted || volume === 0 ? (
                <VolumeX className="w-4 h-4 text-cursedRed" />
              ) : (
                <Volume2 className="w-4 h-4 text-manaMint" />
              )}
            </button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={isMuted ? 0 : volume}
              onChange={handleVolumeChange}
              className="flex-1 h-1.5 bg-white/20 rounded-lg appearance-none cursor-pointer accent-spellPink"
            />
            <span className="text-[10px] font-code font-bold text-manaMint w-8 text-right">
              {Math.round((isMuted ? 0 : volume) * 100)}%
            </span>
          </div>
        </div>
      )}

      {/* Floating Pill Widget */}
      <div className="flex items-center gap-2 p-1.5 pr-3 rounded-full bg-[#18102e]/95 hover:bg-[#20153d] backdrop-blur-xl border-2 border-magic/60 shadow-[0_8px_30px_rgba(0,0,0,0.6)] transition-all duration-300">
        {/* Play / Pause Toggle Button */}
        <button
          onClick={handleTogglePlay}
          className={`w-9 h-9 rounded-full flex items-center justify-center transition-all cursor-pointer ${
            isPlaying
              ? 'bg-gradient-to-r from-magic to-spellPink text-night-950 shadow-[0_0_20px_rgba(243,169,212,0.6)] animate-pulse'
              : 'bg-white/10 text-white/70 hover:text-white'
          }`}
          title={isPlaying ? 'Pause Music' : 'Play Music'}
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
              <span className="w-1 bg-manaMint rounded-full animate-bounce" style={{ height: '70%', animationDuration: '0.6s' }} />
              <span className="w-1 bg-spellPink rounded-full animate-bounce" style={{ height: '100%', animationDuration: '0.9s' }} />
              <span className="w-1 bg-magic rounded-full animate-bounce" style={{ height: '60%', animationDuration: '0.7s' }} />
              <span className="w-1 bg-manaMint rounded-full animate-bounce" style={{ height: '90%', animationDuration: '1.0s' }} />
            </div>
          ) : (
            <Music className="w-4 h-4 text-white/40 ml-1" />
          )}

          {/* Current Track Label */}
          <div className="text-left">
            <div className="flex items-center gap-1 text-xs font-bold text-white max-w-[130px] truncate">
              {currentOnlineTrack ? (
                <>
                  <span>🎵</span>
                  <span className="truncate">{currentOnlineTrack.name}</span>
                </>
              ) : (
                <>
                  <span>{currentTrack.emoji}</span>
                  <span className="truncate">{currentTrack.name}</span>
                </>
              )}
            </div>
            <div className="text-[9px] font-pixel text-spellPink uppercase tracking-wider truncate max-w-[120px]">
              {currentOnlineTrack ? currentOnlineTrack.artist : isPlaying ? 'Lo-Fi Ambient' : 'Music Paused'}
            </div>
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsExpanded(!isExpanded);
            }}
            className="text-white/50 hover:text-white p-1 rounded-full transition-colors ml-1 cursor-pointer"
          >
            {isExpanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>
    </div>
  );
};
