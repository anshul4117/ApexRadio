import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Play, Pause, Square, Volume2, Sparkles, FastForward, CheckCircle } from 'lucide-react';

export const TranscriptTtsPlayer = ({ transcript = '', confidence = 96.8, provider = 'Groq Whisper Large v3' }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1.0);
  const [activeWordIndex, setActiveWordIndex] = useState(-1);
  const utteranceRef = useRef(null);

  // Compute word boundary ranges for progressive highlighting
  const { words, wordRanges } = useMemo(() => {
    if (!transcript) return { words: [], wordRanges: [] };
    const rawWords = transcript.split(/\s+/).filter(Boolean);
    const ranges = [];
    let searchIndex = 0;

    rawWords.forEach((word) => {
      const start = transcript.indexOf(word, searchIndex);
      const end = start + word.length;
      ranges.push({ word, start, end });
      searchIndex = end;
    });

    return { words: rawWords, wordRanges: ranges };
  }, [transcript]);

  // Clean up speech synthesis on unmount
  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // Stop playback if transcript changes
  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsPlaying(false);
    setIsPaused(false);
    setActiveWordIndex(-1);
  }, [transcript]);

  const startPlayback = () => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window) || !transcript) return;

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(transcript);
    utterance.rate = playbackRate;
    utterance.pitch = 1.05; // clear radio articulation
    utterance.lang = 'en-US';

    // Pick an English voice if available
    const voices = window.speechSynthesis.getVoices();
    const enVoice = voices.find((v) => v.lang.startsWith('en') && (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Samantha') || v.name.includes('Daniel')));
    if (enVoice) {
      utterance.voice = enVoice;
    }

    // Word boundary tracking for progressive word-by-word highlight
    utterance.onboundary = (event) => {
      if (event.name === 'word' || event.charIndex !== undefined) {
        const charIdx = event.charIndex;
        const index = wordRanges.findIndex((r) => charIdx >= r.start && charIdx <= r.end + 2);
        if (index !== -1) {
          setActiveWordIndex(index);
        }
      }
    };

    utterance.onend = () => {
      setIsPlaying(false);
      setIsPaused(false);
      setActiveWordIndex(-1);
    };

    utterance.onerror = (e) => {
      console.warn('TTS playback error:', e);
      setIsPlaying(false);
      setIsPaused(false);
      setActiveWordIndex(-1);
    };

    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
    setIsPlaying(true);
    setIsPaused(false);
  };

  const handlePlayPause = () => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    if (isPlaying && !isPaused) {
      window.speechSynthesis.pause();
      setIsPaused(true);
    } else if (isPaused) {
      window.speechSynthesis.resume();
      setIsPaused(false);
    } else {
      startPlayback();
    }
  };

  const handleStop = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsPlaying(false);
    setIsPaused(false);
    setActiveWordIndex(-1);
  };

  const handleRateChange = (rate) => {
    setPlaybackRate(rate);
    if (isPlaying) {
      // Restart at new rate
      startPlayback();
    }
  };

  return (
    <div className="bg-zinc-900/60 dark:bg-zinc-900/80 border border-zinc-800/80 dark:border-zinc-700/60 rounded-xl p-4 flex flex-col justify-between h-full">
      {/* Header Info */}
      <div className="flex items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 flex-shrink-0">
            <Sparkles className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <h4 className="text-xs font-semibold text-zinc-200 dark:text-zinc-100 flex items-center gap-1.5 truncate">
              Generated Transcript Audio
              <span className="text-[10px] text-emerald-400 font-mono font-normal">
                (TTS)
              </span>
            </h4>
            <p className="text-[10px] text-zinc-400 dark:text-zinc-400 truncate">
              Web Speech Synthesizer • {provider}
            </p>
          </div>
        </div>

        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 flex-shrink-0 flex items-center gap-1">
          <CheckCircle className="w-2.5 h-2.5" /> {confidence}%
        </span>
      </div>

      {/* Transcript Text Box with Progressive Word Highlighting */}
      <div className="bg-black/40 dark:bg-black/60 rounded-lg p-3 my-2 border border-zinc-800/50 min-h-[5rem] flex flex-col justify-center">
        <p className="text-xs leading-relaxed font-mono">
          {words.length > 0 ? (
            words.map((word, idx) => {
              const isHighlighted = idx === activeWordIndex;
              return (
                <span
                  key={idx}
                  className={`transition-all duration-100 inline-block mr-1 rounded px-0.5 ${
                    isHighlighted
                      ? 'bg-rose-500 text-white font-bold shadow-[0_0_8px_rgba(244,63,94,0.5)] scale-105'
                      : 'text-zinc-200 dark:text-zinc-100'
                  }`}
                >
                  {word}
                </span>
              );
            })
          ) : (
            <span className="text-zinc-400 dark:text-zinc-400 italic">
              No transcript available to play.
            </span>
          )}
        </p>
      </div>

      {/* Playback Controls & Speed Selector */}
      <div className="flex items-center justify-between pt-2 border-t border-zinc-800/60 gap-2 flex-wrap">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handlePlayPause}
            disabled={!transcript}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all ${
              isPlaying && !isPaused
                ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/20 hover:bg-rose-600'
                : isPaused
                ? 'bg-amber-500 text-white hover:bg-amber-600'
                : 'bg-emerald-500 text-white hover:bg-emerald-600 shadow-lg shadow-emerald-500/20 disabled:opacity-50 disabled:cursor-not-allowed'
            }`}
          >
            {isPlaying && !isPaused ? (
              <>
                <Pause className="w-3.5 h-3.5 fill-current" /> Pause
              </>
            ) : isPaused ? (
              <>
                <Play className="w-3.5 h-3.5 fill-current" /> Resume
              </>
            ) : (
              <>
                <Volume2 className="w-3.5 h-3.5" /> Play Transcript
              </>
            )}
          </button>

          {(isPlaying || isPaused) && (
            <button
              type="button"
              onClick={handleStop}
              title="Stop playback"
              className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border border-zinc-700/50 transition-colors"
            >
              <Square className="w-3.5 h-3.5 fill-current text-rose-400" />
            </button>
          )}
        </div>

        {/* Speed Selector */}
        <div className="flex items-center gap-1 bg-zinc-800/60 p-1 rounded-lg border border-zinc-700/40">
          {[0.75, 1.0, 1.25].map((rate) => (
            <button
              key={rate}
              type="button"
              onClick={() => handleRateChange(rate)}
              className={`px-1.5 py-0.5 text-[10px] font-mono rounded transition-colors ${
                playbackRate === rate
                  ? 'bg-zinc-700 text-white font-semibold'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              {rate}x
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TranscriptTtsPlayer;
