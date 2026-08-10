# 🏎️ ApexRadio AI

**ApexRadio AI** is an AI-powered race engineer assistant that analyzes Formula-style driver radio communication, detects stress or fatigue, correlates it with lap performance, and provides decision support to the pit wall.

---

## 📁 Repository Structure

```
ApexRadio AI/
├── frontend/                     # React + Vite + Tailwind CSS + React Router + Recharts + Axios
│   ├── src/
│   │   ├── components/          # Reusable UI & Layout components
│   │   │   ├── layout/          # Navbar, Footer, Layout shell
│   │   │   └── ui/              # Button, Card, Badge
│   │   ├── pages/               # Landing, Login, Register, Dashboard, Profile
│   │   ├── services/            # Axios API client
│   │   ├── App.jsx              # React Router setup
│   │   ├── main.jsx             # React entry point
│   │   └── index.css            # Tailwind directives & monochrome theme
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── package.json
├── backend/                      # Node.js + Express
│   ├── src/
│   │   ├── config/              # Centralized environment configuration
│   │   ├── controllers/         # Health & future endpoint controllers
│   │   ├── services/            # Business logic services
│   │   ├── middleware/          # Error handling & request logging
│   │   ├── routes/              # Express route definitions
│   │   ├── utils/               # Standardized response & logger utilities
│   │   ├── app.js               # Express app instance
│   │   └── server.js            # Server listener
│   ├── .env.example
│   ├── .env
│   └── package.json
├── docs/                         # Project Specifications & Guidelines
│   ├── roadmap.md               # Hackathon timeline and future milestones
│   ├── architecture.md          # End-to-end data pipeline and system architecture
│   ├── api-contract.md          # REST API specifications and response schemas
│   └── ui-guidelines.md         # Monochrome telemetry UI design system
├── sample-data/                  # Mock race datasets
│   ├── driver-radio-transcripts.json
│   └── lap-telemetry-sample.json
├── package.json                  # Root runner scripts
└── README.md
```

---

## 🚀 Quick Start (Running Independently)

The frontend and backend run as independent Node.js applications.

### 1. Start the Backend Service

```bash
cd backend
npm install
npm run dev
```

- Backend API: `http://localhost:5001`
- Health check: `http://localhost:5001/api/health`

### 2. Start the Frontend Client

```bash
cd frontend
npm install
npm run dev
```

- Frontend Dev Server: `http://localhost:5173`

---

## 🛠️ Tech Stack

- **Frontend**: React 18, Vite, Tailwind CSS, React Router v6, Axios, Recharts, Lucide React
- **Backend**: Node.js, Express, Cors, Morgan, Dotenv
- **Design System**: High-contrast, clean minimalist black-and-white telemetry aesthetic

---

## 📖 Documentation Links

- [Project Roadmap](docs/roadmap.md)
- [System Architecture](docs/architecture.md)
- [API Contract](docs/api-contract.md)
- [UI Guidelines](docs/ui-guidelines.md)
