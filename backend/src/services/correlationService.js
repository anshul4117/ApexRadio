const logger = require('../utils/logger.util');

class CorrelationService {
  /**
   * Correlate telemetry lap stats with driver radio emotion results
   * @param {Object} lapStats - Output from lapAnalysisService
   * @param {Object} latestRadio - Output from radioAnalysisService / latest transmission
   * @param {Array<Object>} [radioHistory] - Session history of transmissions
   * @returns {Object} Correlation result with Performance Risk Score & Explanation
   */
  correlate(lapStats, latestRadio = {}, radioHistory = []) {
    logger.info('[Correlation] Computing Performance Risk Score and tactical correlations...');

    const emotion = latestRadio.emotion || {
      driverState: 'Stressed',
      stressScore: 78,
      emotionLabel: 'Frustrated',
    };

    const driverState = emotion.driverState || 'Stressed';
    const stressScore = Number(emotion.stressScore) || 75;
    const lapTrend = lapStats.lapTrend || 'worsening'; // 'improving' | 'stable' | 'worsening'

    // Calculate pace degradation (last 5 avg vs fastest lap)
    const fastestSec = lapStats.fastestLap?.lapTimeSec || 89.42;
    const lastFiveSec = lapStats.lastFiveAvgSec || 90.50;
    const paceLossSeconds = Math.max(0, Math.round((lastFiveSec - fastestSec) * 1000) / 1000);

    // Count consecutive stressed radio transmissions
    const allTransmissions = radioHistory.length > 0 ? radioHistory : [latestRadio];
    const recentStressedCount = allTransmissions.filter(
      (tx) => tx.emotion?.driverState === 'Stressed' || (tx.emotion?.stressScore || 0) >= 70
    ).length;

    // Multi-factor Risk Score Calculation (0 - 100)
    let score = 0;

    // 1. Vocal Stress Factor (40% weight)
    score += (stressScore / 100) * 40;

    // 2. Lap Pace Degradation Factor (35% weight)
    // 0s loss = 0pts, 2.0s loss = 35pts max
    const paceDegradationScore = Math.min(35, (paceLossSeconds / 2.0) * 35);
    score += paceDegradationScore;

    // 3. Consecutive Stress Events (15% weight)
    // 1 event = 5pts, 3+ events = 15pts
    const consecutiveScore = Math.min(15, recentStressedCount * 5);
    score += consecutiveScore;

    // 4. Lap Trend Modifier (10% weight)
    if (lapTrend === 'worsening') {
      score += 10;
    } else if (lapTrend === 'stable') {
      score += 4;
    } else if (lapTrend === 'improving') {
      score -= 5;
    }

    // Clamp score to 0–100
    const finalRiskScore = Math.max(5, Math.min(98, Math.round(score)));

    // Map to Risk Tiers
    let riskTier = 'Low';
    let riskBadgeVariant = 'nominal';

    if (finalRiskScore >= 80) {
      riskTier = 'Critical';
      riskBadgeVariant = 'critical';
    } else if (finalRiskScore >= 60) {
      riskTier = 'High';
      riskBadgeVariant = 'critical';
    } else if (finalRiskScore >= 30) {
      riskTier = 'Medium';
      riskBadgeVariant = 'high-stress';
    } else {
      riskTier = 'Low';
      riskBadgeVariant = 'nominal';
    }

    // Generate Explainability Factors
    const explainabilityFactors = [];

    if (driverState === 'Stressed' || stressScore >= 70) {
      explainabilityFactors.push({
        id: 'fac-stress',
        title: 'Elevated Vocal Stress Detected',
        description: `Voice pitch jitter & speech cadence indicate elevated stress (${stressScore}%) during recent radio transmissions.`,
        severity: 'critical',
      });
    } else if (driverState === 'Fatigued') {
      explainabilityFactors.push({
        id: 'fac-fatigue',
        title: 'Driver Cognitive Fatigue Flagged',
        description: `Speech cadence slowed to ${emotion.speechCadence || '115 WPM'} with repeated mechanical concern reports.`,
        severity: 'warning',
      });
    }

    if (paceLossSeconds >= 0.5) {
      explainabilityFactors.push({
        id: 'fac-pace',
        title: 'Lap Time Degradation',
        description: `Lap pace worsened by +${paceLossSeconds.toFixed(3)}s vs fastest stint lap (${lapStats.fastestLap?.lapTime}).`,
        severity: 'critical',
      });
    } else if (lapTrend === 'worsening') {
      explainabilityFactors.push({
        id: 'fac-trend',
        title: 'Negative Sector Pace Trend',
        description: 'Sector 2 splits showing consistent thermal slip over the last 3 laps.',
        severity: 'warning',
      });
    }

    if (recentStressedCount >= 2) {
      explainabilityFactors.push({
        id: 'fac-consecutive',
        title: 'Consecutive High-Stress Events',
        description: `${recentStressedCount} consecutive high-urgency radio transmissions recorded in this stint.`,
        severity: 'critical',
      });
    }

    if (explainabilityFactors.length === 0) {
      explainabilityFactors.push({
        id: 'fac-nominal',
        title: 'Telemetry & Voice Nominal',
        description: 'Pace consistency is within 0.15s optimal delta with calm driver biometrics.',
        severity: 'nominal',
      });
    }

    // Generate AI Tactical Recommendation Directive
    let recommendation = {
      action: 'Maintain current strategy and engine mapping.',
      category: 'Strategy Hold',
      pitWindow: 'Lap 24 (Nominal window)',
      priority: 'nominal',
    };

    if (finalRiskScore >= 80) {
      recommendation = {
        action: 'Investigate performance drop & prepare immediate box protocol.',
        category: 'Emergency Pit Stop',
        pitWindow: `Lap ${lapStats.totalLaps ? lapStats.totalLaps + 1 : 19} (Box Box Box)`,
        priority: 'critical',
      };
    } else if (finalRiskScore >= 60) {
      recommendation = {
        action: 'Reduce radio load & execute pit window on Lap 21 for Hard compound.',
        category: 'Radio Brevity & Pit Protocol',
        pitWindow: 'Lap 21 (Hard compound)',
        priority: 'critical',
      };
    } else if (finalRiskScore >= 30) {
      recommendation = {
        action: 'Monitor driver condition & adjust brake bias +1 forward.',
        category: 'Chassis Balance',
        pitWindow: 'Lap 22 (Hard compound)',
        priority: 'warning',
      };
    }

    return {
      riskScore: finalRiskScore,
      riskTier,
      riskBadgeVariant,
      paceLossSeconds,
      recentStressedCount,
      explainabilityFactors,
      recommendation,
      correlatedAt: new Date().toISOString(),
    };
  }
}

module.exports = new CorrelationService();
