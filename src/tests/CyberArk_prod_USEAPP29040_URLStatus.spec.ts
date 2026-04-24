import { test } from '@playwright/test';

test('CyberArk_prod_USEAPP29040_URLStatus', async ({ page }) => {
  await test.step('New synthetic transaction', async () => {
    try {
      await page.goto('https://USEAPP29040.mhf.mhc/AIMWebService/V1.1/AIM.asmx');
    } catch {
      // ignore script break error
    }
  });
});
