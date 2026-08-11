# 🏎️ ApexRadio AI — The Silent Co-Driver for Race Engineers

> **AI-powered pit wall intelligence that analyzes Formula 1 driver radio communications, detects vocal stress spikes, correlates biometric tension with lap pace degradation, and provides tactical decision support in real time.**

---

## 📌 Project Overview

During a Formula 1 race, drivers operate at heart rates exceeding **170 BPM** under **5G deceleration forces**. Race engineers on the pit wall monitor over **300 telemetry channels**, but they lack automated tools to detect the driver’s **cognitive stress and emotional fatigue** masked by loud engine noise and radio static.

**ApexRadio AI** bridges this gap by creating an end-to-end multi-modal intelligence loop:
1. **Radio Ingestion**: Captures live team radio audio streams (`.wav`, `.mp3`).
2. **Speech-to-Text**: Transcribes high-speed speech via **Hugging Face Whisper Large v3**.
3. **Emotion & Acoustic Stress Detection**: Analyzes pitch jitter (+42.5 Hz) and speech cadence (185 WPM) to classify driver state (**Calm**, **Stressed**, **Fatigued**).
4. **Telemetry Correlation**: Merges vocal stress with CAN bus lap telemetry to compute an explainable **Performance Risk Score (0–100)**.
5. **AI Pit Wall Recommendation**: Generates actionable pit window triggers and radio brevity directives to protect tires and prevent lockups.

---

## 🛠️ Tech Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 18, Vite, Tailwind CSS, Recharts, Lucide Icons, React Router v6 |
| **State Management** | React Context API (`AuthContext`, `RadioContext`, `LapContext`, `AlertsContext`, `DemoContext`) |
| **Backend** | Node.js, Express 4, Multer (multipart audio/CSV), JWT Authentication, Bcryptjs |
| **AI / ML Models** | Hugging Face Inference API (`openai/whisper-large-v3`, `j-hartmann/emotion-english-distilroberta-base`) |
| **Telemetry & Visualization** | Recharts multi-line pace curves with 5-lap moving averages and stress event markers |
| **Design Language** | Minimal Linear + Notion monochrome aesthetic with dark/light mode toggle |

---

## 📁 Repository Structure

```
ApexRadio AI/
├── backend/
│   ├── src/
│   │   ├── config/env.config.js          # Environment variables & Hugging Face settings
│   │   ├── controllers/                  # Route controllers (auth, radio, laps)
│   │   ├── middleware/                   # JWT auth & Multer upload middleware
│   │   ├── routes/                       # Express API route definitions
│   │   ├── services/                     # Modular service layer (STT, Emotion, Correlation, Laps)
│   │   └── server.js                     # Express application entry point
│   ├── package.json
│   └── .env.example
│
├── frontend/
│   ├── src/
│   │   ├── components/                   # UI primitives (Cards, Badges, Buttons) & Layout
│   │   ├── context/                      # Shared React Context providers
│   │   ├── pages/                        # 7 Complete application views
│   │   │   ├── LandingPage.jsx           # 15-second value proposition & feature overview
│   │   │   ├── ArchitecturePage.jsx      # Technical blueprint & service breakdown
│   │   │   ├── DashboardPage.jsx         # Live pit wall control center HUD
│   │   │   ├── RadioAnalysisPage.jsx     # Audio upload, waveform, STT transcript, emotion
│   │   │   ├── LapPerformancePage.jsx    # CSV upload, Recharts curves, sector splits
│   │   │   ├── AiAlertsPage.jsx          # 4-tier alert queue with root cause explanations
│   │   │   ├── RaceTimelinePage.jsx      # Multi-track chronological event stream
│   │   │   └── ProfilePage.jsx           # Team, driver, theme & acoustic preferences
│   │   ├── services/api.js               # Axios API client with bearer token interceptor
│   │   └── App.jsx                       # Protected route definitions
│   ├── vercel.json                       # Vercel SPA routing configuration
│   ├── package.json
│   └── .env.example
│
├── sample-data/
│   └── silverstone_stint1_telemetry.csv  # 18 laps of realistic Formula 1 telemetry
└── docs/
    ├── judge-demo.md                     # 2-minute judge pitch script & click order
    └── deployment.md                     # Vercel & Render deployment instructions
```

---

## 🚀 Quick Start (Local Setup)

### Prerequisites
- Node.js (v18 or higher)
- npm (v9 or higher)

### 1. Clone Repository
```bash
git clone https://github.com/anshul4117/ApexRadio.git
cd ApexRadio
```

### 2. Backend Setup
```bash
cd backend
npm install
cp .env.example .env
npm run dev
```
*Backend server will start on `http://localhost:5001`.*

### 3. Frontend Setup
```bash
cd ../frontend
npm install
npm run dev
```
*Frontend will be available on `http://localhost:5173`.*

---

## 🔑 Environment Variables

### Backend (`backend/.env`)
```env
PORT=5001
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173
JWT_SECRET=apexradio-ai-hackathon-jwt-secret-key-2026
JWT_EXPIRES_IN=7d

# Hugging Face Inference Configuration (Optional - falls back to domain model)
HUGGINGFACE_API_KEY=
HF_STT_MODEL=openai/whisper-large-v3
HF_EMOTION_MODEL=j-hartmann/emotion-english-distilroberta-base
HF_REQUEST_TIMEOUT_MS=30000
```

### Frontend (`frontend/.env`)
```env
VITE_API_URL=http://localhost:5001/api
```

---

## 🏆 Hackathon Demo Mode (One-Click Testing)

ApexRadio AI comes with a built-in **Demo Mode** toggle in the top header. When enabled, it instantly pre-loads the full **Silverstone GP Lap 1–18 race scenario**:
- **Laps 1–14**: Calm baseline, stint-best pace (1:29.420), nominal tire degradation.
- **Lap 16**: Traffic callout in Sector 2, vocal tension rises (+31.2 Hz, 62% stress).
- **Lap 18**: Front-left tire slip in Turn 4, severe vocal stress spike (+42.5 Hz, 78% stress), lap pace drops by +1.82s.
- **Risk Score**: Escalates to **61% (High)**.
- **AI Recommendation**: Enforce radio silence through high-G braking & queue Lap 21 pit window for Hard compound.

---

## 📖 Documentation & Judging Guides

- **Judge Presentation Script**: [docs/judge-demo.md](file:///Users/anshul/OurUses/Hackathon/ApexRadio%20AI/docs/judge-demo.md) (2-minute click-by-click walkthrough).
- **Deployment Guide**: [docs/deployment.md](file:///Users/anshul/OurUses/Hackathon/ApexRadio%20AI/docs/deployment.md) (Vercel + Render step-by-step).

---

## 🤗 Acknowledgments & Credits

Special thanks to **[Hugging Face](https://huggingface.co/)** 🤗 for providing the state-of-the-art open-source AI infrastructure and model ecosystems that power the acoustic intelligence and natural language processing pipelines in ApexRadio AI:
- **DistilRoBERTa Emotion Classifier** (`j-hartmann/emotion-english-distilroberta-base`): Real-time cognitive stress, sentiment, and emotional tone classification.
- **Hugging Face Inference Providers & Transformers**: Scalable model execution and developer-first AI infrastructure.

---

## 📄 License

MIT License — Created for the ApexRadio AI Hackathon Project.
