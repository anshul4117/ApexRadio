# ApexRadio AI - System Architecture

## 1. High-Level Architecture Overview

ApexRadio AI processes multi-modal race communications and vehicle telemetry to provide pit wall race engineers with real-time driver state awareness and strategy decision support.

```mermaid
flowchart TD
    subgraph Trackside Data Sources
        TR[Driver Radio Audio Stream]
        TX[Radio Transcripts]
        TL[CAN/Telemetry Stream: Speed, Throttle, Brake, Tires]
    end

    subgraph Ingestion Layer
        AI_INGEST[Audio / Stream Ingestion Service]
        TL_INGEST[Telemetry Normalizer]
    end

    subgraph AI Intelligence Engine
        STT[Motorsport STT Pipeline]
        ACOUSTIC[Vocal Acoustic / Pitch Analyzer]
        NLP[NLP Sentiment & Urgency Classifier]
        STRESS_FUSION[Stress & Cognitive Load Engine]
        CORRELATION[Lap Performance Correlation Service]
        STRATEGY_AI[Pit Wall Strategy & Action Engine]
    end

    subgraph Backend API Services
        EXPRESS[Express Application Core]
        HEALTH[Health & Diagnostics Service]
        WS[Telemetry & Radio WebSocket Broadcast]
    end

    subgraph Pit Wall Frontend UI
        REACT[Vite + React UI]
        NAV[Navigation & Layout HUD]
        STREAM_VIEW[Live Radio Stream & Waveform]
        TELEMETRY_CHART[Recharts Telemetry Overlay]
        DECISION_FEED[Strategy & Decision Support Feed]
    end

    TR --> AI_INGEST
    TX --> AI_INGEST
    TL --> TL_INGEST

    AI_INGEST --> STT
    AI_INGEST --> ACOUSTIC
    STT --> NLP

    ACOUSTIC --> STRESS_FUSION
    NLP --> STRESS_FUSION
    TL_INGEST --> CORRELATION
    STRESS_FUSION --> CORRELATION

    CORRELATION --> STRATEGY_AI
    STRATEGY_AI --> EXPRESS
    EXPRESS --> WS
    EXPRESS --> HEALTH

    WS --> REACT
    EXPRESS --> REACT
    REACT --> STREAM_VIEW
    REACT --> TELEMETRY_CHART
    REACT --> DECISION_FEED
    REACT --> NAV
```

---

## 2. Core Subsystems

### 2.1 Audio & Radio Pipeline
- Ingests raw audio feeds from driver-to-pit radio channels.
- Cleans wind, road, and high-RPM engine noise.
- Transcribes transmissions into textual tokens with motorsport-tuned vocabulary.

### 2.2 Stress & Cognitive Load Engine
- Evaluates acoustic metrics (jitter, shimmer, speech rate, vocal cadence).
- Analyzes linguistic sentiment, urgency markers, and expletives/stress vocabulary.
- Computes a normalized **Driver Stress Index (0-100)** with confidence intervals.

### 2.3 Telemetry Correlation Service
- Aligns stress timestamps with time-series vehicle telemetry:
  - Corner entry/exit speeds
  - Braking points and lock-up instances
  - Throttle smoothness and tire degradation rate
- Flags anomalies such as stress spikes preceding driving errors or pace drops.

### 2.4 Pit Wall Decision Support
- Evaluates pit strategy impact (undercut timing, tire life projection).
- Issues "Radio Silence" recommendations during critical high-stress maneuvers.
- Suggests clear, concise engineer responses tailored to the driver's current cognitive load.

### 2.5 Presentation Layer (Frontend)
- High-contrast, dark monochrome telemetry UI designed for low-light, high-speed pit wall environments.
- Minimalist component system prioritizing immediate data readability and low cognitive friction.
