import { getCoverLetter } from "@/app/actions/coverLetterActions";
import { CoverLetterEditorClient } from "@/components/cover-letter/CoverLetterEditorClient";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string; locale: string }>;
}) {
  const { id } = await params;
  const letter = await getCoverLetter(id);
  return {
    title: letter ? `${letter.title} | Lume` : "Carta de Apresentação | Lume",
  };
}

export default async function CoverLetterEditorPage({
  params,
}: {
  params: Promise<{ id: string; locale: string }>;
}) {
  const { userId } = await auth();
  const { id, locale } = await params;

  if (!userId) {
    redirect(`/${locale}/sign-in`);
  }

  const letter = await getCoverLetter(id);
  if (!letter || letter.userId !== userId) {
    redirect(`/${locale}/dashboard`);
  }

  const serialized = {
    id: letter.id,
    title: letter.title,
    senderName: letter.senderName,
    senderEmail: letter.senderEmail,
    senderPhone: letter.senderPhone,
    senderLocation: letter.senderLocation,
    senderLinkedin: letter.senderLinkedin,
    senderGithub: letter.senderGithub,
    senderPortfolio: letter.senderPortfolio,
    recipientName: letter.recipientName,
    recipientCompany: letter.recipientCompany,
    recipientTitle: letter.recipientTitle,
    recipientAddress: letter.recipientAddress,
    date: letter.date,
    subject: letter.subject,
    content: letter.content,
    colorTheme: letter.colorTheme,
    templateId: letter.templateId,
    groupId: letter.groupId,
  };

  return <CoverLetterEditorClient initialLetter={serialized} />;
}
