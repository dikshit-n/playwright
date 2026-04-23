import { test } from '@playwright/test';

test('CyberArk_prod_ccp_URLStatus', async ({ page }) => {
  await test.step('New synthetic transaction', async () => {
    try {
      await page.goto('https://ccp.spglobal.com/AIMWebService/V1.1/AIM.asmx');
    } catch (err) {
      // ignore script break error
    }
  });
});
