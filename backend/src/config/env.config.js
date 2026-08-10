const path = require('path');
const dotenv = require('dotenv');

dotenv.config();

const envConfig = {
  port: process.env.PORT || 5001,
  nodeEnv: process.env.NODE_ENV || 'development',
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  jwtSecret: process.env.JWT_SECRET || 'apexradio-ai-hackathon-jwt-secret-key-2026',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  uploadDir: path.join(__dirname, '../../uploads'),
  
  // Hugging Face inference configurations
  hfApiKey: process.env.HF_API_KEY || '',
  hfSttModel: process.env.HF_STT_MODEL || 'openai/whisper-large-v3',
  hfEmotionModel: process.env.HF_EMOTION_MODEL || 'j-hartmann/emotion-english-distilroberta-base',

  isProduction: process.env.NODE_ENV === 'production',
};

module.exports = envConfig;
