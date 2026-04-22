import { test, expect } from '@playwright/test';

test('CyberArk_prod_USEAPP29039_URLStatus', async ({ page }) => {
  await test.step('New synthetic transaction', async () => {
    await page.goto('https://USEAPP29039.mhf.mhc/AIMWebService/V1.1/AIM.asmx');
  });
});
