import { test } from '@playwright/test';

test('CyberArk_prod_USWAPP27025_URLStatus', async ({ page }) => {
  await test.step('New synthetic transaction', async () => {
    try {
      await page.goto('https://USWAPP27025.mhf.mhc/AIMWebService/V1.1/AIM.asmx');
    } catch (err) {
      // ignore script break error
    }
  });
});
