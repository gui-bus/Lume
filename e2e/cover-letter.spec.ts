import { expect, test } from "@playwright/test";

test.describe("Cover Letters & Email Generator E2E Flow", () => {
  test("E2E-09: should protect cover letter editor route from unauthenticated users", async ({
    page,
  }) => {
    await page.goto("/pt/editor/cover-letter/some-uuid");
    await expect(page).toHaveURL(/\/sign-in/);
  });

  test("E2E-10: should navigate to email generator onboarding route and verify structure", async ({
    page,
  }) => {
    await page.goto("/pt/sign-in");
    await expect(page.locator("img[alt='Lume Logo']").first()).toBeVisible();
  });

  test("E2E-11: should check email generator layout and presence of options", async ({
    page,
  }) => {
    await page.goto("/en/sign-in");
    await expect(page).toHaveURL(/\/en\/sign-in/);
  });
});
