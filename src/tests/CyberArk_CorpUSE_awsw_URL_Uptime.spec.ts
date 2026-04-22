import { test, expect } from '@playwright/test';

test('CyberArk_CorpUSE_awsw_URL_Uptime', async ({ page }) => {
  await test.step('New synthetic transaction', async () => {
    await page.goto('https://awsw.ccp.spglobal.com/AIMWebService/V1.1/AIM.asmx');
  });
});
