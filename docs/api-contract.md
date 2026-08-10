# ApexRadio AI - API Contract Specification

## Standard Response Format

All REST responses adhere to the following JSON envelope format:

### Success Response
```json
{
  "success": true,
  "data": { ... },
  "message": "Optional human-readable message",
  "timestamp": "2026-08-10T22:00:00.000Z"
}
```

### Error Response
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Descriptive error message",
    "details": null
  },
  "timestamp": "2026-08-10T22:00:00.000Z"
}
```

---

## Implemented Endpoints

### 1. Health Check
Checks backend operational status and environment diagnostics.

- **URL**: `/api/health`
- **Method**: `GET`
- **Auth Required**: No

#### Response: `200 OK`
```json
{
  "success": true,
  "data": {
    "service": "apexradio-ai-backend",
    "status": "healthy",
    "uptime": 12.345,
    "timestamp": "2026-08-10T22:00:00.000Z",
    "environment": "development",
    "version": "1.0.0"
  },
  "message": "System healthy"
}
```

---

## Planned Endpoints (Future Phases)

### 2. Radio Transcripts
Retrieve or submit team radio audio and transcripts.

- **`GET /api/transcripts`**
  - Query params: `driverId`, `lapNumber`, `minStressLevel`
- **`POST /api/transcripts`**
  - Body: `{ driverId, lapNumber, timestamp, text, audioUrl }`

### 3. Stress & Sentiment Analysis
Fetch stress metrics and acoustic scores for a radio transmission.

- **`GET /api/analysis/stress/:transmissionId`**
- **`POST /api/analysis/evaluate`**
  - Body: `{ audioBuffer | text, driverId }`
  - Response: `{ stressScore: 78, urgency: "HIGH", sentiment: "FRUSTRATED", keyPhrases: ["tires are gone", "snapping in turn 4"] }`

### 4. Telemetry Stream & Correlation
Fetch lap telemetry aligned with audio events.

- **`GET /api/telemetry/lap/:lapNumber`**
- **`GET /api/telemetry/correlation/:driverId`**

### 5. Pit Wall Strategy Support
Fetch AI-generated recommendations for pit window, mode adjustments, and communication brevity.

- **`GET /api/strategy/recommendations`**
- **`POST /api/strategy/action-ack`**
