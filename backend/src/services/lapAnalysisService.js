const fs = require('fs');
const logger = require('../utils/logger.util');

/**
 * Convert "M:SS.mmm" or "SS.mmm" time string to seconds
 * @param {string} timeStr - e.g. "1:29.420" or "89.420"
 * @returns {number}
 */
const timeStrToSeconds = (timeStr) => {
  if (!timeStr) return 0;
  const str = String(timeStr).trim().replace('s', '');
  if (str.includes(':')) {
    const parts = str.split(':');
    const minutes = parseFloat(parts[0]) || 0;
    const seconds = parseFloat(parts[1]) || 0;
    return Math.round((minutes * 60 + seconds) * 1000) / 1000;
  }
  return Math.round(parseFloat(str) * 1000) / 1000 || 0;
};

/**
 * Convert seconds to "M:SS.mmm" string
 * @param {number} seconds - e.g. 89.420
 * @returns {string} - e.g. "1:29.420"
 */
const secondsToTimeStr = (seconds) => {
  if (!seconds || isNaN(seconds)) return '0:00.000';
  const mins = Math.floor(seconds / 60);
  const secs = (seconds % 60).toFixed(3);
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
};

class LapAnalysisService {
  /**
   * Parse CSV content into structured lap array
   * @param {string|Buffer} csvContent - CSV string or buffer
   * @returns {Array<Object>}
   */
  parseCsv(csvContent) {
    const rawText = Buffer.isBuffer(csvContent) ? csvContent.toString('utf-8') : String(csvContent);
    const lines = rawText.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);

    if (lines.length < 2) {
      throw new Error('CSV must contain a header and at least one lap data row.');
    }

    const header = lines[0].split(',').map((h) => h.trim().toLowerCase());
    const lapIndex = header.findIndex((h) => h.includes('lap') && !h.includes('time'));
    const timeIndex = header.findIndex((h) => h.includes('time') || h === 'laptime');
    const s1Index = header.findIndex((h) => h === 's1' || h.includes('sector1') || h.includes('sector 1'));
    const s2Index = header.findIndex((h) => h === 's2' || h.includes('sector2') || h.includes('sector 2'));
    const s3Index = header.findIndex((h) => h === 's3' || h.includes('sector3') || h.includes('sector 3'));
    const speedIndex = header.findIndex((h) => h.includes('speed') || h.includes('topspeed') || h.includes('trap'));
    const degIndex = header.findIndex((h) => h.includes('deg') || h.includes('tire') || h.includes('tyre'));
    const stressEventIndex = header.findIndex((h) => h.includes('stress') || h.includes('event') || h.includes('note'));

    const laps = [];

    for (let i = 1; i < lines.length; i++) {
      const row = lines[i].split(',').map((col) => col.trim());
      if (row.length === 0 || !row[0]) continue;

      const lapNumber = lapIndex !== -1 ? parseInt(row[lapIndex], 10) || i : i;
      const rawTime = timeIndex !== -1 ? row[timeIndex] : row[1] || '1:30.000';
      const lapTimeSec = timeStrToSeconds(rawTime);

      if (lapTimeSec <= 0) continue;

      const s1 = s1Index !== -1 ? row[s1Index] : '28.150';
      const s2 = s2Index !== -1 ? row[s2Index] : '34.300';
      const s3 = s3Index !== -1 ? row[s3Index] : '27.150';
      const topSpeed = speedIndex !== -1 ? parseFloat(row[speedIndex]) || 326.0 : 326.0;
      const tireDeg = degIndex !== -1 ? parseFloat(row[degIndex]) || Math.round(i * 2.2 * 10) / 10 : 20.0;
      const stressEvent = stressEventIndex !== -1 ? row[stressEventIndex] || '' : '';

      laps.push({
        lap: lapNumber,
        lapTime: rawTime.includes(':') ? rawTime : secondsToTimeStr(lapTimeSec),
        lapTimeSec,
        s1: String(s1).endsWith('s') ? s1 : `${s1}s`,
        s2: String(s2).endsWith('s') ? s2 : `${s2}s`,
        s3: String(s3).endsWith('s') ? s3 : `${s3}s`,
        s1Sec: timeStrToSeconds(s1),
        s2Sec: timeStrToSeconds(s2),
        s3Sec: timeStrToSeconds(s3),
        topSpeed: `${topSpeed} km/h`,
        topSpeedNum: topSpeed,
        tireDeg: `${tireDeg}%`,
        tireDegNum: tireDeg,
        stressEvent,
      });
    }

