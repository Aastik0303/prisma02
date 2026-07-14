CREATE TABLE "community_likes" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(),
  "post_id" UUID NOT NULL,
  "user_id" UUID NOT NULL,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "community_likes_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "community_comments" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(),
  "post_id" UUID NOT NULL,
  "author_id" UUID NOT NULL,
  "content" TEXT NOT NULL,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "community_comments_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "community_likes_post_id_user_id_key" ON "community_likes"("post_id", "user_id");
CREATE INDEX "community_likes_user_id_created_at_idx" ON "community_likes"("user_id", "created_at");
CREATE INDEX "community_comments_post_id_created_at_idx" ON "community_comments"("post_id", "created_at");
CREATE INDEX "community_comments_author_id_created_at_idx" ON "community_comments"("author_id", "created_at");
ALTER TABLE "community_likes" ADD CONSTRAINT "community_likes_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "community_posts"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "community_likes" ADD CONSTRAINT "community_likes_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "community_comments" ADD CONSTRAINT "community_comments_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "community_posts"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "community_comments" ADD CONSTRAINT "community_comments_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
