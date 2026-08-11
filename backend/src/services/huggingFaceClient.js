const envConfig = require('../config/env.config');
const logger = require('../utils/logger.util');

/**
 * Hugging Face Inference API Client
 * Manages direct audio buffer & text inference requests to Hugging Face models
 */
class HuggingFaceClient {
  constructor() {
    // Standard Hugging Face Router endpoint for serverless model inference
    this.baseUrl = 'https://router.huggingface.co/hf-inference/models';
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
    return !isNaN(timeout) && timeout > 0 ? timeout : 30000;
  }

  /**
   * Send an inference request directly to Hugging Face API
   * @param {string} modelId - Model repository ID (e.g. 'openai/whisper-large-v3')
   * @param {Buffer|string} body - Raw audio buffer or JSON body
   * @param {string} contentType - Content-Type header
   * @returns {Promise<Object>}
   */
  async sendInferenceRequest(modelId, body, contentType) {
    if (!this.hasApiKey()) {
      const err = new Error('HUGGINGFACE_API_KEY is not configured in backend environment.');
      err.code = 'MISSING_API_KEY';
      logger.error(`[HuggingFace] Request failed: ${err.message}`);
      throw err;
    }

    const url = `${this.baseUrl}/${modelId}`;
    const timeoutMs = this.getTimeoutMs();
    const startTime = Date.now();
    const payloadSize = Buffer.isBuffer(body) ? body.length : Buffer.byteLength(body);

    logger.info(`[HuggingFace] >>> Request START | Model: ${modelId} | Size: ${Math.round(payloadSize / 1024)} KB (${payloadSize} bytes) | Content-Type: ${contentType}`);

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${envConfig.hfApiKey.trim()}`,
          'Content-Type': contentType,
        },
        body,
        signal: AbortSignal.timeout(timeoutMs),
      });

      const elapsedMs = Date.now() - startTime;
      logger.info(`[HuggingFace] <<< Request END | Model: ${modelId} | Status: ${response.status} ${response.statusText} | Elapsed: ${elapsedMs}ms`);

      return await this.handleApiResponse(response, modelId, elapsedMs);
    } catch (error) {
      const elapsedMs = Date.now() - startTime;

      if (error.name === 'TimeoutError' || error.name === 'AbortError') {
        const timeoutErr = new Error(
          `Hugging Face inference request timed out after ${timeoutMs / 1000}s (Model: ${modelId})`
        );
        timeoutErr.code = 'INFERENCE_TIMEOUT';
        logger.error(`[HuggingFace] <<< Failure Reason: ${timeoutErr.message} | Elapsed: ${elapsedMs}ms`);
        throw timeoutErr;
      }

      logger.error(`[HuggingFace] <<< Failure Reason: [${error.code || 'ERROR'}] ${error.message} | Elapsed: ${elapsedMs}ms`);
      throw error;
    }
  }

  /**
   * Query an Audio Inference Model (e.g., Whisper Speech-to-Text) with raw audio buffer
   * @param {string} modelId - Hugging Face model identifier (e.g., 'openai/whisper-large-v3')
   * @param {Buffer} audioBuffer - Raw audio file buffer from uploaded file
   * @param {string} [mimeType='audio/wav'] - Audio MIME type
   * @returns {Promise<Object>}
   */
  async queryAudioModel(modelId, audioBuffer, mimeType = 'audio/wav') {
    if (!audioBuffer || !Buffer.isBuffer(audioBuffer) || audioBuffer.length === 0) {
      const err = new Error('Audio buffer is empty or invalid. An uploaded audio recording is required.');
      err.code = 'INVALID_AUDIO_BUFFER';
      logger.error(`[HuggingFace] Audio query failed: ${err.message}`);
      throw err;
    }

    const contentType = mimeType && mimeType.startsWith('audio/') ? mimeType : 'audio/wav';
    return await this.sendInferenceRequest(modelId, audioBuffer, contentType);
  }

  /**
   * Query a Text Classification Model (e.g., Emotion / Sentiment)
   * @param {string} modelId - Hugging Face model identifier
   * @param {string} textInput - Transcribed text
   * @returns {Promise<Array<{ label: string, score: number }>>}
   */
  async queryTextModel(modelId, textInput) {
    if (!textInput || !textInput.trim()) {
      const err = new Error('Text input is empty for emotion classification.');
      err.code = 'EMPTY_TEXT_INPUT';
      throw err;
    }

    return await this.sendInferenceRequest(modelId, JSON.stringify({ inputs: textInput }), 'application/json');
  }

  /**
   * Handle HTTP response from Hugging Face
   */
  async handleApiResponse(response, modelId, elapsedMs) {
    if (response.ok) {
      const data = await response.json();
      return data;
    }

    let errorMessage = `Hugging Face API returned HTTP ${response.status} (${response.statusText})`;
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
      } else if (response.status === 403) {
        errorCode = 'INSUFFICIENT_PERMISSIONS';
        errorMessage = `Hugging Face permission error: ${errorMessage}. Ensure your Hugging Face Access Token has "Make calls to Inference Providers" permission enabled in Account Settings.`;
      } else if (response.status === 503) {
        errorCode = 'MODEL_LOADING';
        errorMessage = `Model ${modelId} is currently loading on Hugging Face. ${errorJson.estimated_time ? `Estimated wait time: ${Math.round(errorJson.estimated_time)}s.` : 'Please retry in a few seconds.'}`;
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
    error.modelId = modelId;
    error.elapsedMs = elapsedMs;

    logger.error(`[HuggingFace] Response Error Status: ${response.status} | Code: ${errorCode} | Reason: ${errorMessage}`);
    throw error;
  }
}

module.exports = new HuggingFaceClient();