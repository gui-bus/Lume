import { expect, test } from "@playwright/test";

test.describe("Public Routes, Navigation and Sharing", () => {
  test("should redirect unauthenticated users from root route to sign-in page", async ({
    page,
  }) => {
    await page.goto("/pt");
    await expect(page).toHaveURL(/\/sign-in/);
  });

  test("should load public share page without authentication", async ({
    page,
  }) => {
    await page.goto("/pt/share/demo");
    await expect(page.locator("body")).toBeVisible();
  });
});

test.describe("Editor Authentication and Navigation", () => {
  test("should render the sign-in page for unauthenticated access to editor", async ({
    page,
  }) => {
    await page.goto("/en/sign-in");
    await expect(page.locator("body")).toBeVisible();
    await expect(page).toHaveURL(/\/sign-in/);
  });
});
