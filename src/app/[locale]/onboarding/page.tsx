import { isUserOnboarded } from "@/app/actions/resumeActions";
import { OnboardingClient } from "@/components/onboarding/OnboardingClient";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function OnboardingPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { userId } = await auth();
  const { locale } = await params;

  if (!userId) {
    redirect(`/${locale}/sign-in`);
  }

  const hasOnboarded = await isUserOnboarded();
  if (hasOnboarded) {
    redirect(`/${locale}/dashboard`);
  }

  return <OnboardingClient userId={userId} />;
}
