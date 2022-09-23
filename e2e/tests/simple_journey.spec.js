const { test, expect } = require('@playwright/test');

test('homepage to show to episode journey', async ({ page }) => {
  await page.goto('http://localhost:3001/');

  await expect(page).toHaveTitle(/Teevittie/);
  const top = page.locator('.logo');
  await expect(top).toHaveText(/-ttie/);

  const buttons = page.locator('button');

  await buttons.nth(0).click();
  await expect(page).toHaveURL(/.*show/);
  const seasons = page.locator('.SeasonHead');

  await expect(seasons).not.toHaveCount(0);
  let activeDropdowns = page.locator('.Episodes-active');
  await expect(activeDropdowns).toHaveCount(0);

  const firstSeason = seasons.nth(0);
  await firstSeason.click();
  activeDropdowns = page.locator('.Episodes-active');
  await expect(activeDropdowns).toHaveCount(1);

  const episodes = page.locator('.EpisodeItem-wrapper');
  await expect(episodes).not.toHaveCount(0);

  await page.locator('.EpisodeItem-wrapper button').nth(1).click();
  await expect(page).toHaveURL(/.*episode/);

  const video = page.locator('video');
  await expect(video).toBeVisible();
});
