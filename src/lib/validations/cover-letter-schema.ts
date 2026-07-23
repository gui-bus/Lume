import { z } from "zod";

export const CoverLetterSchema = z.object({
  title: z.string().min(1, "O título é obrigatório"),
  senderName: z.string().min(1, "O nome do remetente é obrigatório"),
  senderEmail: z.string().email("E-mail do remetente inválido"),
  senderPhone: z.string().nullable().optional(),
  senderLocation: z.string().nullable().optional(),
  senderLinkedin: z.string().nullable().optional(),
  senderGithub: z.string().nullable().optional(),
  senderPortfolio: z.string().nullable().optional(),
  recipientName: z.string().nullable().optional(),
  recipientCompany: z.string().nullable().optional(),
  date: z.string().nullable().optional(),
  subject: z.string().nullable().optional(),
  content: z.string().min(1, "O conteúdo é obrigatório"),
  colorTheme: z.string().default("#3b82f6"),
  templateId: z.string().default("modern"),
});

export type CoverLetterData = z.infer<typeof CoverLetterSchema>;
