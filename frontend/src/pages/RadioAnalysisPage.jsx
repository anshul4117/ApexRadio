import React, { useState, useRef } from 'react';
import {
  Volume2,
  UploadCloud,
  FileAudio,
  Sparkles,
  Gauge,
  Activity,
  CheckCircle2,
  Copy,
  Check,
  RefreshCw,
  AlertCircle,
  Clock,
  Zap,
  Radio,
  SlidersHorizontal,
} from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import StatusBadge from '../components/ui/StatusBadge';
import SectionHeader from '../components/ui/SectionHeader';
import AudioWaveformVisualizer from '../components/ui/AudioWaveformVisualizer';
import ExplainabilityPanel from '../components/ui/ExplainabilityPanel';
import AudioVerificationCard from '../components/ui/AudioVerificationCard';
import { useRadio } from '../context/RadioContext';
import { useLap } from '../context/LapContext';
import { useTypewriter } from '../hooks/useTypewriter';

export const RadioAnalysisPage = () => {
  const {
    currentAnalysis,
    history,
    isAnalyzing,
    uploadProgress,
    analysisStep,
    error: radioError,
    uploadedAudioUrl,
    uploadedAudioFile,
    analyzeFile,
    analyzePreset,
    resetAnalysisState,
    setCurrentAnalysis,
  } = useRadio();

  const { lapStats, correlation } = useLap();

  const [copied, setCopied] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef(null);

  // Typewriter effect on the active transcript
  const { displayedText, isDone: isTypewriterDone } = useTypewriter(
    currentAnalysis?.transcript || '',
    16,
    !isAnalyzing
  );

  const samplePresets = [
    {
      id: 'lap18',
      title: 'Lap 18: Turn 4 Understeer',
      driver: 'Max Verstappen (#1)',
      sampleHint: 'lap18 understeer',
      driverId: 'VER-01',
      car: 'Car #1',
      lap: 18,
      stress: '78%',
    },
    {
      id: 'lap22',
      title: 'Lap 22: Brake Vibration Warning',
      driver: 'Lewis Hamilton (#44)',
      sampleHint: 'lap22 brake vibration',
      driverId: 'HAM-44',
      car: 'Car #44',
      lap: 22,
      stress: '58%',
    },
    {
      id: 'lap31',
      title: 'Lap 31: Rain Intensity Spike',
      driver: 'Lando Norris (#4)',
      sampleHint: 'lap31 rain',
      driverId: 'NOR-04',
      car: 'Car #4',
      lap: 31,
      stress: '88%',
    },
    {
      id: 'lap14',
      title: 'Lap 14: Nominal Delta Check',
      driver: 'Max Verstappen (#1)',
      sampleHint: 'lap14 delta calm',
      driverId: 'VER-01',
      car: 'Car #1',
      lap: 14,
      stress: '18%',
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

  const handleCopy = () => {
    if (currentAnalysis?.transcript) {
      navigator.clipboard.writeText(currentAnalysis.transcript);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const emotion = currentAnalysis?.emotion || {
    driverState: 'Stressed',
    stressScore: 78,
    pitchJitter: '+42.5 Hz',
    speechCadence: '185 WPM',
    vocalIntensity: '88 dB',
  };

  const isElevated = emotion.driverState === 'Stressed' || (emotion.stressScore || 0) >= 75;
  const isFatigued = emotion.driverState === 'Fatigued';

  return (
    <div className="space-y-6">
      
      {/* Section Header */}
      <SectionHeader
        title="Driver Radio & Acoustic Emotion Pipeline"
        subtitle="Hugging Face Whisper STT transcription, vocal pitch jitter extraction & driver cognitive load classification"
        badge={
          <StatusBadge status={isElevated ? 'critical' : isFatigued ? 'high-stress' : 'nominal'}>
            {emotion.driverState || 'Stressed'} ({emotion.stressScore || 78}%)
          </StatusBadge>
        }
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              className="gap-1.5"
            >
              <UploadCloud className="w-3.5 h-3.5 text-zinc-500" />
              Upload Radio Audio
            </Button>
            <Button variant="outline" size="sm" onClick={resetAnalysisState} className="gap-1.5">
              <RefreshCw className="w-3.5 h-3.5 text-zinc-500" />
              Reset State
            </Button>
          </div>
        }
      />

      {/* Hidden File Picker */}
      <input
        ref={fileInputRef}
        type="file"
        accept="audio/wav, audio/mp3, audio/mpeg, .wav, .mp3"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Error Alert */}
      {radioError && (
        <div className="p-3.5 rounded-lg bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 text-xs text-rose-700 dark:text-rose-300 flex items-center gap-2 animate-in fade-in">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{radioError}</span>
        </div>
      )}

      {/* Main 2-Column Split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column (2 Cols): Upload Dropzone & Live Waveform Visualizer */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Audio Upload Dropzone & Real-Time Processing Stepper */}
          <Card
            title="Team Radio Audio Stream Ingestion"
            subtitle="Drag & drop cockpit audio or choose from motorsport simulation presets"
            action={<Badge variant="outline" size="sm">Channel 1 (Live)</Badge>}
          >
            <div className="space-y-4">
              
              {/* Dropzone Area */}
              {isAnalyzing ? (
                <div className="p-6 text-center space-y-4 bg-zinc-50/50 dark:bg-zinc-950/40 rounded-lg border border-zinc-200 dark:border-zinc-800">
                  <div className="relative w-10 h-10 mx-auto">
                    <Activity className="w-10 h-10 text-zinc-900 dark:text-white animate-pulse" />
                  </div>
                  
                  <div className="space-y-1.5 max-w-sm mx-auto">
                    <p className="text-xs font-semibold text-zinc-950 dark:text-white capitalize">
                      {analysisStep === 'uploading' && `Uploading Radio Transmission (${uploadProgress}%)...`}
                      {analysisStep === 'transcribing' && 'Transcribing with Groq Whisper Large v3 LPU...'}
                      {analysisStep === 'analyzing' && 'Extracting Vocal Pitch Jitter & Acoustic Emotion...'}
                      {analysisStep === 'correlating' && 'Correlating Biometrics with CAN Bus Telemetry...'}
                      {analysisStep === 'completed' && 'Analysis Completed! Updating Dashboard...'}
                    </p>
                    
                    {/* Progress Bar */}
                    <div className="w-full bg-zinc-200 dark:bg-zinc-800 h-1.5 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-zinc-950 dark:bg-white rounded-full transition-all duration-300"
                        style={{
                          width: `${
                            analysisStep === 'uploading'
                              ? uploadProgress
                              : analysisStep === 'transcribing'
                              ? 45
                              : analysisStep === 'analyzing'
                              ? 75
                              : analysisStep === 'correlating'
                              ? 92
                              : 100
                          }%`,
                        }}
                      />
                    </div>
                  </div>

                  {/* Step Pills */}
                  <div className="flex flex-wrap justify-center gap-1.5 pt-1 text-[10px]">
                    <span className={`px-2 py-0.5 rounded ${analysisStep === 'uploading' ? 'bg-zinc-950 text-white dark:bg-white dark:text-black font-semibold' : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-500'}`}>
                      1. Upload
                    </span>
                    <span className={`px-2 py-0.5 rounded ${analysisStep === 'transcribing' ? 'bg-zinc-950 text-white dark:bg-white dark:text-black font-semibold' : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-500'}`}>
                      2. Whisper STT
                    </span>
                    <span className={`px-2 py-0.5 rounded ${analysisStep === 'analyzing' ? 'bg-zinc-950 text-white dark:bg-white dark:text-black font-semibold' : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-500'}`}>
                      3. Emotion NLP
                    </span>
                    <span className={`px-2 py-0.5 rounded ${analysisStep === 'correlating' ? 'bg-zinc-950 text-white dark:bg-white dark:text-black font-semibold' : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-500'}`}>
                      4. Telemetry Correlation
                    </span>
                  </div>
                </div>
              ) : (
                <div
                  onDragOver={(e) => {
                    e.preventDefault();
                    setDragOver(true);
                  }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`border border-dashed rounded-lg p-6 text-center transition-all cursor-pointer flex flex-col items-center justify-center space-y-2 ${
                    dragOver
                      ? 'border-zinc-900 bg-zinc-100 dark:border-white dark:bg-zinc-900'
                      : 'border-zinc-300 dark:border-zinc-700 bg-zinc-50/40 dark:bg-zinc-950/30 hover:border-zinc-500'
                  }`}
                >
                  <div className="w-10 h-10 rounded-full bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center text-zinc-600 dark:text-zinc-300">
                    <FileAudio className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-zinc-950 dark:text-white">
                      Drag and drop driver audio here, or click to browse
                    </p>
                    <p className="text-[11px] text-zinc-500">
                      Supports high-fidelity WAV and MP3 cockpit audio recordings (Max 25MB)
                    </p>
                  </div>
                </div>
              )}

              {/* Sample Simulation Presets */}
              <div className="space-y-2">
                <span className="text-[11px] font-medium text-zinc-400 block">
                  Quick Simulation Presets (1-Click Real-Time Trigger):
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {samplePresets.map((preset) => (
                    <button
                      key={preset.id}
                      type="button"
                      disabled={isAnalyzing}
                      onClick={() => analyzePreset(preset)}
                      className="p-2.5 rounded-md border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 hover:border-zinc-400 dark:hover:border-zinc-600 text-left text-xs transition-all flex items-center justify-between group cursor-pointer shadow-2xs"
                    >
                      <div className="space-y-0.5 truncate">
                        <span className="font-semibold text-zinc-950 dark:text-white block group-hover:text-zinc-900 dark:group-hover:text-white">
                          {preset.title}
                        </span>
                        <span className="text-[11px] text-zinc-500 block truncate">
                          {preset.driver} · Lap {preset.lap}
                        </span>
                      </div>
                      <Badge variant="outline" size="sm">Stress {preset.stress}</Badge>
                    </button>
                  ))}
                </div>
              </div>

            </div>
          </Card>

          {/* Interactive Audio Waveform & Typewriter Transcript Card */}
          <Card
            title="Cockpit Audio Waveform & Speech Transcript"
            subtitle={`${currentAnalysis?.metadata?.originalName || 'lap18_ver_understeer.wav'} · Duration: ${currentAnalysis?.metadata?.audioDuration || '4.2s'}`}
            action={
              <button
                type="button"
                onClick={handleCopy}
                className="text-xs text-zinc-500 hover:text-zinc-950 dark:hover:text-white flex items-center gap-1 transition-colors cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied Transcript' : 'Copy Quote'}</span>
              </button>
            }
          >
            <div className="space-y-4">
              
              {/* Dynamic Waveform Player */}
              <AudioWaveformVisualizer
                duration={currentAnalysis?.metadata?.audioDuration || '4.2s'}
                isProcessing={isAnalyzing}
                stressLevel={isElevated ? 'high' : 'nominal'}
              />

              {/* Typewriter Transcript Reveal */}
              <div className="p-4 rounded-lg bg-white dark:bg-zinc-950 border border-zinc-200/80 dark:border-zinc-800 space-y-2">
                <div className="flex items-center justify-between text-xs text-zinc-400 border-b border-zinc-100 dark:border-zinc-800 pb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-zinc-900 dark:text-white">
                      {currentAnalysis?.driver || 'Max Verstappen'} ({currentAnalysis?.car || 'Car #1'})
                    </span>
                    <Badge variant="white" size="sm">Lap {currentAnalysis?.lap || 18}</Badge>
                  </div>
                  <span className="font-tabular text-[11px]">
                    Processed in {currentAnalysis?.processingTime || '1.14s'}
                  </span>
                </div>

                <p className="text-sm text-zinc-900 dark:text-zinc-100 font-medium italic leading-relaxed min-h-[3rem]">
                  "{displayedText}"
                  {!isTypewriterDone && <span className="inline-block w-1.5 h-4 bg-zinc-900 dark:bg-white ml-0.5 animate-pulse" />}
                </p>

                <div className="flex flex-wrap items-center justify-between text-xs text-zinc-500 pt-1 border-t border-zinc-100 dark:border-zinc-800/60">
                  <span>STT Model: <strong className="text-zinc-800 dark:text-zinc-200 font-mono text-[11px]">openai/whisper-large-v3</strong></span>
                  <span>Confidence: <strong className="text-zinc-800 dark:text-zinc-200 font-tabular">{currentAnalysis?.confidence || 94.2}%</strong></span>
                </div>
              </div>

            </div>
          </Card>

        </div>

        {/* Right Column: Real-Time Biometric Load & AI Directives */}
        <div className="space-y-6">
          
          {/* Real-Time Acoustic Emotion Metrics */}
          <Card
            title="Biometric Acoustic Load"
            subtitle="Extracted speech prosody & stress"
            badge={
              <StatusBadge status={isElevated ? 'critical' : isFatigued ? 'high-stress' : 'nominal'} size="sm">
                {emotion.driverState || 'Stressed'}
              </StatusBadge>
            }
          >
            <div className="space-y-3.5 text-xs">
              
              {/* Stress Score Gauge */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-baseline">
                  <span className="text-zinc-500">Cognitive Stress Index:</span>
                  <span className="text-2xl font-semibold text-zinc-950 dark:text-white font-tabular">
                    {emotion.stressScore || 78}<span className="text-xs font-normal text-zinc-400">/100</span>
                  </span>
                </div>
                <div className="w-full bg-zinc-100 dark:bg-zinc-800 h-2 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ${
                      isElevated ? 'bg-rose-500' : isFatigued ? 'bg-amber-400' : 'bg-zinc-950 dark:bg-white'
                    }`}
                    style={{ width: `${emotion.stressScore || 78}%` }}
                  />
                </div>
              </div>

              {/* Acoustic Breakdown Items */}
              <div className="space-y-2 pt-2 border-t border-zinc-100 dark:border-zinc-800/60">
                <div className="flex justify-between items-center">
                  <span className="text-zinc-500">Pitch Jitter Delta:</span>
                  <span className={`font-semibold font-tabular ${isElevated ? 'text-rose-600 dark:text-rose-400' : 'text-zinc-900 dark:text-zinc-100'}`}>
                    {emotion.pitchJitter || '+42.5 Hz'}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-zinc-500">Speech Cadence:</span>
                  <span className="font-medium text-zinc-900 dark:text-zinc-100 font-tabular">
                    {emotion.speechCadence || '185 WPM'}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-zinc-500">Vocal Intensity:</span>
                  <span className="font-medium text-zinc-900 dark:text-zinc-100 font-tabular">
                    {emotion.vocalIntensity || '88 dB'}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-zinc-500">Detected Emotion:</span>
                  <span className="font-medium text-zinc-900 dark:text-zinc-100 capitalize">
                    {emotion.emotionLabel || 'Frustrated'}
                  </span>
                </div>
              </div>

            </div>
          </Card>

          {/* AI Recommended Tactical Directive */}
          <Card
            title="Generated Pit Wall Directive"
            subtitle="Autonomous race engineer support"
            badge={<StatusBadge status="strategy" size="sm">Tactical</StatusBadge>}
          >
            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-md bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-950 space-y-1.5 shadow-2xs">
                <div className="flex items-center gap-1.5 font-semibold text-xs">
                  <Zap className="w-3.5 h-3.5 text-rose-400 dark:text-rose-600" />
                  <span>{currentAnalysis?.recommendation?.category || 'Radio Brevity Directive'}</span>
                </div>
                <p className="opacity-95 leading-relaxed font-normal text-xs">
                  "{currentAnalysis?.recommendation?.action || 'Enforce radio silence through Sector 2 high-G corners.'}"
                </p>
              </div>

              <div className="flex items-center justify-between text-zinc-500 pt-1">
                <span>Target Pit Entry:</span>
                <strong className="text-zinc-900 dark:text-zinc-100">
                  {currentAnalysis?.recommendation?.pitWindow || 'Lap 21 (Hard compound)'}
                </strong>
              </div>
            </div>
          </Card>

        </div>

      </div>

      {/* Side-by-Side Audio Playback & Transcript Verification Section */}
      <AudioVerificationCard
        uploadedAudioUrl={uploadedAudioUrl}
        uploadedAudioFile={uploadedAudioFile}
        currentAnalysis={currentAnalysis}
      />

      {/* AI Decision Explainability Section */}
      <ExplainabilityPanel
        recommendation={correlation?.recommendation || currentAnalysis?.recommendation}
        emotion={emotion}
        lapStats={lapStats}
        correlation={correlation}
        transcript={currentAnalysis?.transcript}
      />

    </div>
  );
};

export default RadioAnalysisPage;
