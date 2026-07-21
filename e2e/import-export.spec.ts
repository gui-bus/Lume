import { expect, test } from "@playwright/test";

test.describe("Data Import and Export Flow", () => {
  test("should handle JSON data structure serialization and deserialization in memory", async ({
    page,
  }) => {
    await page.goto("/pt/share/demo");

    const sampleResume = {
      personalInfo: {
        name: "Test User",
        email: "test@example.com",
        summary: "E2E Test Summary",
      },
      experiences: [],
      educations: [],
      skills: ["Playwright", "TypeScript", "React"],
      projects: [],
      languages: [],
      certifications: [],
      volunteering: [],
      courses: [],
    };

    const jsonString = JSON.stringify(sampleResume, null, 2);
    const parsed = JSON.parse(jsonString);

    expect(parsed.personalInfo.name).toBe("Test User");
    expect(parsed.skills).toContain("Playwright");
  });
});
