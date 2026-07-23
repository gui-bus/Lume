-- AlterTable
ALTER TABLE "Resume" ADD COLUMN     "expiresAt" TIMESTAMP(3),
ADD COLUMN     "maxViews" INTEGER,
ADD COLUMN     "passwordHash" TEXT,
ADD COLUMN     "sectionsOrder" TEXT[] DEFAULT ARRAY['summary', 'experiences', 'educations', 'skills', 'projects', 'languages', 'certifications', 'volunteering', 'courses']::TEXT[],
ADD COLUMN     "showQrCode" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "tagsOrder" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "templateId" TEXT NOT NULL DEFAULT 'modern';

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "onboarded" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "ShareEvent" (
    "id" TEXT NOT NULL,
    "resumeId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userAgent" TEXT,
    "referer" TEXT,

    CONSTRAINT "ShareEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Tag" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "color" TEXT NOT NULL DEFAULT '#3b82f6',
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Tag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_ResumeToTag" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_ResumeToTag_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "ShareEvent_resumeId_createdAt_idx" ON "ShareEvent"("resumeId", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "Tag_userId_name_key" ON "Tag"("userId", "name");

-- CreateIndex
CREATE INDEX "_ResumeToTag_B_index" ON "_ResumeToTag"("B");

-- AddForeignKey
ALTER TABLE "ShareEvent" ADD CONSTRAINT "ShareEvent_resumeId_fkey" FOREIGN KEY ("resumeId") REFERENCES "Resume"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Tag" ADD CONSTRAINT "Tag_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ResumeToTag" ADD CONSTRAINT "_ResumeToTag_A_fkey" FOREIGN KEY ("A") REFERENCES "Resume"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ResumeToTag" ADD CONSTRAINT "_ResumeToTag_B_fkey" FOREIGN KEY ("B") REFERENCES "Tag"("id") ON DELETE CASCADE ON UPDATE CASCADE;
