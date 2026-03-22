import type { tenants } from "../db/schemas/tenant.ts";

export type Tenant = typeof tenants.$inferSelect;
