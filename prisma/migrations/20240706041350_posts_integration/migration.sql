-- CreateTable
CREATE TABLE "Posts" (
    "postID" TEXT NOT NULL,
    "contentID" INTEGER NOT NULL,
    "description" TEXT NOT NULL,
    "authorID" TEXT NOT NULL,

    CONSTRAINT "Posts_pkey" PRIMARY KEY ("postID")
);

-- AddForeignKey
ALTER TABLE "Posts" ADD CONSTRAINT "Posts_authorID_fkey" FOREIGN KEY ("authorID") REFERENCES "User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;