    if (laps.length === 0) {
      throw new Error('No valid lap rows could be parsed from the provided CSV file.');
    }

    return laps;
  }

  /**
   * Analyze parsed laps and calculate statistics & trend
   * @param {Array<Object>} laps - Parsed lap objects
   * @returns {Object}
   */
  analyzeLaps(laps) {
    if (!laps || laps.length === 0) {
      throw new Error('No laps provided for analysis.');
    }

    // Exclude Lap 1 (standing start / outlap outlier) for pure pace calculations if > 3 laps
    const paceLaps = laps.length > 3 ? laps.slice(1) : laps;

    let fastest = paceLaps[0];
    let slowest = paceLaps[0];
    let totalSec = 0;
    let s1Total = 0;
    let s2Total = 0;
    let s3Total = 0;

    paceLaps.forEach((lap) => {
      totalSec += lap.lapTimeSec;
      s1Total += lap.s1Sec;
      s2Total += lap.s2Sec;
      s3Total += lap.s3Sec;

      if (lap.lapTimeSec < fastest.lapTimeSec) fastest = lap;
      if (lap.lapTimeSec > slowest.lapTimeSec) slowest = lap;
    });

    const avgSec = totalSec / paceLaps.length;
    const avgLapTime = secondsToTimeStr(avgSec);

    // Calculate Last 5-Lap Average
    const lastFiveLaps = laps.slice(-5);
    const lastFiveTotal = lastFiveLaps.reduce((acc, curr) => acc + curr.lapTimeSec, 0);
    const lastFiveAvgSec = lastFiveTotal / lastFiveLaps.length;
    const lastFiveAvgTime = secondsToTimeStr(lastFiveAvgSec);

    // Determine Lap Trend (Compare last 3 laps avg with overall stint pace avg)
    const lastThreeLaps = laps.slice(-3);
    const lastThreeAvg = lastThreeLaps.reduce((a, c) => a + c.lapTimeSec, 0) / lastThreeLaps.length;
    const paceDelta = Math.round((lastThreeAvg - avgSec) * 1000) / 1000;

    let lapTrend = 'stable';
    if (paceDelta > 0.45) {
      lapTrend = 'worsening'; // degraded by > 0.45s
    } else if (paceDelta < -0.30) {
      lapTrend = 'improving'; // faster by > 0.30s
    }

    // Generate 5-Lap Moving Average for Recharts Chart
    const chartData = laps.map((lap, idx) => {
      const windowStart = Math.max(0, idx - 4);
      const windowLaps = laps.slice(windowStart, idx + 1);
      const movingAvg = windowLaps.reduce((acc, curr) => acc + curr.lapTimeSec, 0) / windowLaps.length;

      return {
        lap: lap.lap,
        lapTimeSec: lap.lapTimeSec,
        lapTime: lap.lapTime,
        movingAvgSec: Math.round(movingAvg * 1000) / 1000,
        movingAvg: secondsToTimeStr(movingAvg),
        s1Sec: lap.s1Sec,
        s2Sec: lap.s2Sec,
        s3Sec: lap.s3Sec,
        tireDegNum: lap.tireDegNum,
        stressEvent: lap.stressEvent,
        isFastest: lap.lap === fastest.lap,
        deltaToBestSec: Math.round((lap.lapTimeSec - fastest.lapTimeSec) * 1000) / 1000,
      };
    });

    return {
      totalLaps: laps.length,
      fastestLap: {
        lap: fastest.lap,
        lapTime: fastest.lapTime,
        lapTimeSec: fastest.lapTimeSec,
        s1: fastest.s1,
        s2: fastest.s2,
        s3: fastest.s3,
      },
      slowestLap: {
        lap: slowest.lap,
        lapTime: slowest.lapTime,
        lapTimeSec: slowest.lapTimeSec,
      },
      averageLapTime: avgLapTime,
      averageLapSec: Math.round(avgSec * 1000) / 1000,
      lastFiveAvgTime,
      lastFiveAvgSec: Math.round(lastFiveAvgSec * 1000) / 1000,
      lapTrend, // 'improving' | 'stable' | 'worsening'
      paceDeltaVsAvg: paceDelta > 0 ? `+${paceDelta.toFixed(3)}s` : `${paceDelta.toFixed(3)}s`,
      sectorAverages: {
        s1: `${(s1Total / paceLaps.length).toFixed(3)}s`,
        s2: `${(s2Total / paceLaps.length).toFixed(3)}s`,
        s3: `${(s3Total / paceLaps.length).toFixed(3)}s`,
      },
      laps,
      chartData,
    };
  }
}

module.exports = new LapAnalysisService();
