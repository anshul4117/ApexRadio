const path = require('path');
const fs = require('fs');
const speechToTextService = require('./speechToTextService');
const emotionDetectionService = require('./emotionDetectionService');
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
    },
    processingTime: '1.14s',
  },
];

class RadioAnalysisService {
  /**
   * Process and analyze an audio file
   * @param {Object} file - Multer uploaded file object (or sample preset metadata)
   * @param {Object} [params] - Additional parameters (driver, lap, sampleHint)
   * @returns {Promise<Object>}
   */
  async analyzeAudio(file, params = {}) {
    const startTime = Date.now();
    const filePath = file?.path || null;
    const sampleHint = params.sampleHint || file?.originalname || '';

    logger.info(`Starting AI Radio Analysis on: ${sampleHint || 'uploaded audio stream'}...`);

    // 1. Run Speech To Text
    const sttResult = await speechToTextService.transcribeAudio(filePath, { sampleHint });

    // 2. Run Emotion & Stress Detection
    const emotionResult = await emotionDetectionService.detectEmotion(sttResult.transcript, {
      durationSeconds: sttResult.durationSeconds,
    });

    // 3. Generate Dynamic AI Pit Wall Recommendation
    const recommendation = this.generateAiRecommendation(emotionResult, params);

    // 4. Calculate Timing & Metadata
    const processingDurationSeconds = Math.round((Date.now() - startTime) / 10) / 100;
    const processingTimeStr = `${Math.max(0.85, processingDurationSeconds)}s`;
    const audioDurationStr = `${sttResult.durationSeconds || 4.2}s`;

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
      },
      confidence: Math.round(((sttResult.confidence + emotionResult.confidence) / 2) * 10) / 10,
      recommendation,
      metadata: {
        audioDuration: audioDurationStr,
        audioFormat: file?.mimetype?.includes('mp3') ? 'MP3' : 'WAV',
        fileSizeKb: file?.size ? Math.round(file.size / 1024) : 160,
        originalName: file?.originalname || 'radio_transmission.wav',
        sttProvider: sttResult.provider || 'motorsport-stt-v1',
      },
      processingTime: processingTimeStr,
    };

    // Prepend to history
    analysisHistory.unshift(record);

    // Clean up temporary uploaded file after analysis
    if (filePath && fs.existsSync(filePath)) {
      try {
        fs.unlinkSync(filePath);
      } catch (unlinkErr) {
        logger.warn(`Could not delete temp file ${filePath}: ${unlinkErr.message}`);
      }
    }

    return record;
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
