const envConfig = require('../config/env.config');
const logger = require('../utils/logger.util');

/**
 * Hugging Face Inference API Client
 * Manages authentication, timeout control, request dispatch, and response parsing
 */
class HuggingFaceClient {
  constructor() {
    this.primaryBaseUrl = 'https://router.huggingface.co/hf-inference/models';
    this.fallbackBaseUrl = 'https://api-inference.huggingface.co/models';
  }

  /**
   * Check if Hugging Face API key is configured
   */
  hasApiKey() {
    return Boolean(envConfig.hfApiKey && envConfig.hfApiKey.trim().length > 0);
  }

  /**
   * Query an Audio Inference Model (e.g., Whisper Speech-to-Text)
   * @param {string} modelId - Hugging Face model identifier (e.g., 'openai/whisper-large-v3')
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

    const url = `${this.primaryBaseUrl}/${modelId}`;
    logger.info(`[HuggingFace] Dispatching audio STT inference to ${modelId} (${Math.round(audioBuffer.length / 1024)} KB)...`);

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${envConfig.hfApiKey}`,
          'Content-Type': 'application/octet-stream',
        },
        body: audioBuffer,
        signal: AbortSignal.timeout(envConfig.hfRequestTimeoutMs),
      });

      return await this.handleApiResponse(response, modelId);
    } catch (error) {
      if (error.name === 'TimeoutError' || error.name === 'AbortError') {
        const timeoutErr = new Error(`Hugging Face inference request timed out after ${envConfig.hfRequestTimeoutMs / 1000}s`);
        timeoutErr.code = 'INFERENCE_TIMEOUT';
        throw timeoutErr;
      }
      throw error;
    }
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

    const url = `${this.primaryBaseUrl}/${modelId}`;
    logger.info(`[HuggingFace] Dispatching text emotion classification to ${modelId}...`);

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${envConfig.hfApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ inputs: textInput }),
        signal: AbortSignal.timeout(envConfig.hfRequestTimeoutMs),
      });

      return await this.handleApiResponse(response, modelId);
    } catch (error) {
      if (error.name === 'TimeoutError' || error.name === 'AbortError') {
        const timeoutErr = new Error(`Hugging Face inference request timed out after ${envConfig.hfRequestTimeoutMs / 1000}s`);
        timeoutErr.code = 'INFERENCE_TIMEOUT';
        throw timeoutErr;
      }
      throw error;
    }
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
        errorMessage = errorJson.error;
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
