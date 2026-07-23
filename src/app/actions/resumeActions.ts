"use server";

import prisma from "@/lib/prisma";
import { ResumeData } from "@/types/resume";
import { auth, currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import crypto from "node:crypto";
import bcrypt from "bcryptjs";

export async function saveResume(
  id: string | undefined,
  data: ResumeData,
  title: string = "Meu Currículo",
  locale: string = "pt",
  groupId?: string,
  slug?: string,
  templateId: string = "modern",
  showQrCode: boolean = false,
  password?: string | null,
  expiresAt?: Date | null,
  maxViews?: number | null,
  sectionsOrder?: string[],
) {
  const { userId } = await auth();
  const user = await currentUser();

  if (!userId || !user) {
    throw new Error("Usuário não autenticado");
  }

  const email = user.emailAddresses[0].emailAddress;
  const name = `${user.firstName} ${user.lastName}`.trim();

  const existingUser = await prisma.user.findFirst({
    where: {
      OR: [{ id: userId }, { email }],
    },
  });

  if (!existingUser) {
    await prisma.user.create({
      data: { id: userId, email, name },
    });
  } else if (existingUser.id !== userId) {
    await prisma.$transaction([
      prisma.resume.updateMany({
        where: { userId: existingUser.id },
        data: { userId: userId },
      }),
      prisma.user.delete({ where: { id: existingUser.id } }),
      prisma.user.create({
        data: { id: userId, email, name },
      }),
    ]);
  } else {
    await prisma.user.update({
      where: { id: userId },
      data: { email, name },
    });
  }

  const finalGroupId = groupId || crypto.randomUUID();

  if (slug) {
    const slugExists = await prisma.resume.findFirst({
      where: {
        slug,
        NOT: { groupId: finalGroupId },
      },
    });
    if (slugExists) {
      throw new Error(
        "Este link personalizado já está em uso por outro usuário.",
      );
    }
  }

  const existingVersion = await prisma.resume.findFirst({
    where: {
      groupId: finalGroupId,
      locale: locale,
      userId: userId,
    },
  });

  let passwordHash: string | null = null;
  if (password === null) {
    passwordHash = null;
  } else if (password) {
    passwordHash = await bcrypt.hash(password, 10);
  } else if (existingVersion) {
    passwordHash = existingVersion.passwordHash;
  }

  const defaultOrder = [
    "summary",
    "experiences",
    "educations",
    "skills",
    "projects",
    "languages",
    "certifications",
    "volunteering",
    "courses",
  ];
  const finalOrder =
    sectionsOrder ||
    (existingVersion?.sectionsOrder as string[]) ||
    defaultOrder;

  const otherVersion = await prisma.resume.findFirst({
    where: { groupId: finalGroupId, userId },
    select: { tagsOrder: true, tags: { select: { id: true } } },
  });
  const tagsToConnect = otherVersion?.tags?.map((t) => ({ id: t.id })) || [];
  const initialTagsOrder = otherVersion?.tagsOrder || [];

  let result;

  if (existingVersion) {
    result = await prisma.resume.update({
      where: { id: existingVersion.id },
      data: {
        content: data as any,
        title,
        slug: slug || null,
        templateId,
        showQrCode,
        passwordHash,
        expiresAt: expiresAt || null,
        maxViews: maxViews || null,
        sectionsOrder: finalOrder,
      },
    });
  } else {
    result = await prisma.resume.create({
      data: {
        content: data as any,
        title,
        locale,
        groupId: finalGroupId,
        userId,
        slug: slug || null,
        templateId,
        showQrCode,
        passwordHash,
        expiresAt: expiresAt || null,
        maxViews: maxViews || null,
        sectionsOrder: finalOrder,
        tagsOrder: initialTagsOrder,
        tags: {
          connect: tagsToConnect,
        },
      },
    });
  }

  revalidatePath("/", "layout");
  return result;
}

export async function listUserResumes(
  search?: string,
  localeFilter?: string,
  tagFilter?: string,
  sort: string = "desc",
) {
  const { userId } = await auth();
  if (!userId) return [];

  const whereClause: any = { userId };

  if (search) {
    whereClause.OR = [
      { title: { contains: search, mode: "insensitive" } },
      { content: { path: ["personalInfo", "name"], string_contains: search } },
      {
        content: { path: ["personalInfo", "summary"], string_contains: search },
      },
    ];
  }

  if (localeFilter) {
    whereClause.locale = localeFilter;
  }

  if (tagFilter) {
    whereClause.tags = {
      some: {
        id: tagFilter,
      },
    };
  }

  const resumes = await prisma.resume.findMany({
    where: whereClause,
    include: {
      tags: true,
    },
    orderBy: { updatedAt: sort === "asc" ? "asc" : "desc" },
  });

  const uniqueGroups = new Map<string, (typeof resumes)[0]>();
  resumes.forEach((r) => {
    if (r.groupId && !uniqueGroups.has(r.groupId)) {
      uniqueGroups.set(r.groupId, r);
    }
  });

  return Array.from(uniqueGroups.values());
}

export async function deleteResume(id: string) {
  const { userId } = await auth();
  if (!userId) throw new Error("Não autorizado");

  const resume = await prisma.resume.findUnique({ where: { id } });
  if (resume?.groupId) {
    await prisma.resume.deleteMany({
      where: { groupId: resume.groupId, userId },
    });
  }

  revalidatePath("/", "layout");
}

export async function getResume(identifier: string, locale?: string) {
  try {
    const byId = await prisma.resume.findUnique({
      where: { id: identifier },
      include: { tags: true },
    });

    if (byId) {
      return byId;
    }

    const bySlug = await prisma.resume.findFirst({
      where: { slug: identifier },
      include: { tags: true },
    });

    if (bySlug) {
      return bySlug;
    }

    if (locale) {
      const byGroup = await prisma.resume.findFirst({
        where: {
          groupId: identifier,
          locale: locale,
        },
        include: { tags: true },
      });
      if (byGroup) return byGroup;
    }

    return null;
  } catch (error) {
    console.error("Error fetching resume:", error);
    return null;
  }
}

export async function incrementView(
  id: string,
  userAgent?: string,
  referer?: string,
) {
  try {
    await prisma.$transaction([
      prisma.resume.update({
        where: { id },
        data: { views: { increment: 1 } },
      }),
      prisma.shareEvent.create({
        data: {
          resumeId: id,
          type: "VIEW",
          userAgent: userAgent || null,
          referer: referer || null,
        },
      }),
    ]);
  } catch (error) {
    console.error("Error incrementing view event:", error);
  }
}

export async function incrementDownload(
  id: string | undefined,
  userAgent?: string,
  referer?: string,
) {
  if (!id) return;
  try {
    await prisma.$transaction([
      prisma.resume.update({
        where: { id },
        data: { downloads: { increment: 1 } },
      }),
      prisma.shareEvent.create({
        data: {
          resumeId: id,
          type: "DOWNLOAD",
          userAgent: userAgent || null,
          referer: referer || null,
        },
      }),
    ]);
  } catch (error) {
    console.error("Error incrementing download event:", error);
  }
}

export async function duplicateResume(resumeId: string, newTitle?: string) {
  const { userId } = await auth();
  if (!userId) throw new Error("Usuário não autenticado");

  const original = await prisma.resume.findUnique({
    where: { id: resumeId },
    include: { tags: true },
  });

  if (!original || original.userId !== userId) {
    throw new Error("Currículo não encontrado ou não autorizado");
  }

  const finalGroupId = crypto.randomUUID();
  const copyTitle = newTitle || `${original.title} (Cópia)`;

  const duplicate = await prisma.resume.create({
    data: {
      title: copyTitle,
      content: original.content as any,
      locale: original.locale,
      colorTheme: original.colorTheme,
      templateId: original.templateId,
      showQrCode: original.showQrCode,
      sectionsOrder: original.sectionsOrder,
      tagsOrder: original.tagsOrder,
      groupId: finalGroupId,
      userId,
      tags: {
        connect: original.tags.map((t) => ({ id: t.id })),
      },
    },
  });

  revalidatePath("/", "layout");
  return duplicate;
}

export async function getResumeAnalytics(resumeId: string) {
  const { userId } = await auth();
  if (!userId) throw new Error("Não autorizado");

  const resume = await prisma.resume.findUnique({
    where: { id: resumeId },
  });

  if (!resume || resume.userId !== userId) {
    throw new Error("Currículo não encontrado ou não autorizado");
  }

  const events = await prisma.shareEvent.findMany({
    where: { resumeId },
    orderBy: { createdAt: "asc" },
  });

  const viewsByDay: Record<
    string,
    { date: string; views: number; downloads: number }
  > = {};
  const viewsByHour: Record<
    number,
    { hour: string; views: number; downloads: number }
  > = {};
  const referers: Record<string, number> = {};
  const devices: Record<string, number> = {};

  for (let i = 0; i < 24; i++) {
    viewsByHour[i] = {
      hour: `${String(i).padStart(2, "0")}:00`,
      views: 0,
      downloads: 0,
    };
  }

  events.forEach((event) => {
    const dayStr = event.createdAt.toISOString().split("T")[0];
    if (!viewsByDay[dayStr]) {
      viewsByDay[dayStr] = { date: dayStr, views: 0, downloads: 0 };
    }

    const hour = event.createdAt.getHours();

    if (event.type === "VIEW") {
      viewsByDay[dayStr].views++;
      viewsByHour[hour].views++;
    } else if (event.type === "DOWNLOAD") {
      viewsByDay[dayStr].downloads++;
      viewsByHour[hour].downloads++;
    }

    const ref = event.referer
      ? new URL(event.referer).hostname
      : "Acesso Direto";
    referers[ref] = (referers[ref] || 0) + 1;

    let device = "Desktop";
    const ua = event.userAgent?.toLowerCase() || "";
    if (
      ua.includes("mobi") ||
      ua.includes("android") ||
      ua.includes("iphone")
    ) {
      device = "Mobile";
    } else if (ua.includes("tablet") || ua.includes("ipad")) {
      device = "Tablet";
    }
    devices[device] = (devices[device] || 0) + 1;
  });

  return {
    views: resume.views,
    downloads: resume.downloads,
    dailyData: Object.values(viewsByDay),
    hourlyData: Object.values(viewsByHour),
    referers: Object.entries(referers).map(([source, count]) => ({
      source,
      count,
    })),
    devices: Object.entries(devices).map(([name, value]) => ({ name, value })),
  };
}

export async function getUserTags() {
  const { userId } = await auth();
  if (!userId) return [];
  return prisma.tag.findMany({
    where: { userId },
    orderBy: { name: "asc" },
  });
}

export async function attachTagToResume(
  resumeId: string,
  tagName: string,
  tagColor: string = "#3b82f6",
) {
  const { userId } = await auth();
  if (!userId) throw new Error("Não autorizado");

  const cleanTagName = tagName.trim();

  let tag = await prisma.tag.findUnique({
    where: {
      userId_name: {
        userId,
        name: cleanTagName,
      },
    },
  });

  if (!tag) {
    tag = await prisma.tag.create({
      data: {
        name: cleanTagName,
        color: tagColor,
        userId,
      },
    });
  }

  const resume = await prisma.resume.findUnique({
    where: { id: resumeId },
    select: { groupId: true, tagsOrder: true },
  });
  if (!resume) throw new Error("Currículo não encontrado");

  const resumesInGroup = await prisma.resume.findMany({
    where: { groupId: resume.groupId, userId },
  });

  for (const r of resumesInGroup) {
    const currentOrder = r.tagsOrder || [];
    const nextOrder = currentOrder.includes(tag.id)
      ? currentOrder
      : [...currentOrder, tag.id];

    await prisma.resume.update({
      where: { id: r.id },
      data: {
        tags: {
          connect: { id: tag.id },
        },
        tagsOrder: nextOrder,
      },
    });
  }

  revalidatePath("/", "layout");
  return tag;
}

export async function detachTagFromResume(resumeId: string, tagId: string) {
  const { userId } = await auth();
  if (!userId) throw new Error("Não autorizado");

  const resume = await prisma.resume.findUnique({
    where: { id: resumeId },
    select: { groupId: true, tagsOrder: true },
  });
  if (!resume) throw new Error("Currículo não encontrado");

  const resumesInGroup = await prisma.resume.findMany({
    where: { groupId: resume.groupId, userId },
  });

  for (const r of resumesInGroup) {
    const currentOrder = r.tagsOrder || [];
    const nextOrder = currentOrder.filter((id) => id !== tagId);

    await prisma.resume.update({
      where: { id: r.id },
      data: {
        tags: {
          disconnect: { id: tagId },
        },
        tagsOrder: nextOrder,
      },
    });
  }

  revalidatePath("/", "layout");
}

export async function verifySharePassword(
  resumeIdOrSlug: string,
  passwordAttempt: string,
) {
  const resume = await prisma.resume.findFirst({
    where: {
      OR: [{ id: resumeIdOrSlug }, { slug: resumeIdOrSlug }],
    },
  });

  if (!resume || !resume.passwordHash) {
    return true;
  }

  const isValid = await bcrypt.compare(passwordAttempt, resume.passwordHash);
  return isValid;
}

export async function setOnboarded() {
  const { userId } = await auth();
  if (!userId) throw new Error("Não autorizado");

  await prisma.user.update({
    where: { id: userId },
    data: { onboarded: true },
  });
}

export async function isUserOnboarded() {
  const { userId } = await auth();
  if (!userId) return false;

  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  return user?.onboarded ?? false;
}

export async function updateTagsOrder(resumeId: string, tagsOrder: string[]) {
  const { userId } = await auth();
  if (!userId) throw new Error("Não autorizado");

  const resume = await prisma.resume.findUnique({
    where: { id: resumeId, userId },
    select: { groupId: true },
  });
  if (!resume) throw new Error("Currículo não encontrado");

  await prisma.resume.updateMany({
    where: { groupId: resume.groupId, userId },
    data: { tagsOrder },
  });

  revalidatePath("/[locale]/dashboard", "page");
  revalidatePath("/[locale]/dashboard", "layout");
  revalidatePath("/", "layout");
}

export async function unlockResumeShare(
  resumeId: string,
  passwordAttempt: string,
) {
  const resume = await prisma.resume.findUnique({
    where: { id: resumeId },
  });

  if (!resume || !resume.passwordHash) {
    return true;
  }

  const isValid = await bcrypt.compare(passwordAttempt, resume.passwordHash);
  if (isValid) {
    const { cookies } = await import("next/headers");
    const cookieStore = await cookies();
    cookieStore.set(`unlocked_${resumeId}`, "true", {
      path: "/",
      maxAge: 3600,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    });
    return true;
  }

  return false;
}
