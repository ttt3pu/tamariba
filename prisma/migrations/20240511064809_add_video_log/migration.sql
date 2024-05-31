-- CreateEnum
CREATE TYPE "VideoPlatform" AS ENUM ('nico', 'youtube');

-- CreateTable
CREATE TABLE "VideoLog" (
    "id" SERIAL NOT NULL,
    "user_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "video_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "platform" "VideoPlatform" NOT NULL,

    CONSTRAINT "VideoLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "VideoLog_user_id_idx" ON "VideoLog"("user_id");
