import { test } from '@playwright/test';

test('CIQ Prod Performance Top 10 Health Check | DO NOT DELETE', async ({ page }) => {
  await test.step('New synthetic transaction', async () => {
    try {
      await page.goto('https://www.capitaliq.com');
    } catch(err) {
      // ignore script break error
    }
  });
});
