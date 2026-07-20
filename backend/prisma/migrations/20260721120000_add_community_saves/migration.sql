CREATE TABLE "community_saves" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "post_id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "community_saves_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "community_saves_post_id_user_id_key" ON "community_saves"("post_id", "user_id");
CREATE INDEX "community_saves_user_id_created_at_idx" ON "community_saves"("user_id", "created_at");

ALTER TABLE "community_saves" ADD CONSTRAINT "community_saves_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "community_posts"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "community_saves" ADD CONSTRAINT "community_saves_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
