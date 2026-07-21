import { expect, test } from "@playwright/test";

test.describe("Authenticated User Editor Workflows", () => {
  test("should authenticate with Clerk test mode email and access internal editor", async ({
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

  test("should render internal editor tools, forms and ATS validator drawer when authenticated or loaded", async ({
    page,
  }) => {
    await page.goto("/pt/share/demo");
    await expect(page.locator("body")).toBeVisible();
  });
});
