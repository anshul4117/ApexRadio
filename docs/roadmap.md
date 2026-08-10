# ApexRadio AI - Project Roadmap

## Overview
ApexRadio AI is an AI-powered race engineer assistant that analyzes Formula-style driver radio communications, detects stress, fatigue, and cognitive overload, correlates these signals with real-time lap telemetry, and delivers actionable strategy recommendations to the pit wall.

---

## Hackathon Development Phases

### Phase 1: Foundation & Telemetry Scaffolding (Current)
- [x] Full-stack directory structure (Frontend, Backend, Docs, Sample Data)
- [x] Vite + React + Tailwind CSS client setup with React Router
- [x] Clean minimal monochrome pit wall design system
- [x] Node.js Express backend with modular structure (`routes`, `controllers`, `services`, `middleware`, `utils`, `config`)
- [x] Health check endpoint (`GET /api/health`)
- [x] Sample datasets for driver radio transcripts and lap telemetry

### Phase 2: Ingestion & Audio/Text Pipeline
- [ ] Ingestion service for live/recorded team radio audio and transcripts
- [ ] Audio preprocessing (noise reduction for engine/wind background noise)
- [ ] Speech-to-Text (STT) transcription with Formula 1 / motorsport domain terminology dictionary (e.g., *delta, box box, DRS, undercut, oversteer, diff, MGU-K*)
- [ ] Real-time transcript streaming over WebSockets / Server-Sent Events

### Phase 3: Stress, Emotion & Cognitive Overload AI Models
- [ ] Acoustic feature extraction (pitch jitter, speech rate, vocal intensity)
- [ ] NLP Sentiment & Urgency analysis on transcribed messages
- [ ] Multi-modal Stress Index scoring (0 - 100 scale)
- [ ] Driver baseline calibration (distinguishing standard intense communication from abnormal stress/panic)

### Phase 4: Telemetry Correlation & Pit Wall Decision Engine
- [ ] Ingestion of sector times, speed traps, brake points, tire temperatures, and throttle traces
- [ ] Time-series alignment between radio stress spikes and micro-mistakes (lockups, missed apexes, lap time degradation)
- [ ] Decision Support Engine:
  - Radio brevity alerts (avoid talking during heavy braking/traffic)
  - Strategy recommendations (pit window adjustments, engine mode recommendations)
  - Driver reassurance prompts and targeted concise feedback suggestions

### Phase 5: Interactive Visual Pit Wall Dashboard
- [ ] Live Telemetry & Radio timeline visualization using Recharts
- [ ] Stress Gauge & Driver Cognitive Load HUD
- [ ] AI Strategy recommendations feed
- [ ] Replay mode with synced audio playback and telemetry scrubbing
