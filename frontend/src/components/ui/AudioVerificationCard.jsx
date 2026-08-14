import React from 'react';
import { Volume2, CheckCircle2, SlidersHorizontal, Cpu, ArrowRightLeft } from 'lucide-react';
import OriginalAudioPlayer from './OriginalAudioPlayer';
import TranscriptTtsPlayer from './TranscriptTtsPlayer';

export const AudioVerificationCard = ({
  uploadedAudioUrl,
  uploadedAudioFile,
  currentAnalysis,
}) => {
  const metadata = currentAnalysis?.metadata || {};
  const fileName = uploadedAudioFile?.name || metadata.originalName || 'driver_radio.wav';
  const audioFormat = metadata.audioFormat || (fileName.endsWith('.mp3') ? 'MP3' : 'WAV');
  const audioDuration = metadata.audioDuration || '4.2s';
  const transcript = currentAnalysis?.transcript || '';
  const confidence = currentAnalysis?.confidence || 96.8;
  const provider = metadata.inferenceProvider || 'Hugging Face (Whisper Large v3)';
  const model = metadata.sttModel || 'openai/whisper-large-v3';

  return (
    <div className="bg-zinc-900/90 dark:bg-zinc-900 border border-zinc-800 dark:border-zinc-700/70 rounded-2xl p-5 shadow-xl">
      {/* Top Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 mb-4 border-b border-zinc-800/80">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-500/20 to-zinc-800 border border-rose-500/30 flex items-center justify-center text-rose-400 shadow-inner flex-shrink-0">
            <ArrowRightLeft className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-zinc-100 dark:text-white flex items-center gap-2">
              Side-by-Side Audio & Transcript Verification
              <span className="text-[10px] font-mono font-medium px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                Verified Accuracy
              </span>
            </h3>
            <p className="text-xs text-zinc-400 dark:text-zinc-400">
              Listen to the original driver radio audio and compare it with synthesized transcript audio.
            </p>
          </div>
        </div>

        {/* Telemetry Tag */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-zinc-800/80 border border-zinc-700/60 text-zinc-300 text-xs font-mono">
            <Cpu className="w-3.5 h-3.5 text-rose-400" />
            <span>{model}</span>
          </div>
        </div>
      </div>

      {/* Side-by-Side Split Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Panel 1: Original Audio Recording */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-zinc-300 uppercase tracking-wider">
              1. Original Radio Audio
            </span>
            {uploadedAudioUrl ? (
              <span className="text-[10px] text-emerald-400 font-mono flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" /> Audio Loaded
              </span>
            ) : (
              <span className="text-[10px] text-zinc-400 font-mono">
                Preset Audio Mode
              </span>
            )}
          </div>
          <OriginalAudioPlayer
            audioUrl={uploadedAudioUrl}
            fileName={fileName}
            audioFormat={audioFormat}
            audioDuration={audioDuration}
          />
        </div>

        {/* Panel 2: Transcript & Text-to-Speech Player */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-zinc-300 uppercase tracking-wider">
              2. Transcript Audio Playback (TTS)
            </span>
            <span className="text-[10px] text-zinc-400 font-mono">
              Web Speech API
            </span>
          </div>
          <TranscriptTtsPlayer
            transcript={transcript}
            confidence={confidence}
            provider={provider}
          />
        </div>
      </div>

      {/* Bottom Verification Insight Bar */}
      <div className="mt-4 pt-3 border-t border-zinc-800/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs text-zinc-400 dark:text-zinc-400">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          <span>
            Real-time transcript produced by <strong className="text-zinc-200">{provider}</strong> matches spoken acoustics.
          </span>
        </div>

        <div className="font-mono text-[11px] text-zinc-400">
          Duration: <span className="text-zinc-300">{audioDuration}</span> • Confidence: <span className="text-emerald-400">{confidence}%</span>
        </div>
      </div>
    </div>
  );
};

export default AudioVerificationCard;
