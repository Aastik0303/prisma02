CREATE TABLE IF NOT EXISTS "resumes" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "user_id" UUID NOT NULL,
  "title" VARCHAR(160) NOT NULL,
  "raw_extracted_text" TEXT NOT NULL,
  "parsed_json_data" JSONB NOT NULL,
  "template_config" JSONB NOT NULL,
  "created_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
  "updated_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT "resumes_user_id_fkey"
    FOREIGN KEY ("user_id")
    REFERENCES "users"("id")
    ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS "resumes_user_id_updated_at_idx"
  ON "resumes"("user_id", "updated_at");
