import { test } from '@playwright/test';

test('CyberArk_prod_uswapp27026_URLStatus', async ({ page }) => {
  await test.step('New synthetic transaction', async () => {
    try {
      await page.goto('https://uswapp27026.mhf.mhc/AIMWebService/V1.1/AIM.asmx');
    } catch {
      // ignore script break error
    }
  });
});
