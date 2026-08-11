const envConfig = require('../config/env.config');
const logger = require('../utils/logger.util');

/**
 * Hugging Face Inference API Client
 * Manages authentication, timeout control, request dispatch, and response parsing
 */
class HuggingFaceClient {
  constructor() {
    // Primary standard Serverless Inference API endpoint (works with standard Read tokens)
    this.primaryBaseUrl = 'https://api-inference.huggingface.co/models';
    // Fallback provider router endpoint
    this.fallbackBaseUrl = 'https://router.huggingface.co/hf-inference/models';
  }

  /**
   * Check if Hugging Face API key is configured
   */
  hasApiKey() {
    return Boolean(envConfig.hfApiKey && envConfig.hfApiKey.trim().length > 0);
  }

  /**
   * Safely calculate request timeout in milliseconds
   */
  getTimeoutMs() {
    const timeout = Number(envConfig.hfRequestTimeoutMs);
    return !isNaN(timeout) && timeout > 0 ? timeout : 12000;
  }

  /**
   * Internal helper to dispatch inference requests with primary -> fallback URL support
   */
  async sendInferenceRequest(modelId, body, contentType) {
    const urls = [
      `${this.primaryBaseUrl}/${modelId}`,
      `${this.fallbackBaseUrl}/${modelId}`,
    ];

    const timeoutMs = this.getTimeoutMs();
    let lastError = null;

    for (let i = 0; i < urls.length; i++) {
      const url = urls[i];
      const isFallback = i > 0;

      try {
        if (isFallback) {
          logger.info(`[HuggingFace] Retrying model ${modelId} using fallback endpoint...`);
        }

        const response = await fetch(url, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${envConfig.hfApiKey.trim()}`,
            'Content-Type': contentType,
          },
          body,
          signal: AbortSignal.timeout(timeoutMs),
        });

        return await this.handleApiResponse(response, modelId);
      } catch (error) {
        lastError = error;

        if (error.name === 'TimeoutError' || error.name === 'AbortError') {
          const timeoutErr = new Error(
            `Hugging Face inference request timed out after ${timeoutMs / 1000}s`
          );
          timeoutErr.code = 'INFERENCE_TIMEOUT';
          throw timeoutErr;
        }

        // If invalid API key, fallback won't help, throw immediately
        if (error.code === 'INVALID_API_KEY') {
          throw error;
        }

        if (!isFallback) {
          logger.warn(`[HuggingFace] Primary endpoint failed (${error.message}). Attempting fallback endpoint...`);
        }
      }
    }

    throw lastError;
  }

  /**
   * Query an Audio Inference Model (e.g., Whisper Speech-to-Text)
   * @param {string} modelId - Hugging Face model identifier (e.g., 'openai/whisper-small')
   * @param {Buffer} audioBuffer - Raw audio file buffer
   * @returns {Promise<Object>}
   */
  async queryAudioModel(modelId, audioBuffer) {
    if (!this.hasApiKey()) {
      const err = new Error('HUGGINGFACE_API_KEY is not configured in backend environment.');
      err.code = 'MISSING_API_KEY';
      throw err;
    }

    if (!audioBuffer || audioBuffer.length === 0) {
      const err = new Error('Audio buffer is empty or invalid.');
      err.code = 'INVALID_AUDIO_BUFFER';
      throw err;
    }

    logger.info(`[HuggingFace] Dispatching audio STT inference to ${modelId} (${Math.round(audioBuffer.length / 1024)} KB)...`);

    return await this.sendInferenceRequest(modelId, audioBuffer, 'application/octet-stream');
  }

  /**
   * Query a Text Classification Model (e.g., Emotion / Sentiment)
   * @param {string} modelId - Hugging Face model identifier (e.g., 'j-hartmann/emotion-english-distilroberta-base')
   * @param {string} textInput - Text to classify
   * @returns {Promise<Array<{ label: string, score: number }>>}
   */
  async queryTextModel(modelId, textInput) {
    if (!this.hasApiKey()) {
      const err = new Error('HUGGINGFACE_API_KEY is not configured in backend environment.');
      err.code = 'MISSING_API_KEY';
      throw err;
    }

    if (!textInput || !textInput.trim()) {
      const err = new Error('Text input is empty for emotion classification.');
      err.code = 'EMPTY_TEXT_INPUT';
      throw err;
    }

    logger.info(`[HuggingFace] Dispatching text emotion classification to ${modelId}...`);

    return await this.sendInferenceRequest(modelId, JSON.stringify({ inputs: textInput }), 'application/json');
  }

  /**
   * Handle HTTP response from Hugging Face
   */
  async handleApiResponse(response, modelId) {
    if (response.ok) {
      const data = await response.json();
      return data;
    }

    let errorMessage = `Hugging Face API error (${response.status}): ${response.statusText}`;
    let errorCode = 'HF_API_ERROR';
    let errorDetails = null;

    try {
      const errorJson = await response.json();
      errorDetails = errorJson;

      if (errorJson.error) {
        errorMessage = Array.isArray(errorJson.error) ? errorJson.error.join(', ') : errorJson.error;
      }

      if (response.status === 401) {
        errorCode = 'INVALID_API_KEY';
        errorMessage = 'Invalid Hugging Face API key or unauthorized token.';
      } else if (response.status === 503) {
        errorCode = 'MODEL_LOADING';
        errorMessage = `Model ${modelId} is currently loading in Hugging Face. ${errorJson.estimated_time ? `Estimated time: ${Math.round(errorJson.estimated_time)}s` : ''}`;
      } else if (response.status === 429) {
        errorCode = 'RATE_LIMITED';
        errorMessage = 'Hugging Face API rate limit reached. Please retry shortly.';
      }
    } catch {
      // response wasn't JSON
    }

    const error = new Error(errorMessage);
    error.statusCode = response.status;
    error.code = errorCode;
    error.details = errorDetails;
    throw error;
  }
}

module.exports = new HuggingFaceClient();