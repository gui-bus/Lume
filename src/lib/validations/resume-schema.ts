import { z } from "zod";

const httpsUrlRegex = /^https:\/\/[a-zA-Z0-9-\.]+\.[a-z]{2,}(\/\S*)?$/;
const linkedinRegex =
  /^https:\/\/(www\.)?linkedin\.com\/in\/[a-zA-Z0-9_-]+\/?$/;
const githubRegex = /^https:\/\/(www\.)?github\.com\/[a-zA-Z0-9_-]+\/?$/;

export const PersonalInfoSchema = z.object({
  name: z.string().min(2, "Nome é obrigatório"),
  email: z.string().email("E-mail inválido"),
  phone: z.string().optional(),
  location: z.string().optional(),
  linkedin: z
    .string()
    .regex(linkedinRegex, "LinkedIn deve começar com https://linkedin.com/in/")
    .optional()
    .or(z.literal("")),
  github: z
    .string()
    .regex(githubRegex, "GitHub deve começar com https://github.com/")
    .optional()
    .or(z.literal("")),
  website: z
    .string()
    .regex(
      httpsUrlRegex,
      "URL inválida ou sem HTTPS (deve começar com https://)",
    )
    .optional()
    .or(z.literal("")),
  summary: z.string().optional(),
});

export const ExperienceSchema = z.object({
  company: z.string().min(1, "Empresa é obrigatória"),
  position: z.string().min(1, "Cargo é obrigatório"),
  location: z.string().optional(),
  startDate: z.string().min(1, "Data de início é obrigatória"),
  endDate: z.string().optional(),
  current: z.boolean(),
  description: z.string().optional(),
  featured: z.boolean().optional(),
});

export const EducationSchema = z.object({
  school: z.string().min(1, "Instituição é obrigatória"),
  degree: z.string().min(1, "Grau é obrigatório"),
  field: z.string().min(1, "Área de estudo é obrigatória"),
  graduationDate: z.string().min(1, "Data de graduação é obrigatória"),
});

export const ProjectsSchema = z.object({
  name: z.string().min(1, "Nome do projeto é obrigatório"),
  link: z
    .string()
    .regex(httpsUrlRegex, "URL deve começar com https://")
    .optional()
    .or(z.literal("")),
  github: z
    .string()
    .regex(httpsUrlRegex, "URL deve começar com https://")
    .optional()
    .or(z.literal("")),
  deploy: z
    .string()
    .regex(httpsUrlRegex, "URL deve começar com https://")
    .optional()
    .or(z.literal("")),
  description: z.string().optional(),
  featured: z.boolean().optional(),
});

export const LanguageSchema = z.object({
  name: z.string().min(1, "Idioma é obrigatório"),
  conversation: z.enum([
    "Básico",
    "Intermediário",
    "Avançado",
    "Fluente",
    "Nativo",
  ]),
  writing: z.enum(["Básico", "Intermediário", "Avançado", "Fluente", "Nativo"]),
  reading: z.enum(["Básico", "Intermediário", "Avançado", "Fluente", "Nativo"]),
});

export const CertificationSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  issuer: z.string().min(1, "Emissor é obrigatório"),
  date: z.string().min(1, "Data é obrigatória"),
});

export const VolunteerSchema = z.object({
  organization: z.string().min(1, "Organização é obrigatória"),
  role: z.string().min(1, "Papel é obrigatório"),
  startDate: z.string().min(1, "Data de início é obrigatória"),
  endDate: z.string().optional(),
  current: z.boolean(),
  description: z.string().optional(),
});

export const CourseSchema = z.object({
  name: z.string().min(1, "Nome do curso é obrigatório"),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  current: z.boolean(),
});

export const CustomSectionItemSchema = z.object({
  id: z.string(),
  title: z.string().min(1, "Título do item é obrigatório"),
  description: z.string().optional(),
  date: z.string().optional(),
  featured: z.boolean().optional(),
});

export const CustomSectionSchema = z.object({
  id: z.string(),
  title: z.string().min(1, "Título da seção é obrigatório"),
  items: z.array(CustomSectionItemSchema),
});

export const ResumeSchema = z.object({
  personalInfo: PersonalInfoSchema,
  experiences: z.array(ExperienceSchema),
  educations: z.array(EducationSchema),
  skills: z.array(z.string()),
  projects: z.array(ProjectsSchema),
  languages: z.array(LanguageSchema),
  certifications: z.array(CertificationSchema),
  volunteering: z.array(VolunteerSchema),
  courses: z.array(CourseSchema),
  customSections: z.array(CustomSectionSchema).optional(),
});
