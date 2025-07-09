# 📋 API Documentation

## 🔗 Endpoints

### Airtable Integration

#### GET User Data
**Endpoint:** `https://api.airtable.com/v0/{BASE_ID}/Nomina%20Sirius`
**Method:** GET
**Headers:**
```http
Authorization: Bearer {AIRTABLE_API_KEY}
```
**Query Parameters:**
```
filterByFormula=({Cedula}='{cedula}')
```

**Response Format:**
```json
{
  "records": [
    {
      "id": "recXXXXXXXXXXXXXX",
      "fields": {
        "Cedula": "12345678",
        "Nombre": "Juan Pérez",
        "Cargo": "Desarrollador",
        "Area": "Tecnología"
      },
      "createdTime": "2025-01-01T00:00:00.000Z"
    }
  ]
}
```

### Webhook Endpoints

#### 1. Workday Control Webhook
**Endpoint:** `https://telegram-apps-u38879.vm.elestio.app/webhook/3fcd24f4-e01c-4fd7-80a1-aeaa5ac352ad`
**Method:** POST
**Content-Type:** `application/json`

**Request Body:**
```json
{
  "cedula": "string",
  "startTime": "string",
  "lunchStart": "string|null",
  "lunchEnd": "string|null", 
  "endTime": "string"
}
```

**Example:**
```json
{
  "cedula": "12345678",
  "startTime": "08:00:00",
  "lunchStart": "12:00:00",
  "lunchEnd": "13:00:00",
  "endTime": "17:00:00"
}
```

#### 2. Extra Mile Webhook
**Endpoint:** `https://telegram-apps-u38879.vm.elestio.app/webhook-test/cd26a91d-11e4-4627-b63e-df678914d387`
**Method:** POST
**Content-Type:** `application/json`

**Request Body:**
```json
{
  "cedula": "string",
  "audioData": "string", // Base64 encoded audio
  "type": "string",
  "timestamp": "string" // ISO 8601 format
}
```

**Example:**
```json
{
  "cedula": "12345678",
  "audioData": "data:audio/webm;base64,GkXfo59ChoEBQveBAULygQRC84EIQoKEd2VibUKHgQRChYECGFOAZwEAAAAAAAHTEU2bdLpNu4tTq4QVSalmU6yBoU27i1OrhBZUrmtTrIHGTbuMU6uEElTDZ1OsggEXTbuMU6uEHFO7a1OsggG97AEAAAAAAABZAEAAAAAAAF9nU6uEAgAY10xjdpAKIQXmU6uECBNOw00LBRjTrIEAAAAAAAAAADbMYWGhU6bdu4tQl4QfWWAVjmwWrJNOyEAACBYxn8qPf...",
  "type": "extra_mile",
  "timestamp": "2025-07-09T15:30:00.000Z"
}
```

## 🔧 Error Codes

### Airtable API Errors

| Code | Description | Solution |
|------|-------------|----------|
| 401 | Unauthorized | Verify AIRTABLE_API_KEY |
| 404 | Base not found | Verify AIRTABLE_BASE_ID |
| 422 | Invalid request | Check table name and field names |

### Webhook Errors

| Code | Description | Action |
|------|-------------|--------|
| 400 | Bad Request | Verify request body format |
| 500 | Server Error | Retry request, check server logs |
| 503 | Service Unavailable | Check webhook endpoint status |

## 🔒 Security

### API Key Management
- Never expose API keys in client-side code
- Use environment variables for sensitive data
- Rotate API keys regularly
- Monitor API usage for anomalies

### Data Validation
- Validate all input data before sending
- Sanitize audio data before processing
- Implement rate limiting for webhook calls
- Log all API interactions for audit
