const { test, expect } = require('@playwright/test');

test('homepage has Playwright in title and get started link linking to the intro page', async ({ page }) => {
  await page.goto('http://localhost:3001/');

  await expect(page).toHaveTitle(/Teevittie/);
  const top = page.locator('.logo');
  await expect(top).toHaveText(/-ttie/);

  const buttons = page.locator('button');

  await buttons.nth(0).click();
  await expect(page).toHaveURL(/.*show/);
});
