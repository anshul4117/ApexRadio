const fs = require('fs');
const path = require('path');
const logger = require('../utils/logger.util');

/**
 * Unified Race Session Manager (Singleton)
 * Maintains single source of truth for active race session connecting:
 * - Driver profile & session time
 * - Radio Speech-to-Text transcript & Acoustic Stress/Emotion
 * - Lap Time CSV Telemetry & Moving Averages
 * - Multi-Factor Performance Risk Score & AI Recommendation
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
        riskScore: 61,
        riskTier: 'High',
        riskBadgeVariant: 'critical',
        riskFactors: [
          'Driver stress detected with 78% confidence (+42.5 Hz pitch jitter)',
          'Lap 18 sector 2 time degraded by +1.40s vs stint best',
          'Front-left tire degradation reached 40.4%',
          'Aggregate risk score reached 61% (High Severity)',
        ],
        weights: {
          emotionScore: 40,
          lapTrend: 30,
          stressFrequency: 20,
          sessionContext: 10,
        },
        recommendation: {
          category: 'Radio Brevity Directive',
          action: 'Enforce radio silence through Sector 2 high-G corners and prepare undercut pit window.',
          pitWindow: 'Lap 21',
          urgency: 'Immediate',
        },
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
   * Update radio analysis results into unified session
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
    if (recommendation) {
      this.session.correlation.recommendation = recommendation;
    }

    this.session.sessionTimestamp = new Date().toISOString();
    this.session.updatedAt = new Date().toISOString();

    logger.info('Race session updated with radio audio analysis', {
      driver: this.session.driverName,
      state: this.session.driverState,
      stress: this.session.stressScore,
      lap: this.session.currentLap,
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
      fastest: lapStats?.fastestLap?.lapTime,
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
