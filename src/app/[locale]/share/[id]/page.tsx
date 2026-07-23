import { getResume } from "@/app/actions/resumeActions";
import { cookies, headers } from "next/headers";
import { notFound } from "next/navigation";
import SharePageClient from "./SharePageClient";
import { generateShareQrCode } from "@/lib/qrcode";

interface SharePageProps {
  params: Promise<{ id: string; locale: string }>;
}

export default async function SharePage({ params }: SharePageProps) {
  const { id, locale } = await params;
  const resume = await getResume(id, locale);

  if (!resume) {
    notFound();
  }

  const isExpired =
    (resume.expiresAt && new Date(resume.expiresAt) < new Date()) ||
    (resume.maxViews !== null &&
      resume.maxViews !== undefined &&
      resume.views >= resume.maxViews);

  const cookieStore = await cookies();
  const viewedCookieName = `viewed_${resume.id}`;
  const hasViewed = !!cookieStore.get(viewedCookieName);

  const unlockedCookieName = `unlocked_${resume.id}`;
  const isUnlocked =
    !resume.passwordHash || !!cookieStore.get(unlockedCookieName);

  const headersList = await headers();
  const host = headersList.get("host") || "localhost:3000";
  const protocol = host.startsWith("localhost") ? "http" : "https";
  const origin = `${protocol}://${host}`;

  let qrCodeUrl = null;
  if (resume.showQrCode && resume.slug) {
    try {
      qrCodeUrl = await generateShareQrCode(
        `${origin}/${resume.locale}/share/${resume.slug}`,
      );
    } catch (err) {
      console.error("Failed to generate QR Code locally:", err);
    }
  }

  const safeResume = {
    id: resume.id,
    title: resume.title,
    colorTheme: resume.colorTheme,
    templateId: resume.templateId,
    showQrCode: resume.showQrCode,
    slug: resume.slug || null,
    hasPassword: !!resume.passwordHash,
    isUnlocked: isExpired ? false : isUnlocked,
    isExpired,
    content: isUnlocked && !isExpired ? resume.content : null,
    locale: resume.locale,
    qrCodeUrl,
  };

  return (
    <SharePageClient
      resume={safeResume}
      hasViewed={hasViewed || isExpired}
      viewedCookieName={viewedCookieName}
    />
  );
}
