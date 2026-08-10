import React, { useState, useRef } from 'react';
import {
  Volume2,
  Play,
  Pause,
  UploadCloud,
  FileAudio,
  Sparkles,
  Gauge,
  Activity,
  CheckCircle2,
  Filter,
  Download,
  Copy,
  Check,
  RefreshCw,
  AlertCircle,
  Clock,
  Zap,
} from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import StatusBadge from '../components/ui/StatusBadge';
import SectionHeader from '../components/ui/SectionHeader';
import { useRadio } from '../context/RadioContext';

export const RadioAnalysisPage = () => {
  const {
    currentAnalysis,
    history,
    isAnalyzing,
    uploadProgress,
    analysisStep,
    error: radioError,
    analyzeFile,
    analyzePreset,
    resetAnalysisState,
    setCurrentAnalysis,
  } = useRadio();

  const [isPlaying, setIsPlaying] = useState(false);
  const [copied, setCopied] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef(null);

  const samplePresets = [
    {
      id: 'lap18',
      title: 'Lap 18: Turn 4 Understeer',
      driver: 'Max Verstappen (#1)',
      sampleHint: 'lap18 understeer',
      driverId: 'VER-01',
      car: 'Car #1',
      lap: 18,
    },
    {
      id: 'lap22',
      title: 'Lap 22: Brake Vibration Warning',
      driver: 'Lewis Hamilton (#44)',
      sampleHint: 'lap22 brake vibration',
      driverId: 'HAM-44',
      car: 'Car #44',
      lap: 22,
    },
    {
      id: 'lap31',
      title: 'Lap 31: Sudden Rain Threat at Turn 9',
      driver: 'Lando Norris (#4)',
      sampleHint: 'lap31 rain heavier',
      driverId: 'NOR-04',
      car: 'Car #4',
      lap: 31,
    },
    {
      id: 'lap14',
      title: 'Lap 14: Nominal Delta Callout',
      driver: 'Max Verstappen (#1)',
      sampleHint: 'calm delta gap',
      driverId: 'VER-01',
      car: 'Car #1',
      lap: 14,
    },
  ];

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      analyzeFile(file);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      analyzeFile(file);
    }
  };

  const handleCopyTranscript = () => {
    if (currentAnalysis?.transcript) {
      navigator.clipboard.writeText(currentAnalysis.transcript);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const emotion = currentAnalysis?.emotion || {};
  const metadata = currentAnalysis?.metadata || {};
  const isElevated = emotion.driverState === 'Stressed' || (emotion.stressScore || 0) >= 75;

  return (
    <div className="space-y-6">
      
      {/* Section Header */}
      <SectionHeader
        title="Radio & Acoustic Speech Analyzer"
        subtitle="End-to-end Whisper Speech-to-Text and voice emotion stress classification"
        badge={<StatusBadge status="live">Hugging Face Pipeline</StatusBadge>}
        actions={
          <div className="flex items-center gap-2">
            <Button variant="secondary" size="sm" onClick={() => fileInputRef.current?.click()} className="gap-1.5">
              <UploadCloud className="w-3.5 h-3.5 text-zinc-500" /> Upload Audio File
            </Button>
            <Button variant="outline" size="sm" className="gap-1.5">
              <Download className="w-3.5 h-3.5 text-zinc-500" /> Export JSON
            </Button>
          </div>
        }
      />

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="audio/wav, audio/mp3, audio/mpeg, .wav, .mp3, .flac"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Error Alert Banner */}
      {radioError && (
        <div className="p-3.5 rounded-lg bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 text-xs text-rose-700 dark:text-rose-300 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{radioError}</span>
          </div>
          <Button variant="outline" size="sm" onClick={resetAnalysisState}>
            Dismiss
          </Button>
        </div>
      )}

      {/* Upload Dropzone & Processing State Area */}
      {isAnalyzing ? (
        /* Processing State */
        <Card className="p-8 text-center space-y-4 border-zinc-300 dark:border-zinc-700 bg-zinc-50/50 dark:bg-zinc-950/40">
          <div className="flex flex-col items-center justify-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-zinc-900 text-white dark:bg-white dark:text-zinc-950 flex items-center justify-center animate-pulse shadow-sm">
              <Activity className="w-6 h-6" />
            </div>

            <div className="space-y-1">
              <h3 className="text-sm font-semibold text-zinc-950 dark:text-white">
                {analysisStep === 'uploading'
                  ? `Uploading Audio Stream (${uploadProgress}%)...`
                  : analysisStep === 'transcribing'
                  ? 'Running Whisper Speech-to-Text Model...'
                  : 'Analyzing Vocal Pitch Jitter & Acoustic Stress...'}
              </h3>
              <p className="text-xs text-zinc-500 max-w-sm mx-auto">
                Processing multi-modal acoustic features and generating tactical engineer recommendations.
              </p>
            </div>

            {/* Animated Step Progress Bar */}
            <div className="w-full max-w-md bg-zinc-200 dark:bg-zinc-800 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-zinc-900 dark:bg-white h-full transition-all duration-300 rounded-full"
                style={{
                  width:
                    analysisStep === 'uploading'
                      ? `${uploadProgress}%`
                      : analysisStep === 'transcribing'
                      ? '70%'
                      : '92%',
                }}
              />
            </div>
          </div>
        </Card>
      ) : (
        /* Drag and Drop Zone */
        <Card className="p-6">
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border border-dashed rounded-lg p-6 text-center transition-all cursor-pointer flex flex-col items-center justify-center space-y-2.5 ${
              dragOver
                ? 'border-zinc-900 bg-zinc-100 dark:border-white dark:bg-zinc-900'
                : 'border-zinc-300 dark:border-zinc-700 bg-zinc-50/40 dark:bg-zinc-950/30 hover:border-zinc-500'
            }`}
          >
            <div className="w-10 h-10 rounded-full bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center text-zinc-600 dark:text-zinc-300">
              <UploadCloud className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-semibold text-zinc-950 dark:text-white">
                Drag and drop driver radio audio here, or click to browse
              </p>
              <p className="text-[11px] text-zinc-500">
                Supported formats: <strong>WAV</strong>, <strong>MP3</strong>, FLAC (Max 25 MB)
              </p>
            </div>
          </div>

          {/* Quick Preset Buttons */}
          <div className="mt-4 pt-4 border-t border-zinc-100 dark:border-zinc-800/60 space-y-2">
            <span className="text-xs font-medium text-zinc-500 block">
              Or load and analyze a Formula 1 team radio sample preset:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
              {samplePresets.map((preset) => (
                <button
                  key={preset.id}
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    analyzePreset(preset);
                  }}
                  className="p-2.5 rounded-md border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900/40 text-left text-xs hover:border-zinc-400 dark:hover:border-zinc-600 transition-colors cursor-pointer"
                >
                  <div className="font-semibold text-zinc-950 dark:text-white truncate">
                    {preset.title.split(':')[0]}
                  </div>
                  <div className="text-[11px] text-zinc-500 truncate">
                    {preset.driver}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </Card>
      )}

      {/* Active Analysis Results (Success State) */}
      {currentAnalysis && (
        <div className="space-y-6 animate-in fade-in duration-200">
          
          {/* Top 4 Confidence & Biometric Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card title="Detected Driver State" subtitle="Cognitive & vocal load">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-semibold tracking-tight text-zinc-950 dark:text-white">
                    {emotion.driverState || 'Stressed'}
                  </span>
                  <StatusBadge status={isElevated ? 'critical' : 'nominal'} size="sm">
                    {emotion.stressScore || 78}% Stress
                  </StatusBadge>
                </div>
                <p className="text-xs text-zinc-500">{emotion.emotionLabel || 'Frustrated'} vocal urgency</p>
              </div>
            </Card>

            <Card title="Model Confidence Score" subtitle="Hugging Face Whisper STT">
              <div className="space-y-1">
                <div className="text-2xl font-semibold tracking-tight text-zinc-950 dark:text-white font-tabular">
                  {currentAnalysis.confidence || 94.2}%
                </div>
                <p className="text-xs text-zinc-500">Fine-tuned motorsport vocabulary</p>
              </div>
            </Card>

            <Card title="Vocal Pitch Jitter" subtitle="Deviation vs calm baseline">
              <div className="space-y-1">
                <div className={`text-2xl font-semibold tracking-tight font-tabular ${isElevated ? 'text-rose-600 dark:text-rose-400' : 'text-zinc-950 dark:text-white'}`}>
                  {emotion.pitchJitter || '+42.5 Hz'}
                </div>
                <p className="text-xs text-zinc-500">Cadence: {emotion.speechCadence || '185 WPM'}</p>
              </div>
            </Card>

            <Card title="Processing & Audio Latency" subtitle="Model response duration">
              <div className="space-y-1">
                <div className="text-2xl font-semibold tracking-tight text-zinc-950 dark:text-white font-tabular">
                  {currentAnalysis.processingTime || '0.85s'}
                </div>
                <p className="text-xs text-zinc-500">Audio length: {metadata.audioDuration || '4.2s'}</p>
              </div>
            </Card>
          </div>

          {/* 2-Column Split: Detailed Transcript Card & Audio Player */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Left Column (2 Cols): Transcript & Copy Tool */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* Detailed Transcript Panel */}
              <Card
                title="Transcribed Driver Radio Message"
                subtitle={`Analyzed at ${new Date(currentAnalysis.timestamp).toLocaleTimeString()} · ${metadata.audioFormat || 'WAV'} format`}
                badge={<StatusBadge status={isElevated ? 'critical' : 'nominal'} size="sm">{emotion.driverState || 'Stressed'}</StatusBadge>}
                action={
                  <div className="flex items-center gap-2">
                    <Button variant="secondary" size="sm" onClick={handleCopyTranscript} className="gap-1.5">
                      {copied ? <Check className="w-3.5 h-3.5 text-zinc-600 dark:text-zinc-300" /> : <Copy className="w-3.5 h-3.5" />}
                      {copied ? 'Copied' : 'Copy Transcript'}
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => fileInputRef.current?.click()}>
                      Analyze Another
                    </Button>
                  </div>
                }
              >
                <div className="space-y-4">
                  <div className="p-4 rounded-lg bg-zinc-50/70 dark:bg-zinc-900/40 border border-zinc-200/60 dark:border-zinc-800/60 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-zinc-950 dark:text-white">
                        {currentAnalysis.driver || 'Max Verstappen'} ({currentAnalysis.car || 'Car #1'}) · Lap {currentAnalysis.lap || 18}
                      </span>
                      <span className="text-zinc-400 font-tabular">{new Date(currentAnalysis.timestamp).toLocaleTimeString()}</span>
                    </div>

                    <p className="text-zinc-900 dark:text-zinc-100 text-sm pl-3.5 border-l-2 border-zinc-900 dark:border-zinc-100 italic leading-relaxed font-normal">
                      "{currentAnalysis.transcript}"
                    </p>
                  </div>

                  {/* AI Generated Recommendation Directive */}
                  {currentAnalysis.recommendation && (
                    <div className="p-3.5 rounded-lg bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-950 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs shadow-2xs">
                      <div className="flex items-center gap-2">
                        <Zap className="w-3.5 h-3.5 flex-shrink-0" />
                        <div>
                          <span className="font-semibold">AI Pit Wall Directive: </span>
                          <span>{currentAnalysis.recommendation.action}</span>
                        </div>
                      </div>
                      <span className="font-medium opacity-90 text-[11px]">
                        Target: {currentAnalysis.recommendation.pitWindow}
                      </span>
                    </div>
                  )}
                </div>
              </Card>

              {/* Waveform Player Simulation */}
              <Card
                title="Audio Playback & Acoustic Spectrum"
                subtitle={`File: ${metadata.originalName || 'radio_transmission.wav'} · Size: ${metadata.fileSizeKb || 160} KB`}
                action={
                  <Button
                    variant="primary"
                    size="sm"
                    className="gap-2"
                    onClick={() => setIsPlaying(!isPlaying)}
                  >
                    {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                    {isPlaying ? 'Pause Audio' : 'Play Audio'}
                  </Button>
                }
              >
                <div className="space-y-4 text-xs">
                  <div className="h-20 bg-zinc-50/70 dark:bg-zinc-950/60 rounded-lg border border-zinc-200/60 dark:border-zinc-800/60 p-3 flex items-end justify-between gap-1 overflow-hidden">
                    {Array.from({ length: 48 }).map((_, i) => {
                      const heightPct = Math.max(12, Math.sin(i * 0.4) * 45 + Math.cos(i * 0.9) * 30 + 35);
                      const isHighlight = i >= 18 && i <= 32;
                      return (
                        <div
                          key={i}
                          className={`flex-1 rounded-xs transition-all duration-300 ${
                            isHighlight && isElevated
                              ? 'bg-rose-500 dark:bg-rose-400'
                              : isPlaying
                              ? 'bg-zinc-800 dark:bg-zinc-300'
                              : 'bg-zinc-200 dark:bg-zinc-700'
                          }`}
                          style={{ height: `${heightPct}%` }}
                        />
                      );
                    })}
                  </div>

                  <div className="flex flex-wrap items-center justify-between text-xs text-zinc-500 pt-1">
                    <span>Duration: <strong className="font-tabular">{metadata.audioDuration || '4.2s'}</strong></span>
                    <span className="font-medium text-zinc-900 dark:text-zinc-100">Provider: {metadata.sttProvider || 'Whisper'}</span>
                    <span>Sample Rate: 48 kHz PCM</span>
                  </div>
                </div>
              </Card>

            </div>

            {/* Right Column: Recorded History List */}
            <div className="space-y-6">
              
              <Card
                title="Session Analysis History"
                subtitle={`${history.length} transmission(s) analyzed`}
              >
                <div className="space-y-2 text-xs">
                  {history.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => setCurrentAnalysis(item)}
                      className={`p-3 rounded-lg border transition-colors cursor-pointer space-y-1 ${
                        currentAnalysis?.id === item.id
                          ? 'border-zinc-400 dark:border-zinc-600 bg-zinc-50 dark:bg-zinc-900/60 shadow-2xs'
                          : 'border-zinc-200/60 dark:border-zinc-800/60 hover:bg-zinc-50/50 dark:hover:bg-zinc-900/30'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-zinc-950 dark:text-white truncate">
                          {item.driver}
                        </span>
                        <StatusBadge
                          status={item.emotion?.driverState === 'Stressed' ? 'critical' : 'nominal'}
                          size="sm"
                        >
                          {item.emotion?.stressScore || 50}% · {item.emotion?.driverState || 'Nominal'}
                        </StatusBadge>
                      </div>
                      <p className="text-zinc-500 truncate text-[11px]">
                        "{item.transcript}"
                      </p>
                    </div>
                  ))}
                </div>
              </Card>

            </div>

          </div>

        </div>
      )}

    </div>
  );
};

export default RadioAnalysisPage;
