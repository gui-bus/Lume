import { getResumeAnalytics, getResume } from "@/app/actions/resumeActions";
import { AnalyticsClient } from "@/components/dashboard/AnalyticsClient";
import { auth } from "@clerk/nextjs/server";
import { redirect, notFound } from "next/navigation";

export default async function AnalyticsPage({
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

  const analyticsData = await getResumeAnalytics(id);

  return (
    <AnalyticsClient
      resumeId={id}
      resumeTitle={resume.title}
      analyticsData={analyticsData as any}
    />
  );
}
