import { test, expect } from '@playwright/test';

test('CIQ Prod Performance Top 10 Health Check | DO NOT DELETE', async ({ page }) => {
  await test.step('New synthetic transaction', async () => {
    await page.goto('https://www.capitaliq.com');
  });
});
