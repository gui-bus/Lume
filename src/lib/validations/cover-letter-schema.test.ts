import { describe, it, expect } from "vitest";
import { CoverLetterSchema } from "./cover-letter-schema";

describe("CoverLetterSchema", () => {
  it("should validate a complete and correct cover letter payload", () => {
    const validData = {
      title: "Desenvolvedor Frontend",
      senderName: "Guilherme Silva",
      senderEmail: "guilherme@email.com",
      senderPhone: "+55 11 98765-4321",
      senderLocation: "São Paulo, SP",
      senderLinkedin: "linkedin.com/in/guilherme",
      senderGithub: "github.com/guilherme",
      senderPortfolio: "guilherme.dev",
      recipientName: "Mariana",
      recipientCompany: "Google",
      date: "23 de Julho de 2026",
      subject: "Candidatura à vaga",
      content: "Escrevo para manifestar interesse...",
      colorTheme: "#3b82f6",
      templateId: "modern",
    };

    const result = CoverLetterSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it("should set default values for colorTheme and templateId if missing", () => {
    const dataWithoutDefaults = {
      title: "Designer",
      senderName: "Guilherme Silva",
      senderEmail: "guilherme@email.com",
      content: "Minha carta de apresentação...",
    };

    const result = CoverLetterSchema.safeParse(dataWithoutDefaults);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.colorTheme).toBe("#3b82f6");
      expect(result.data.templateId).toBe("modern");
    }
  });

  it("should fail validation if required fields are missing", () => {
    const invalidData = {
      senderEmail: "invalid-email",
    };

    const result = CoverLetterSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
    if (!result.success) {
      const errorPaths = result.error.issues.map((err) => err.path[0]);
      expect(errorPaths).toContain("title");
      expect(errorPaths).toContain("senderName");
      expect(errorPaths).toContain("content");
    }
  });

  it("should fail validation if sender email is invalid", () => {
    const invalidData = {
      title: "Frontend Dev",
      senderName: "Guilherme Silva",
      senderEmail: "guilherme-email",
      content: "Minha carta...",
    };

    const result = CoverLetterSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
    if (!result.success) {
      const emailError = result.error.issues.find(
        (err) => err.path[0] === "senderEmail",
      );
      expect(emailError?.message).toBe("E-mail do remetente inválido");
    }
  });
});
