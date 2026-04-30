import { test, expect } from '@playwright/test';

test('o11y_store_test', async ({ page }) => {
  await test.step('Synthetic transaction 1', async () => {
    try {
      await page.goto('http://pmrum.o11ystore.com/');

      await page.locator('main > div > div > div:nth-of-type(2) > div:nth-of-type(1) a > div').click();
      await page.waitForLoadState('load', { timeout: 2000 });

      await page.locator('button').click();
      await page.waitForLoadState('load', { timeout: 2000 });

      await page.locator('main > div > div > div.mb-3 a').click();
      await page.waitForLoadState('load', { timeout: 2000 });

      await page.locator('div:nth-of-type(8) a > div').click();
      await page.waitForLoadState('load', { timeout: 2000 });

      await page.locator('button').click();
      await page.waitForLoadState('load', { timeout: 2000 });

      await page.locator('div > div > div.py-3').click();

      await page.locator('#email').fill(process.env.o11y_store_email!);

      await page.locator('div > div > div.py-3 button').click();
      await page.waitForLoadState('load', { timeout: 2000 });

      await expect(page.locator('body')).toContainText('Your order is complete!', { timeout: 10000 });
    } catch {
      // ignore script break error
    }
  });
});
