# ApexRadio AI — Deployment Guide

This guide details zero-downtime deployment for the **ApexRadio AI** full-stack system:
- **Frontend**: Deployed on [Vercel](https://vercel.com)
- **Backend**: Deployed on [Render](https://render.com) (or Railway / AWS ECS)

---

## 1. Backend Deployment (Render)

### Step-by-Step Instructions

1. Log into **Render** and click **New + &rarr; Web Service**.
2. Connect your GitHub repository: `https://github.com/anshul4117/ApexRadio`.
3. Configure the service settings:
   - **Name**: `apexradio-ai-backend`
   - **Root Directory**: `backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
4. Add **Environment Variables**:
   | Key | Value | Description |
   | :--- | :--- | :--- |
   | `PORT` | `5001` (or leave default on Render) | Backend server port |
   | `NODE_ENV` | `production` | Production mode |
   | `CORS_ORIGIN` | `https://your-apexradio-frontend.vercel.app` | Allowed frontend domain |
   | `JWT_SECRET` | `apexradio-production-secret-key-2026` | JWT signature key |
   | `JWT_EXPIRES_IN` | `7d` | Session expiration |
   | `HUGGINGFACE_API_KEY` | `hf_...` (optional for live API) | Hugging Face Access Token |
   | `HF_STT_MODEL` | `openai/whisper-large-v3` | STT Model |
   | `HF_EMOTION_MODEL` | `j-hartmann/emotion-english-distilroberta-base` | Emotion Model |
5. Click **Deploy Web Service**.

### Health-Check Verification
Once deployed, verify that the health check responds:
```bash
curl https://your-backend.onrender.com/api/health
```
**Expected Response**:
```json
{
  "success": true,
  "data": {
    "status": "healthy",
    "uptime": 12.4,
    "version": "1.0.0"
  },
  "message": "ApexRadio AI API service operational"
}
```

---

## 2. Frontend Deployment (Vercel)

### Step-by-Step Instructions

1. Log into **Vercel** and click **Add New... &rarr; Project**.
2. Select your repository: `ApexRadio`.
3. Configure project settings:
   - **Framework Preset**: `Vite`
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. Add **Environment Variables**:
   | Key | Value |
   | :--- | :--- |
   | `VITE_API_URL` | `https://your-backend.onrender.com/api` |
5. Click **Deploy**.

---

## 3. SPA Routing & Verification

- The included `frontend/vercel.json` ensures that deep routing (`/dashboard`, `/dashboard/radio`, `/dashboard/alerts`, `/architecture`) resolves to `index.html` without 404 errors.
- Test authentication, Demo Mode, audio upload, and Recharts rendering in the production preview.
