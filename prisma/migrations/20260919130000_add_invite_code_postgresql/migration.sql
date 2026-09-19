ALTER TABLE "Wedding" ADD COLUMN "inviteCode" TEXT;

UPDATE "Wedding"
SET "inviteCode" = gen_random_uuid()::text
WHERE "inviteCode" IS NULL;

ALTER TABLE "Wedding" ALTER COLUMN "inviteCode" SET NOT NULL;

CREATE UNIQUE INDEX "Wedding_inviteCode_key" ON "Wedding"("inviteCode");