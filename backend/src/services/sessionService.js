const fs = require('fs');
const path = require('path');
const logger = require('../utils/logger.util');
const correlationService = require('./correlationService');

/**
 * Unified Race Session Manager (Singleton)
 * Maintains single source of truth for active race session connecting:
 * - Driver profile & session time
 * - Radio Speech-to-Text transcript & Acoustic Stress/Emotion
 * - Lap Time CSV Telemetry & Moving Averages
 * - Grand Prix Stress ↔ Lap Performance Correlation Engine
 */
class SessionService {
  constructor() {
    this.session = this.getInitialSessionState();
  }

  getInitialSessionState() {
    return {
      sessionId: 'session_live_silverstone',
      driverName: 'Max Verstappen',
      carNumber: '#1',
      teamName: 'Apex Racing GP',
      circuit: 'Silverstone Circuit',
      currentLap: 18,
      totalLaps: 18,
      transcript: 'Front left is completely gone guys, massive understeer in Turn 4, I cannot rotate the car.',
      driverState: 'Stressed',
      stressScore: 78,
      pitchJitter: '+42.5 Hz',
      speechCadence: '185 WPM',
      confidence: 96.8,
      lapData: [],
      lapStats: null,
      correlation: {
        stressLap: 18,
        stressScore: 78,
        driverState: 'Stressed',
        avgBeforeStressSec: 89.540,
        avgBeforeStressTime: '1:29.540',
        avgAfterStressSec: 91.120,
        avgAfterStressTime: '1:31.120',
        fastestLap: { lap: 14, lapTime: '1:29.420', lapTimeSec: 89.420 },
        slowestLap: { lap: 18, lapTime: '1:31.240', lapTimeSec: 91.240 },
        performanceDegradationSec: 1.58,
        performanceDegradationStr: '+1.58 s/lap',
        paceLossPercentage: 1.76,
        paceLossPercentageStr: '+1.76%',
        correlationLevel: 'High',
        correlationLevelBadgeVariant: 'critical',
        engineeringInsight: 'Driver stress increased at Lap 18 and lap performance worsened by 1.58 seconds per lap (+1.76% pace loss) afterward.',
        recommendation: {
          category: 'Radio Brevity & Tire Strategy',
          action: 'Driver stress is affecting pace. Consider reducing radio traffic and evaluating tire condition.',
          pitWindow: 'Lap 21 (Hard compound)',
          urgency: 'Immediate',
          correlationLevel: 'High',
        },
        riskScore: 61,
        riskTier: 'High',
        riskBadgeVariant: 'critical',
        confidence: 94.2,
      },
      sessionTimestamp: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  }

  /**
   * Get current combined race session
   */
  getSession() {
    return this.session;
  }

  /**
   * Update radio analysis results into unified session & re-correlate
   */
  updateRadioData({ transcript, emotion, confidence, driverName, lap, recommendation }) {
    this.session.transcript = transcript || this.session.transcript;
    if (emotion) {
      this.session.driverState = emotion.driverState || this.session.driverState;
      this.session.stressScore = emotion.stressScore ?? this.session.stressScore;
      this.session.pitchJitter = emotion.pitchJitter || this.session.pitchJitter;
      this.session.speechCadence = emotion.speechCadence || this.session.speechCadence;
    }
    if (confidence) this.session.confidence = confidence;
    if (driverName) this.session.driverName = driverName;
    if (lap) {
      this.session.currentLap = lap;
      if (lap > this.session.totalLaps) this.session.totalLaps = lap;
    }

    // Re-correlate with active lap telemetry
    if (this.session.lapStats) {
      this.session.correlation = correlationService.correlate(
        this.session.lapStats,
        {
          emotion: {
            driverState: this.session.driverState,
            stressScore: this.session.stressScore,
            pitchJitter: this.session.pitchJitter,
            speechCadence: this.session.speechCadence,
          },
          lap: this.session.currentLap,
          confidence: this.session.confidence,
        }
      );
    } else if (recommendation) {
      this.session.correlation.recommendation = recommendation;
    }

    this.session.sessionTimestamp = new Date().toISOString();
    this.session.updatedAt = new Date().toISOString();

    logger.info('Race session updated with radio analysis & re-correlated', {
      driver: this.session.driverName,
      state: this.session.driverState,
      stress: this.session.stressScore,
      correlationLevel: this.session.correlation?.correlationLevel,
    });

    return this.session;
  }

  /**
   * Update parsed lap telemetry into unified session
   */
  updateLapData({ laps, lapStats, correlation, filename, driverName }) {
    if (Array.isArray(laps) && laps.length > 0) {
      this.session.lapData = laps;
      this.session.totalLaps = laps.length;
      this.session.currentLap = laps[laps.length - 1].lap || laps.length;
    }

    if (lapStats) {
      this.session.lapStats = lapStats;
    }

    if (correlation) {
      this.session.correlation = correlation;
    } else if (lapStats) {
      // Re-correlate if not already provided
      this.session.correlation = correlationService.correlate(
        lapStats,
        {
          emotion: {
            driverState: this.session.driverState,
            stressScore: this.session.stressScore,
            pitchJitter: this.session.pitchJitter,
            speechCadence: this.session.speechCadence,
          },
          lap: this.session.currentLap,
          confidence: this.session.confidence,
        }
      );
    }

    if (driverName) {
      this.session.driverName = driverName;
    }

    if (filename) {
      this.session.lapFilename = filename;
    }

    this.session.sessionTimestamp = new Date().toISOString();
    this.session.updatedAt = new Date().toISOString();

    logger.info('Race session updated with lap telemetry', {
      lapsCount: this.session.totalLaps,
      currentLap: this.session.currentLap,
      correlationLevel: this.session.correlation?.correlationLevel,
    });

    return this.session;
  }

  /**
   * Reset session to default state
   */
  resetSession() {
    this.session = this.getInitialSessionState();
    return this.session;
  }
}

module.exports = new SessionService();
