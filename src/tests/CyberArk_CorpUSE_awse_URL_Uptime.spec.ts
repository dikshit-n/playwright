import { test } from '@playwright/test';

test('CyberArk_CorpUSE_awse_URL_Uptime', async ({ page }) => {
  await test.step('New synthetic transaction', async () => {
    try {
      await page.goto('https://awse.ccp.spglobal.com/AIMWebService/V1.1/AIM.asmx');
    } catch (err) {
      // ignore script break error
    }
  });
});
