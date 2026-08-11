import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, RotateCcw, Volume2, VolumeX, Radio, Music2 } from 'lucide-react';

export const OriginalAudioPlayer = ({ audioUrl, fileName, audioFormat = 'WAV', audioDuration = '4.2s' }) => {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);

  // Sync duration and reset state on audioUrl change
  useEffect(() => {
    setIsPlaying(false);
    setCurrentTime(0);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  }, [audioUrl]);

  const togglePlay = () => {
    if (!audioRef.current || !audioUrl) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch((err) => {
        console.warn('Audio playback error:', err);
      });
    }
  };

  const handleRestart = () => {
    if (!audioRef.current) return;
    audioRef.current.currentTime = 0;
    setCurrentTime(0);
    audioRef.current.play().then(() => {
      setIsPlaying(true);
    }).catch((err) => console.warn(err));
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration || 0);
    }
  };

  const handleEnded = () => {
    setIsPlaying(false);
    setCurrentTime(0);
  };

  const handleSeek = (e) => {
    const seekTime = Number(e.target.value);
    setCurrentTime(seekTime);
    if (audioRef.current) {
      audioRef.current.currentTime = seekTime;
    }
  };

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const formatTime = (seconds) => {
    if (isNaN(seconds) || seconds < 0) return '00:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const effectiveDuration = duration > 0 ? duration : (parseFloat(audioDuration) || 4.2);
  const progressPercent = effectiveDuration > 0 ? (currentTime / effectiveDuration) * 100 : 0;

  // Render dummy waveform bars for the visualizer
  const barHeights = [40, 65, 85, 50, 95, 70, 30, 80, 100, 60, 45, 90, 75, 55, 85, 60, 40, 70, 90, 45];

  return (
    <div className="bg-zinc-900/60 dark:bg-zinc-900/80 border border-zinc-800/80 dark:border-zinc-700/60 rounded-xl p-4 flex flex-col justify-between h-full">
      {audioUrl && (
        <audio
          ref={audioRef}
          src={audioUrl}
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          onEnded={handleEnded}
          preload="metadata"
        />
      )}

      {/* Header Info */}
      <div className="flex items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-8 h-8 rounded-lg bg-zinc-800/90 dark:bg-zinc-800 flex items-center justify-center text-zinc-300 flex-shrink-0">
            <Radio className="w-4 h-4 text-rose-400" />
          </div>
          <div className="min-w-0">
            <h4 className="text-xs font-semibold text-zinc-200 dark:text-zinc-100 truncate">
              {fileName || 'Original Driver Radio Recording'}
            </h4>
            <p className="text-[10px] text-zinc-400 dark:text-zinc-400">
              Raw Team Radio Audio ({audioFormat})
            </p>
          </div>
        </div>

        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-800/80 text-zinc-300 border border-zinc-700/50 flex-shrink-0">
          {audioDuration}
        </span>
      </div>

      {/* Interactive Waveform Bar Visualizer */}
      <div className="bg-black/40 dark:bg-black/60 rounded-lg p-3 my-2 border border-zinc-800/50 flex items-center justify-center gap-1.5 h-16 overflow-hidden">
        {barHeights.map((height, idx) => {
          const isPassed = (idx / barHeights.length) * 100 <= progressPercent;
          return (
            <div
              key={idx}
              style={{ height: `${height}%` }}
              className={`w-1.5 rounded-full transition-all duration-150 ${
                isPlaying
                  ? isPassed
                    ? 'bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.6)] animate-pulse'
                    : 'bg-zinc-600 dark:bg-zinc-600'
                  : isPassed
                  ? 'bg-rose-400/80'
                  : 'bg-zinc-700/60 dark:bg-zinc-700/60'
              }`}
            />
          );
        })}
      </div>

      {/* Scrubbing Slider & Time */}
      <div className="space-y-1 my-2">
        <input
          type="range"
          min="0"
          max={effectiveDuration || 1}
          step="0.01"
          value={currentTime}
          onChange={handleSeek}
          disabled={!audioUrl}
          className="w-full h-1.5 bg-zinc-800 dark:bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-rose-500 disabled:opacity-40"
        />
        <div className="flex justify-between items-center text-[10px] font-mono text-zinc-400 dark:text-zinc-400">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(effectiveDuration)}</span>
        </div>
      </div>

      {/* Control Buttons */}
      <div className="flex items-center justify-between pt-2 border-t border-zinc-800/60">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={togglePlay}
            disabled={!audioUrl}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all ${
              isPlaying
                ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/20 hover:bg-rose-600'
                : 'bg-white text-zinc-900 hover:bg-zinc-100 disabled:opacity-50 disabled:cursor-not-allowed'
            }`}
          >
            {isPlaying ? (
              <>
                <Pause className="w-3.5 h-3.5 fill-current" /> Pause
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" /> Play Audio
              </>
            )}
          </button>

          <button
            type="button"
            onClick={handleRestart}
            disabled={!audioUrl}
            title="Restart playback"
            className="p-1.5 rounded-lg bg-zinc-800/80 hover:bg-zinc-700 text-zinc-300 border border-zinc-700/50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>

        <button
          type="button"
          onClick={toggleMute}
          disabled={!audioUrl}
          title={isMuted ? 'Unmute' : 'Mute'}
          className="p-1.5 rounded-lg bg-zinc-800/80 hover:bg-zinc-700 text-zinc-400 hover:text-zinc-200 border border-zinc-700/50 transition-colors disabled:opacity-40"
        >
          {isMuted ? <VolumeX className="w-3.5 h-3.5 text-rose-400" /> : <Volume2 className="w-3.5 h-3.5" />}
        </button>
      </div>

      {!audioUrl && (
        <p className="text-[10px] text-zinc-400 dark:text-zinc-400 mt-2 text-center italic">
          Upload an audio file in the panel above to listen to the raw driver recording.
        </p>
      )}
    </div>
  );
};

export default OriginalAudioPlayer;
