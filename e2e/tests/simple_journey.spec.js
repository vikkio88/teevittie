const { test, expect } = require('@playwright/test');

test('homepage to show journey', async ({ page }) => {
  await page.goto('http://localhost:3001/');

  await expect(page).toHaveTitle(/Teevittie/);
  const top = page.locator('.logo');
  await expect(top).toHaveText(/-ttie/);

  const buttons = page.locator('button');

  await buttons.nth(0).click();
  await expect(page).toHaveURL(/.*show/);
});
