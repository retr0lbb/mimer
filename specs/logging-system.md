# Logging System Specification

## Overview
A pino.js-based logging system that creates daily rotating log files in dev mode, logging HTTP requests, database operations, and errors.

## Dependencies
- `pino` (^8.20.0) - Core logging library
- `pino-pretty` (^10.0.0) - Text format output for console
- `pino-roll` (^3.0.0) - Daily log file rotation

## File Structure

```
mimer/
├── logs/                          # Log files directory
│   └── app.YYYY-MM-DD.log        # Daily rotating log files
├── src/
│   ├── utils/
│   │   ├── logger.ts              # Main logger configuration
│   │   └── db-logger.ts          # Database operation logging helpers
│   ├── server.ts                  # HTTP request/response hooks
│   ├── _errors/
│   │   └── handlers.ts            # Error logging
│   └── modules/tenant/
│       └── tenant.repository.ts   # Example: DB logging in repository
└── specs/
    └── logging-system.md          # This file
```

## Configuration

### `src/utils/logger.ts`

**Exports:**
- `logger` - Console logger (pino-pretty in dev, silent in prod)
- `fileLogger` - JSON file logger with daily rotation
- `logToFile(message, meta?)` - Log to both console and file in text format

**Configuration:**
- Log directory: `logs/` (created automatically)
- Log file pattern: `app.YYYY-MM-DD` (daily rotation)
- Max files: 30 days
- Log level: `debug` in dev, `info` in production

### Console Output (Dev Mode)
- Format: Text with colors
- Includes: timestamp, level, message, metadata
- Example:
  ```
  [2026-03-18 00:20:16] INFO: Incoming request: GET /
      method: "GET"
      url: "/"
      query: {}
  ```

### File Output
- Format: JSON (for rotation/compression compatibility)
- Rotation: Daily at midnight
- Retention: 30 days

## Usage

### HTTP Request/Response Logging
Automatically enabled in `src/server.ts` via Fastify hooks:
- `onRequest`: Logs method, URL, query params
- `onResponse`: Logs status code, response time

### Database Logging
Import helpers from `src/utils/db-logger.ts`:

```typescript
import { logDbInsert, logDbUpdate, logDbDelete, logDbSelect } from "../utils/db-logger.ts";

// Log insert
logDbInsert("table_name", { field: "value" });

// Log update
logDbUpdate("table_name", { id: 1 }, { field: "new_value" });

// Log delete
logDbDelete("table_name", { id: 1 });

// Log select
logDbSelect("table_name", resultCount);
```

### Custom Logging
```typescript
import { logToFile } from "../utils/logger.ts";

logToFile("Custom message", { extra: "data" });
```

### Error Logging
Automatically handled in `src/_errors/handlers.ts`:
- Validation errors (ZodError)
- App errors (AppError)
- Unhandled errors (with stack traces)

## Adding DB Logging to New Repositories

1. Import the db-logger helper:
   ```typescript
   import { logDbInsert, logDbSelect, logDbUpdate, logDbDelete } from "../../utils/db-logger.ts";
   ```

2. Add logging calls after each database operation:
   ```typescript
   async create(data: YourDTO): Promise<void> {
       await db.insert(table).values(data);
       logDbInsert("table_name", data);
   }

   async findById(id: string) {
       const result = await db.select().from(table).where(eq(table.id, id));
       logDbSelect("table_name", result.length);
       return result[0];
   }

   async update(id: string, data: Partial<YourDTO>) {
       await db.update(table).set(data).where(eq(table.id, id));
       logDbUpdate("table_name", { id }, data);
   }

   async delete(id: string) {
       await db.delete(table).where(eq(table.id, id));
       logDbDelete("table_name", { id });
   }
   ```

## Environment Variables
- `NODE_ENV` - Set to "production" for prod mode (disables console pretty print)
- `LOG_LEVEL` - Override log level (default: debug in dev, info in prod)

## Future Enhancements
- Add structured logging to file (JSON + text hybrid)
- Add log filtering by log level in file
- Add correlation IDs for request tracing
- Add database query slow-log threshold
