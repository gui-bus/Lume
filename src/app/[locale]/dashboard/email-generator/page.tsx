import { EmailGeneratorClient } from "@/components/email/EmailGeneratorClient";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function EmailGeneratorPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { userId } = await auth();
  const { locale } = await params;

  if (!userId) {
    redirect(`/${locale}/sign-in`);
  }

  return <EmailGeneratorClient />;
}
