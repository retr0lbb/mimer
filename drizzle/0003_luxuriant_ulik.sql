CREATE TYPE "public"."credential_status" AS ENUM('active', 'revoked');--> statement-breakpoint
ALTER TABLE "credentials" ALTER COLUMN "credential_status" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "credentials" ALTER COLUMN "credential_status" SET DATA TYPE "public"."credential_status" USING "credential_status"::text::"public"."credential_status";--> statement-breakpoint
ALTER TABLE "credentials" ALTER COLUMN "credential_status" SET DEFAULT 'active';