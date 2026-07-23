import { getResume } from "@/app/actions/resumeActions";
import { formatResumeToPlainText } from "@/lib/formatters/plain-text-formatter";
import { checkWordFrequency } from "@/lib/validations/word-frequency-checker";
import { validateATS } from "@/lib/validations/atsValidator";
import { AtsReaderClient } from "@/components/editor/AtsReaderClient";
import { ResumeData } from "@/types/resume";
import { auth } from "@clerk/nextjs/server";
import { redirect, notFound } from "next/navigation";

export default async function AtsReaderPage({
  params,
}: {
  params: Promise<{ id: string; locale: string }>;
}) {
  const { userId } = await auth();
  const { id, locale } = await params;

  if (!userId) {
    redirect(`/${locale}/sign-in`);
  }

  const resume = await getResume(id, locale);
  if (!resume || resume.userId !== userId) {
    notFound();
  }

  const resumeData = resume.content as unknown as ResumeData;
  const plainText = formatResumeToPlainText(resumeData);
  const repeatedWords = checkWordFrequency(resumeData, locale);
  const atsResult = validateATS(resumeData);

  const lengthCheckValue = atsResult.checks.find((c) => c.id === "length")
    ?.value as "short" | "long" | undefined;
  const lengthStatus = atsResult.checks.find((c) => c.id === "length")?.status;
  const lengthValue =
    lengthStatus === "success" ? "ideal" : lengthCheckValue || "short";

  const formattedAtsAnalysis = {
    score: atsResult.score,
    checks: {
      summary:
        atsResult.checks.find((c) => c.id === "summary")?.status === "success",
      contact:
        atsResult.checks.find((c) => c.id === "contact")?.status === "success",
      experience:
        atsResult.checks.find((c) => c.id === "experience")?.status ===
        "success",
      skills:
        atsResult.checks.find((c) => c.id === "skills")?.status === "success",
      length: lengthValue as "ideal" | "short" | "long",
    },
    wordCount: plainText.split(/\s+/).filter(Boolean).length,
  };

  return (
    <AtsReaderClient
      resumeId={resume.id}
      resumeTitle={resume.title}
      plainText={plainText}
      repeatedWords={repeatedWords}
      atsAnalysis={formattedAtsAnalysis}
    />
  );
}
