-- AlterTable
ALTER TABLE "CoverLetter" ADD COLUMN     "tagsOrder" TEXT[] DEFAULT ARRAY[]::TEXT[];

-- CreateTable
CREATE TABLE "_CoverLetterToTag" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_CoverLetterToTag_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_CoverLetterToTag_B_index" ON "_CoverLetterToTag"("B");

-- AddForeignKey
ALTER TABLE "_CoverLetterToTag" ADD CONSTRAINT "_CoverLetterToTag_A_fkey" FOREIGN KEY ("A") REFERENCES "CoverLetter"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CoverLetterToTag" ADD CONSTRAINT "_CoverLetterToTag_B_fkey" FOREIGN KEY ("B") REFERENCES "Tag"("id") ON DELETE CASCADE ON UPDATE CASCADE;
