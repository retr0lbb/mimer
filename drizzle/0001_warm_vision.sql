CREATE TYPE "public"."handler_type" AS ENUM('internal', 'http');--> statement-breakpoint
CREATE TABLE "tools" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"name" text NOT NULL,
	"description" text NOT NULL,
	"schema" jsonb NOT NULL,
	"handler_type" "handler_type" NOT NULL,
	"config" jsonb,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp,
	CONSTRAINT "tools_name_unique" UNIQUE("name")
);
--> statement-breakpoint
ALTER TABLE "tools" ADD CONSTRAINT "tools_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE no action ON UPDATE no action;