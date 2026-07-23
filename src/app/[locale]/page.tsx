import { getResume, listUserResumes } from "@/app/actions/resumeActions";
import { EditorView } from "@/components/editor/EditorView";
import { LandingClient } from "@/components/landing/LandingClient";
import { ResumeData } from "@/types/resume";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Suspense } from "react";

export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ id?: string }>;
}) {
  const { userId } = await auth();
  const { locale } = await params;
  const { id } = await searchParams;

  if (!id) {
    if (userId) {
      redirect(`/${locale}/dashboard`);
    }
    return <LandingClient />;
  }

  if (!userId) {
    redirect(`/${locale}/sign-in`);
  }

  let initialData = null;
  let resumeId: string | undefined = undefined;
  let groupId: string | undefined = id;
  let initialShowQrCode = false;
  let initialSlug: string | undefined = undefined;
  let initialTemplateId = "classic";
  let initialResumeLocale = locale;
  let initialSectionsOrder: string[] | undefined = undefined;

  const res = await getResume(id, locale);
  if (res) {
    initialData = res.content as unknown as ResumeData;
    resumeId = res.id;
    groupId = res.groupId ?? undefined;
    initialSlug = res.slug ?? undefined;
    initialShowQrCode = res.showQrCode ?? false;
    initialTemplateId = res.templateId ?? "classic";
    initialResumeLocale = res.locale ?? locale;
    initialSectionsOrder = res.sectionsOrder ?? undefined;
  }

  return (
    <Suspense fallback={null}>
      <EditorView
        initialData={initialData || undefined}
        resumeId={resumeId}
        groupId={groupId}
        initialSlug={initialSlug}
        initialShowQrCode={initialShowQrCode}
        initialTemplateId={initialTemplateId}
        initialResumeLocale={initialResumeLocale}
        initialSectionsOrder={initialSectionsOrder}
      />
    </Suspense>
  );
}
