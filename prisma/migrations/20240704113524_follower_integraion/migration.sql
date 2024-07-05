-- CreateTable
CREATE TABLE "Follows" (
    "userID" TEXT NOT NULL,
    "targetUserID" TEXT NOT NULL,

    CONSTRAINT "Follows_pkey" PRIMARY KEY ("userID","targetUserID")
);

-- CreateIndex
CREATE INDEX "by_userid" ON "Follows"("userID");

-- AddForeignKey
ALTER TABLE "Follows" ADD CONSTRAINT "Follows_userID_fkey" FOREIGN KEY ("userID") REFERENCES "User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Follows" ADD CONSTRAINT "Follows_targetUserID_fkey" FOREIGN KEY ("targetUserID") REFERENCES "User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;
