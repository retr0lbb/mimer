# WAHA Webhook Integration

## Objective
Enable webhook integration with WAHA (WhatsApp HTTP API). The webhook receives incoming WhatsApp messages, processes them through the conversation engine, and sends AI responses back via WAHA API.

---

## Tech Stack
- **Runtime**: Node.js with TypeScript
- **Framework**: Fastify
- **Logging**: Pino.js (existing at `@src/utils/logger.ts`)
- **WhatsApp API**: [WAHA - WhatsApp HTTP API](https://waha.devlike.pro/)

---

## Implementation Summary

### Files Created/Modified
- `src/modules/webhooks/wa-ha.ts` - Main webhook implementation
- `src/server.ts` - Registered webhook routes
- `src/config/env.ts` - Added WAHA environment variables
- `docker-compose.yaml` - Added WAHA service

### Environment Variables
```env
WAHA_URL=http://localhost:3000        # Optional, defaults to localhost:3000
WAHA_API_KEY=your-api-key            # Optional for local development
```

### API Endpoint
- **Route**: `POST /webhooks/wa-ha`
- **Authentication**: None (currently open, see Future Work)
- **Request Body**: WAHA webhook payload format

### Request Payload (WAHA Format)
```json
{
  "id": "evt_...",
  "timestamp": 1741249702485,
  "event": "message",
  "session": "default",
  "me": { "id": "71111111111@c.us", "pushName": "~" },
  "payload": {
    "id": "true_12132132130@c.us_AAAA",
    "from": "12132132130@c.us",
    "body": "Hello!",
    "hasMedia": false,
    "fromMe": false
  }
}
```

### Response Format
```json
{ "status": "ok" }
{ "status": "ignored" }
{ "status": "error", "message": "..." }
```

### Flow
1. WAHA sends webhook to `/webhooks/wa-ha`
2. Validate payload is a message event
3. Ignore messages from self (`fromMe: true`)
4. Call `ConversationService.handleMessageIncoming()` with:
   - `text`: Message body
   - `tenantId`: `waha-default-tenant`
   - `userIdentifier`: Sender phone number
   - `channel`: `wa-ha`
5. Send AI response back via WAHA `/api/sendText`
6. Log all operations with Pino

---

## Future Work

### API Key Authentication
- Add header validation (`X-Api-Key`) in webhook handler
- Return 401 for invalid/missing keys

### WAHA Configuration for Webhook
Configure WAHA to send webhooks to your endpoint:
```bash
# Via environment
WHATSAPP_HOOK_URL=https://your-server.com/webhooks/wa-ha
WHATSAPP_HOOK_EVENTS=message
```

### Multi-Session Support
- Support multiple WAHA sessions per tenant
- Map sessions to tenants dynamically

---

## Testing
- Unit tests: Mock `ConversationService`, test payload parsing
- Integration tests: Full flow with WAHA

---

## Deliverables
- [x] `src/modules/webhooks/wa-ha.ts` - Webhook implementation
- [x] `src/server.ts` - Route registration
- [x] `docker-compose.yaml` - WAHA service
- [x] Environment variables in `src/config/env.ts`
- [x] API specification in `specs/webhooks-wa-ha.md`
