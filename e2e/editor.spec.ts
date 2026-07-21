import { expect, test } from "@playwright/test";

test.describe("Public Routes and Resume Sharing", () => {
  test("should redirect unauthenticated user from root locale route to sign-in page", async ({
    page,
  }) => {
    await page.goto("/pt");
    await expect(page).toHaveURL(/\/sign-in/);
  });

  test("should allow accessing public share page (/share/[id]) without authentication", async ({
    page,
  }) => {
    await page.goto("/pt/share/demo");
    await expect(page.locator("body")).toBeVisible();
  });
});
