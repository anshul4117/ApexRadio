const fs = require('fs');
const envConfig = require('../config/env.config');
const speechToTextService = require('./speechToTextService');
const emotionDetectionService = require('./emotionDetectionService');
const huggingFaceClient = require('./huggingFaceClient');
const logger = require('../utils/logger.util');

// In-memory analysis session history
const analysisHistory = [
  {
    id: 'tx_seed_001',
    timestamp: new Date(Date.now() - 3 * 60 * 1000).toISOString(),
    driver: 'Max Verstappen',
    driverId: 'VER-01',
    car: 'Car #1',
    lap: 18,
    transcript: 'Front left is completely gone guys, massive understeer in Turn 4, I cannot rotate the car.',
    emotion: {
      driverState: 'Stressed',
      stressScore: 78,
      emotionLabel: 'Frustrated',
      pitchJitter: '+42.5 Hz',
      speechCadence: '185 WPM',
      vocalIntensity: '88 dB',
      modelScores: [
        { label: 'anger', score: 0.782 },
        { label: 'fear', score: 0.141 },
        { label: 'neutral', score: 0.077 },
      ],
    },
    confidence: 94.2,
    recommendation: {
      action: 'Enforce radio silence through Sector 2 high-G corners.',
      category: 'Radio Brevity',
      pitWindow: 'Lap 21 (Hard compound)',
      priority: 'critical',
    },
    metadata: {
      audioDuration: '4.2s',
      audioFormat: 'WAV',
      fileSizeKb: 148,
      originalName: 'lap18_ver_understeer.wav',
      sttModel: envConfig.hfSttModel,
      emotionModel: envConfig.hfEmotionModel,
      inferenceProvider: huggingFaceClient.hasApiKey() ? 'Hugging Face API' : 'Domain Acoustic Engine',
    },
    processingTime: '1.14s',
  },
];

class RadioAnalysisService {
  /**
   * Process and analyze an audio file or sample preset through Hugging Face STT + Emotion Pipeline
   * @param {Object} file - Multer uploaded file object (optional)
   * @param {Object} [params] - Additional parameters (driver, lap, sampleHint)
   * @returns {Promise<Object>}
   */
  async analyzeAudio(file, params = {}) {
    const startTime = Date.now();
    const filePath = file?.path || null;
    const sampleHint = params.sampleHint || '';

    logger.info(`[RadioAnalysis] Executing STT + Emotion pipeline for: ${file?.originalname || sampleHint || 'audio stream'}`);

    try {
      // 1. Run Hugging Face Speech To Text on the uploaded audio file
      const sttResult = await speechToTextService.transcribeAudio(filePath, {
        sampleHint,
        originalName: file?.originalname || null,
      });

      logger.info(`[RadioAnalysis] STT finished. Passing transcript (${sttResult.transcript.length} chars) to Emotion Classifier...`);

      // 2. Pass transcript directly into Emotion & Stress Detection Service
      const emotionResult = await emotionDetectionService.detectEmotion(sttResult.transcript, {
        durationSeconds: sttResult.durationSeconds,
      });

      // 3. Generate Dynamic AI Pit Wall Recommendation
      const recommendation = this.generateAiRecommendation(emotionResult, params);

      // 4. Calculate Timing & Metadata
      const elapsedSeconds = Math.round((Date.now() - startTime) / 10) / 100;
      const processingTimeStr = `${Math.max(0.85, elapsedSeconds)}s`;
      const audioDurationStr = `${sttResult.durationSeconds || 4.2}s`;
      const hasKey = huggingFaceClient.hasApiKey();

      const record = {
        id: `tx_${Date.now()}`,
        timestamp: new Date().toISOString(),
        driver: params.driverName || 'Max Verstappen',
        driverId: params.driverId || 'VER-01',
        car: params.car || 'Car #1',
        lap: params.lap ? Number(params.lap) : 18,
        transcript: sttResult.transcript,
        emotion: {
          driverState: emotionResult.driverState,
          stressScore: emotionResult.stressScore,
          emotionLabel: emotionResult.emotionLabel,
          pitchJitter: emotionResult.pitchJitter,
          speechCadence: emotionResult.speechCadence,
          vocalIntensity: emotionResult.vocalIntensity,
          modelScores: emotionResult.modelScores || [],
        },
        confidence: Math.round(((sttResult.confidence + emotionResult.confidence) / 2) * 10) / 10,
        recommendation,
        metadata: {
          audioDuration: audioDurationStr,
          audioFormat: file?.mimetype?.includes('mp3') ? 'MP3' : 'WAV',
          fileSizeKb: file?.size ? Math.round(file.size / 1024) : 160,
          originalName: file?.originalname || 'radio_transmission.wav',
          sttModel: sttResult.model || envConfig.groqSttModel || 'whisper-large-v3',
          emotionModel: envConfig.hfEmotionModel,
          inferenceProvider: sttResult.provider || 'Groq (Whisper Large v3)',
        },
        processingTime: processingTimeStr,
      };

      // Prepend to session history
      analysisHistory.unshift(record);

      return record;
    } finally {
      // Clean up temporary uploaded file after analysis
      if (filePath && fs.existsSync(filePath)) {
        try {
          fs.unlinkSync(filePath);
        } catch (unlinkErr) {
          logger.warn(`Could not delete temp file ${filePath}: ${unlinkErr.message}`);
        }
      }
    }
  }

  /**
   * Generate tactical AI pit wall recommendation based on driver state
   */
  generateAiRecommendation(emotion, params = {}) {
    if (emotion.driverState === 'Stressed' || emotion.stressScore >= 75) {
      return {
        action: 'Enforce radio silence through Sector 2 high-G corners.',
        category: 'Radio Brevity',
        pitWindow: 'Lap 21 (Hard compound)',
        priority: 'critical',
      };
    }

    if (emotion.driverState === 'Fatigued' || emotion.stressScore >= 50) {
      return {
        action: 'Instruct brake bias +1 forward to mitigate front disc vibration.',
        category: 'Chassis Balance',
        pitWindow: 'Lap 22 (Hard compound)',
        priority: 'warning',
      };
    }

    return {
      action: 'Pace is stable. Maintain current engine mode (Strat 4).',
      category: 'Pace Management',
      pitWindow: 'Lap 24 (Nominal window)',
      priority: 'nominal',
    };
  }

  /**
   * Get all recorded radio analysis history
   */
  getHistory() {
    return analysisHistory;
  }
}

module.exports = new RadioAnalysisService();
