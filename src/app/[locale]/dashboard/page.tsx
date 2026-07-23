import { listUserResumes, getUserTags } from "@/app/actions/resumeActions";
import { DashboardClient } from "@/components/dashboard/DashboardClient";
import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function DashboardPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { userId } = await auth();
  const { locale } = await params;
  const user = await currentUser();

  if (!userId || !user) {
    redirect(`/${locale}/sign-in`);
  }

  const userResumes = await listUserResumes();
  const userTags = await getUserTags();

  const serializedResumes = userResumes.map((r) => ({
    id: r.id,
    title: r.title,
    locale: r.locale,
    colorTheme: r.colorTheme,
    templateId: r.templateId,
    showQrCode: r.showQrCode,
    passwordHash: r.passwordHash,
    expiresAt: r.expiresAt,
    maxViews: r.maxViews,
    sectionsOrder: r.sectionsOrder,
    views: r.views,
    downloads: r.downloads,
    updatedAt: r.updatedAt,
    groupId: r.groupId,
    slug: r.slug,
    tags: r.tags.map((t) => ({
      id: t.id,
      name: t.name,
      color: t.color,
    })),
  }));

  const serializedTags = userTags.map((t) => ({
    id: t.id,
    name: t.name,
    color: t.color,
  }));

  return (
    <DashboardClient
      initialResumes={serializedResumes as any}
      allUserTags={serializedTags}
      userEmail={user.emailAddresses[0].emailAddress}
      userName={`${user.firstName || ""} ${user.lastName || ""}`.trim()}
    />
  );
}
