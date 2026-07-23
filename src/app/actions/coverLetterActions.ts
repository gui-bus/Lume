"use server";

import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import crypto from "node:crypto";
import { CoverLetterSchema } from "@/lib/validations/cover-letter-schema";

export async function saveCoverLetter(
  id: string | undefined,
  data: any,
  locale: string = "pt",
  groupId?: string,
) {
  const { userId } = await auth();
  if (!userId) throw new Error("Usuário não autenticado");

  const validated = CoverLetterSchema.parse(data);

  const finalGroupId = groupId || data.groupId || crypto.randomUUID();

  const existingVersion = await prisma.coverLetter.findFirst({
    where: {
      groupId: finalGroupId,
      locale: locale,
      userId: userId,
    },
  });

  let result;
  if (existingVersion) {
    result = await prisma.coverLetter.update({
      where: { id: existingVersion.id },
      include: { tags: true },
      data: {
        title: validated.title,
        senderName: validated.senderName,
        senderEmail: validated.senderEmail,
        senderPhone: validated.senderPhone || null,
        senderLocation: validated.senderLocation || null,
        senderLinkedin: validated.senderLinkedin || null,
        senderGithub: validated.senderGithub || null,
        senderPortfolio: validated.senderPortfolio || null,
        recipientName: validated.recipientName || null,
        recipientCompany: validated.recipientCompany || null,
        recipientTitle: data.recipientTitle || null,
        recipientAddress: data.recipientAddress || null,
        date: validated.date || null,
        subject: validated.subject || null,
        content: validated.content,
        colorTheme: validated.colorTheme,
        templateId: validated.templateId,
      },
    });
  } else {
    result = await prisma.coverLetter.create({
      include: { tags: true },
      data: {
        title: validated.title,
        senderName: validated.senderName,
        senderEmail: validated.senderEmail,
        senderPhone: validated.senderPhone || null,
        senderLocation: validated.senderLocation || null,
        senderLinkedin: validated.senderLinkedin || null,
        senderGithub: validated.senderGithub || null,
        senderPortfolio: validated.senderPortfolio || null,
        recipientName: validated.recipientName || null,
        recipientCompany: validated.recipientCompany || null,
        recipientTitle: data.recipientTitle || null,
        recipientAddress: data.recipientAddress || null,
        date: validated.date || null,
        subject: validated.subject || null,
        content: validated.content,
        colorTheme: validated.colorTheme,
        templateId: validated.templateId,
        locale,
        groupId: finalGroupId,
        userId,
      },
    });
  }

  revalidatePath("/", "layout");
  return result;
}

export async function listUserCoverLetters(localeFilter?: string) {
  const { userId } = await auth();
  if (!userId) return [];

  const whereClause: any = { userId };
  if (localeFilter) {
    whereClause.locale = localeFilter;
  }

  const letters = await prisma.coverLetter.findMany({
    where: whereClause,
    include: { tags: true },
    orderBy: { updatedAt: "desc" },
  });

  const uniqueGroups = new Map<string, (typeof letters)[0]>();
  letters.forEach((l) => {
    if (l.groupId && !uniqueGroups.has(l.groupId)) {
      uniqueGroups.set(l.groupId, l);
    }
  });

  return Array.from(uniqueGroups.values());
}

export async function deleteCoverLetter(id: string) {
  const { userId } = await auth();
  if (!userId) throw new Error("Não autorizado");

  const letter = await prisma.coverLetter.findUnique({ where: { id } });
  if (letter && letter.userId === userId) {
    await prisma.coverLetter.deleteMany({
      where: { groupId: letter.groupId, userId },
    });
  }

  revalidatePath("/", "layout");
}

export async function duplicateCoverLetter(id: string, newTitle?: string) {
  const { userId } = await auth();
  if (!userId) throw new Error("Usuário não autenticado");

  const original = await prisma.coverLetter.findUnique({
    where: { id },
  });

  if (!original || original.userId !== userId) {
    throw new Error("Carta não encontrada ou não autorizada");
  }

  const finalGroupId = crypto.randomUUID();
  const copyTitle = newTitle || `${original.title} (Cópia)`;

  const duplicate = await prisma.coverLetter.create({
    include: { tags: true },
    data: {
      title: copyTitle,
      senderName: original.senderName,
      senderEmail: original.senderEmail,
      senderPhone: original.senderPhone,
      senderLocation: original.senderLocation,
      senderLinkedin: original.senderLinkedin,
      senderGithub: original.senderGithub,
      senderPortfolio: original.senderPortfolio,
      recipientName: original.recipientName,
      recipientCompany: original.recipientCompany,
      recipientTitle: original.recipientTitle,
      recipientAddress: original.recipientAddress,
      date: original.date,
      subject: original.subject,
      content: original.content,
      colorTheme: original.colorTheme,
      templateId: original.templateId,
      locale: original.locale,
      groupId: finalGroupId,
      userId,
    },
  });

  revalidatePath("/", "layout");
  return duplicate;
}

export async function getCoverLetter(id: string) {
  const { userId } = await auth();
  if (!userId) return null;

  return prisma.coverLetter.findUnique({
    where: { id, userId },
    include: { tags: true },
  });
}

export async function attachTagToCoverLetter(
  coverLetterId: string,
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

  const letter = await prisma.coverLetter.findUnique({
    where: { id: coverLetterId },
    select: { groupId: true, tagsOrder: true },
  });
  if (!letter) throw new Error("Carta não encontrada");

  const lettersInGroup = await prisma.coverLetter.findMany({
    where: { groupId: letter.groupId, userId },
  });

  for (const l of lettersInGroup) {
    const currentOrder = l.tagsOrder || [];
    const nextOrder = currentOrder.includes(tag.id)
      ? currentOrder
      : [...currentOrder, tag.id];

    await prisma.coverLetter.update({
      where: { id: l.id },
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

export async function detachTagFromCoverLetter(
  coverLetterId: string,
  tagId: string,
) {
  const { userId } = await auth();
  if (!userId) throw new Error("Não autorizado");

  const letter = await prisma.coverLetter.findUnique({
    where: { id: coverLetterId },
    select: { groupId: true, tagsOrder: true },
  });
  if (!letter) throw new Error("Carta não encontrada");

  const lettersInGroup = await prisma.coverLetter.findMany({
    where: { groupId: letter.groupId, userId },
  });

  for (const l of lettersInGroup) {
    const currentOrder = l.tagsOrder || [];
    const nextOrder = currentOrder.filter((id) => id !== tagId);

    await prisma.coverLetter.update({
      where: { id: l.id },
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
