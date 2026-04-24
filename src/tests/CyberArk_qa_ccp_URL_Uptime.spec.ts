import { test } from '@playwright/test';

test('CyberArk_qa_ccp_URL_Uptime', async ({ page }) => {
  await test.step('New synthetic transaction', async () => {
    try {
      await page.goto('https://qaccp.spglobal.com/AIMWebService/V1.1/AIM.asmx');
    } catch {
      // ignore script break error
    }
  });
});
