import { expect, test } from "@playwright/test";

test.describe("PDF Generation and Downloads", () => {
  test("should render public preview document successfully", async ({
    page,
  }) => {
    await page.goto("/pt/share/demo");
    await expect(page.locator("body")).toBeVisible();
  });
});
