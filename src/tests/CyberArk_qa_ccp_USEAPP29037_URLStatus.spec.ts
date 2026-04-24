import { test } from '@playwright/test';

test('CyberArk_qa_ccp_USEAPP29037_URLStatus', async ({ page }) => {
  await test.step('New synthetic transaction', async () => {
    try {
      await page.goto('https://USEAPP29037.mhf.mhc/AIMWebService/V1.1/AIM.asmx');
    } catch {
      // ignore script break error
    }
  });
});
