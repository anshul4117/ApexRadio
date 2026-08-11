# ApexRadio AI — Production Deployment Guide

This guide details the production deployment configuration for **ApexRadio AI**:
- **Frontend (Vercel)**: `https://apex-radio-xi.vercel.app`
- **Backend (Render)**: `https://apexradio.onrender.com`

---

## 1. Backend Deployment (Render)

- **Service URL**: `https://apexradio.onrender.com`
- **Root Directory**: `backend`
- **Build Command**: `npm install`
- **Start Command**: `npm start`

### Production Environment Variables on Render
| Key | Production Value | Description |
| :--- | :--- | :--- |
| `PORT` | `5001` (or automatic Render port) | Backend port |
| `NODE_ENV` | `production` | Production environment |
| `FRONTEND_URL` | `https://apex-radio-xi.vercel.app,http://localhost:5173` | Allowed frontend domains |
| `CORS_ORIGIN` | `https://apex-radio-xi.vercel.app` | Primary CORS origin |
| `JWT_SECRET` | `apexradio-ai-hackathon-jwt-secret-key-2026` | JWT secret |
| `JWT_EXPIRES_IN` | `7d` | Session expiration |
| `HUGGINGFACE_API_KEY` | *(optional HF user token)* | Hugging Face Inference API |
| `HF_STT_MODEL` | `openai/whisper-large-v3` | STT Model |
| `HF_EMOTION_MODEL` | `j-hartmann/emotion-english-distilroberta-base` | Emotion Model |

### Health-Check Verification
```bash
curl https://apexradio.onrender.com/api/health
```

---

## 2. Frontend Deployment (Vercel)

- **App URL**: `https://apex-radio-xi.vercel.app`
- **Root Directory**: `frontend`
- **Framework Preset**: `Vite`
- **Build Command**: `npm run build`
- **Output Directory**: `dist`

### Production Environment Variables on Vercel
| Key | Production Value |
| :--- | :--- |
| `VITE_API_URL` | `https://apexradio.onrender.com` |

---

## 3. Verified Communications & CORS

- **CORS Allowlist**: Configured on backend with preflight `OPTIONS` handling (`204 No Content`).
- **Shared Axios Client**: Automatically ensures `/api` is prefixed if `VITE_API_URL` is provided as base host (`https://apexradio.onrender.com`).
- **Credentials**: `withCredentials: true` enabled on both Axios client and Express CORS.
- **SPA Routing**: `vercel.json` provides rewrites for React Router SPA routes.
