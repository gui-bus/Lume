-- CreateTable
CREATE TABLE "CoverLetter" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "senderName" TEXT NOT NULL,
    "senderEmail" TEXT NOT NULL,
    "senderPhone" TEXT,
    "senderLocation" TEXT,
    "senderLinkedin" TEXT,
    "senderGithub" TEXT,
    "recipientName" TEXT,
    "recipientCompany" TEXT,
    "recipientTitle" TEXT,
    "recipientAddress" TEXT,
    "date" TEXT,
    "subject" TEXT,
    "content" TEXT NOT NULL,
    "colorTheme" TEXT NOT NULL DEFAULT '#18181b',
    "templateId" TEXT NOT NULL DEFAULT 'modern',
    "locale" TEXT NOT NULL DEFAULT 'pt',
    "groupId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CoverLetter_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "CoverLetter_userId_idx" ON "CoverLetter"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "CoverLetter_groupId_locale_key" ON "CoverLetter"("groupId", "locale");

-- AddForeignKey
ALTER TABLE "CoverLetter" ADD CONSTRAINT "CoverLetter_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
