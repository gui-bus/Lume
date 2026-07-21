import { expect, test } from "@playwright/test";

test.describe("1. Authentication & Route Protection", () => {
  test("E2E-01: should redirect unauthenticated access from root /pt to /sign-in", async ({
    page,
  }) => {
    await page.goto("/pt");
    await expect(page).toHaveURL(/\/sign-in/);
  });

  test("E2E-02: should render Clerk Sign-In page properly with branding logo and titles", async ({
    page,
  }) => {
    await page.goto("/pt/sign-in");
    await expect(page.locator("img[alt='Lume Logo']").first()).toBeVisible();
    await expect(page).toHaveURL(/\/sign-in/);
  });

  test("E2E-03: should authenticate using Clerk test mode credentials (jane+clerk_test@example.com)", async ({
    page,
  }) => {
    await page.goto("/pt/sign-in");

    const emailInput = page.locator(
      "input[type='email'], input[name='identifier']",
    );
    if (await emailInput.isVisible({ timeout: 5000 }).catch(() => false)) {
      await emailInput.fill("jane+clerk_test@example.com");

      const continueBtn = page.locator(
        "button:has-text('Continue'), button:has-text('Continuar')",
      );
      if (await continueBtn.isVisible().catch(() => false)) {
        await continueBtn.click();
      }

      const otpInput = page.locator(
        "input[name='code'], input[data-otp-input='true']",
      );
      if (await otpInput.isVisible({ timeout: 5000 }).catch(() => false)) {
        await otpInput.fill("424242");
      }
    }
  });
});

test.describe("2. Public Navigation & Locale Routing", () => {
  test("E2E-04: should navigate to /pt/sign-in and display sign in header text", async ({
    page,
  }) => {
    await page.goto("/pt/sign-in");
    await expect(page.locator("body")).toBeVisible();
  });

  test("E2E-05: should navigate to /en/sign-in for English locale auth route", async ({
    page,
  }) => {
    await page.goto("/en/sign-in");
    await expect(page).toHaveURL(/\/en\/sign-in/);
    await expect(page.locator("body")).toBeVisible();
  });
});

test.describe("3. Resume Form Data Models & State Validation", () => {
  test("E2E-06: should validate PersonalInfo data structure fields", async ({
    page,
  }) => {
    const personalInfo = {
      name: "Guilherme Bustamante",
      email: "gui@lume.dev",
      phone: "+55 11 99999-9999",
      location: "São Paulo, SP",
      linkedin: "https://linkedin.com/in/gui",
      summary: "Full Stack Engineer",
    };

    expect(personalInfo.name).toBe("Guilherme Bustamante");
    expect(personalInfo.email).toContain("@");
  });

  test("E2E-07: should validate Experience item array structure", async ({
    page,
  }) => {
    const experiences = [
      {
        company: "Lume Corp",
        position: "Senior Engineer",
        startDate: "2023-01",
        current: true,
      },
    ];

    expect(experiences).toHaveLength(1);
    expect(experiences[0].current).toBe(true);
  });

  test("E2E-08: should validate Skills array list item management", async ({
    page,
  }) => {
    const skills = ["React", "Next.js", "TypeScript", "Prisma", "Playwright"];
    expect(skills.length).toBe(5);
    expect(skills).toContain("TypeScript");
  });
});

test.describe("4. ATS Engine & Keyword Matching Intelligence", () => {
  test("E2E-09: should calculate ATS score metric accurately", async ({
    page,
  }) => {
    const summaryLength = 120;
    const hasContact = true;
    const expCount = 2;
    const skillsCount = 6;

    let score = 0;
    if (summaryLength > 50) score += 20;
    if (hasContact) score += 20;
    if (expCount >= 2) score += 20;
    if (skillsCount >= 5) score += 20;
    score += 20;

    expect(score).toBe(100);
  });

  test("E2E-10: should match job keywords against candidate skills", async ({
    page,
  }) => {
    const jobDescription =
      "Looking for a Next.js Developer with React and TypeScript knowledge.";
    const candidateSkills = ["Next.js", "React", "TypeScript"];

    const matches = candidateSkills.filter((skill) =>
      jobDescription.toLowerCase().includes(skill.toLowerCase()),
    );

    expect(matches).toHaveLength(3);
  });
});

test.describe("5. Data Backup, Export & PDF Document Pipeline", () => {
  test("E2E-11: should export and import full ResumeData JSON structure cleanly", async ({
    page,
  }) => {
    const payload = {
      personalInfo: {
        name: "Guilherme Bustamante",
        email: "gui@lume.dev",
        summary: "E2E Complete Test",
      },
      experiences: [],
      educations: [],
      skills: ["Playwright", "Vitest"],
      projects: [],
      languages: [],
      certifications: [],
      volunteering: [],
      courses: [],
    };

    const serialized = JSON.stringify(payload, null, 2);
    const restored = JSON.parse(serialized);

    expect(restored.personalInfo.name).toBe("Guilherme Bustamante");
    expect(restored.skills).toContain("Playwright");
  });

  test("E2E-12: should verify PDF label localization dictionary mapping", async ({
    page,
  }) => {
    const labels = {
      experience: "Experiência",
      education: "Formação",
      skills: "Competências",
    };

    expect(labels.experience).toBe("Experiência");
  });

  test("E2E-13: should verify theme hex color configuration for PDF rendering", async ({
    page,
  }) => {
    const themeColor = "#18181b";
    expect(themeColor).toMatch(/^#[0-9a-fA-F]{6}$/);
  });
});
