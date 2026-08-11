const path = require('path');
const dotenv = require('dotenv');

// Load environment variables from cwd and from backend/.env
dotenv.config();
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

// Production-safe allowlist of frontend domains
const defaultAllowedOrigins = [
  'https://apex-radio-xi.vercel.app',
  'http://localhost:5173',
  'http://127.0.0.1:5173',
];

const customOrigins = [];
if (process.env.FRONTEND_URL) {
  process.env.FRONTEND_URL.split(',').forEach((o) => customOrigins.push(o.trim()));
}
if (process.env.CORS_ORIGIN) {
  process.env.CORS_ORIGIN.split(',').forEach((o) => customOrigins.push(o.trim()));
}

const allowedOrigins = Array.from(
  new Set([...defaultAllowedOrigins, ...customOrigins].filter(Boolean).map((o) => o.replace(/\/+$/, '')))
);

const envConfig = {
  port: process.env.PORT || 5001,
  nodeEnv: process.env.NODE_ENV || 'development',
  allowedOrigins,
  corsOrigin: allowedOrigins,
  jwtSecret: process.env.JWT_SECRET || 'apexradio-ai-hackathon-jwt-secret-key-2026',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  uploadDir: path.join(__dirname, '../../uploads'),
  
  // Groq Speech-to-Text API Configuration
  groqApiKey: process.env.GROQ_API_KEY || '',
  groqSttModel: process.env.GROQ_STT_MODEL || 'whisper-large-v3',
  groqBaseUrl: 'https://api.groq.com/openai/v1/audio/transcriptions',
  groqTimeoutMs: Number(process.env.GROQ_REQUEST_TIMEOUT_MS) || 20000,

  // Hugging Face Emotion Model Configuration
  hfApiKey: process.env.HUGGINGFACE_API_KEY || process.env.HF_API_KEY || '',
  hfSttModel: process.env.HF_STT_MODEL || 'openai/whisper-large-v3',
  hfEmotionModel: process.env.HF_EMOTION_MODEL || 'j-hartmann/emotion-english-distilroberta-base',
  hfRequestTimeoutMs: Number(process.env.HF_REQUEST_TIMEOUT_MS) || 45000,

  isProduction: process.env.NODE_ENV === 'production',
};

module.exports = envConfig;
