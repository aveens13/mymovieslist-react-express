/*
  Warnings:

  - The primary key for the `Movie` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "Movie" DROP CONSTRAINT "Movie_pkey",
ADD CONSTRAINT "Movie_pkey" PRIMARY KEY ("movie_id", "authorId");

-- CreateTable
CREATE TABLE "Show" (
    "show_id" INTEGER NOT NULL,
    "rating" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "authorId" TEXT NOT NULL,

    CONSTRAINT "Show_pkey" PRIMARY KEY ("show_id","authorId")
);

-- AddForeignKey
ALTER TABLE "Show" ADD CONSTRAINT "Show_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;
