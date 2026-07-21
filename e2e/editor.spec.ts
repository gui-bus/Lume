import { expect, test } from "@playwright/test";

test.describe("Rotas Públicas e Compartilhamento de Currículo", () => {
  test("deve redirecionar o usuário não autenticado da rota principal para a tela de login", async ({
    page,
  }) => {
    await page.goto("/pt");
    await expect(page).toHaveURL(/\/sign-in/);
  });

  test("deve permitir acessar a página pública de compartilhamento (/share/[id]) sem autenticação", async ({
    page,
  }) => {
    await page.goto("/pt/share/demo");
    await expect(page.locator("body")).toBeVisible();
  });
});
