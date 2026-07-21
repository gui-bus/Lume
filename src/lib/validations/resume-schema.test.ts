import { describe, expect, it } from "vitest";
import {
  CertificationSchema,
  CourseSchema,
  EducationSchema,
  ExperienceSchema,
  LanguageSchema,
  PersonalInfoSchema,
  ProjectsSchema,
  ResumeSchema,
  VolunteerSchema,
} from "./resume-schema";

describe("Resume Zod Schemas Validation", () => {
  describe("PersonalInfoSchema", () => {
    it("should validate a valid personal info profile", () => {
      const validData = {
        name: "Guilherme Bus",
        email: "gui@example.com",
        phone: "+5511999999999",
        location: "São Paulo, SP",
        linkedin: "https://linkedin.com/in/gui",
        github: "https://github.com/gui",
        website: "https://gui.dev",
        summary: "Software Developer",
      };

      const result = PersonalInfoSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it("should reject invalid email and short name", () => {
      const invalidData = {
        name: "A",
        email: "invalid-email",
      };

      const result = PersonalInfoSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        const errors = result.error.flatten().fieldErrors;
        expect(errors.name).toBeDefined();
        expect(errors.email).toBeDefined();
      }
    });

    it("should accept empty string URLs for linkedin, github, and website", () => {
      const dataWithEmptyUrls = {
        name: "Guilherme Bus",
        email: "gui@example.com",
        linkedin: "",
        github: "",
        website: "",
      };

      const result = PersonalInfoSchema.safeParse(dataWithEmptyUrls);
      expect(result.success).toBe(true);
    });
  });

  describe("ExperienceSchema", () => {
    it("should validate a complete work experience", () => {
      const validExperience = {
        company: "Tech Corp",
        position: "Software Engineer",
        location: "Remote",
        startDate: "2023-01",
        endDate: "2024-05",
        current: false,
        description: "RESTful API development.",
      };

      const result = ExperienceSchema.safeParse(validExperience);
      expect(result.success).toBe(true);
    });

    it("should reject when company or position are missing", () => {
      const invalidExperience = {
        company: "",
        position: "",
        startDate: "2023-01",
        current: true,
      };

      const result = ExperienceSchema.safeParse(invalidExperience);
      expect(result.success).toBe(false);
    });
  });

  describe("EducationSchema", () => {
    it("should validate a valid education record", () => {
      const validEducation = {
        school: "USP",
        degree: "Bachelor",
        field: "Computer Science",
        graduationDate: "2022-12",
      };

      const result = EducationSchema.safeParse(validEducation);
      expect(result.success).toBe(true);
    });
  });

  describe("ProjectsSchema", () => {
    it("should validate a project with optional links", () => {
      const validProject = {
        name: "Lume",
        link: "https://lume.dev",
        github: "",
        deploy: "https://lume.vercel.app",
        description: "Resume builder",
      };

      const result = ProjectsSchema.safeParse(validProject);
      expect(result.success).toBe(true);
    });
  });

  describe("LanguageSchema", () => {
    it("should accept valid language proficiency levels", () => {
      const validLanguage = {
        name: "English",
        conversation: "Fluente",
        writing: "Avançado",
        reading: "Nativo",
      };

      const result = LanguageSchema.safeParse(validLanguage);
      expect(result.success).toBe(true);

      const invalidLanguage = {
        name: "Spanish",
        conversation: "Super Fluente",
        writing: "Avançado",
        reading: "Nativo",
      };

      const invalidResult = LanguageSchema.safeParse(invalidLanguage);
      expect(invalidResult.success).toBe(false);
    });
  });

  describe("CertificationSchema, VolunteerSchema, and CourseSchema", () => {
    it("should validate certification correctly", () => {
      const result = CertificationSchema.safeParse({
        name: "AWS Certified",
        issuer: "Amazon",
        date: "2023-05",
      });
      expect(result.success).toBe(true);
    });

    it("should validate volunteer work correctly", () => {
      const result = VolunteerSchema.safeParse({
        organization: "ONG Tech",
        role: "Mentor",
        startDate: "2022-01",
        current: true,
      });
      expect(result.success).toBe(true);
    });

    it("should validate course correctly", () => {
      const result = CourseSchema.safeParse({
        name: "Next.js Masterclass",
        current: false,
      });
      expect(result.success).toBe(true);
    });
  });

  describe("Full ResumeSchema", () => {
    it("should validate a complete resume structure", () => {
      const completeResume = {
        personalInfo: {
          name: "Guilherme Bus",
          email: "gui@example.com",
        },
        experiences: [],
        educations: [],
        skills: ["React", "TypeScript"],
        projects: [],
        languages: [],
        certifications: [],
        volunteering: [],
        courses: [],
      };

      const result = ResumeSchema.safeParse(completeResume);
      expect(result.success).toBe(true);
    });
  });
});
