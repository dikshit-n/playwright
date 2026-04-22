import { test, expect } from '@playwright/test';

test('CyberArk_CorpUSE_awse_URL_Uptime', async ({ page }) => {
  await test.step('New synthetic transaction', async () => {
    await page.goto('https://awse.ccp.spglobal.com/AIMWebService/V1.1/AIM.asmx');
  });
});
