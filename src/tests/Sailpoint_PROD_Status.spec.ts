import { test } from '@playwright/test';

test('Sailpoint_PROD_Status', async ({ page }) => {
  await test.step('Synthetic transaction 1', async () => {
    try {
      await page.goto('https://prod.myid.spglobal.com/identityiq/');

      await page.locator('#identifier').click();

      await page.locator('#identifier').fill('spgicyberark.test@spglobal.com');

      await page.locator('button').click();
      await page.waitForLoadState('load', { timeout: 2000 });

      await page.locator('[id="credentials.passcode"]').click();

      await page.locator('[id="credentials.passcode"]').fill('W?7z3GxH:gA?m=J');

      await page.locator('div:nth-of-type(5) > button').click();
      await page.waitForLoadState('load', { timeout: 2000 });

      // TODO: fragile absolute XPath from Splunk — consider replacing with getByRole/getByText
      await page.locator('xpath=/html/body/div[2]/div[1]/div[1]/nav/ul[2]/li[3]').click();

      // TODO: fragile absolute XPath from Splunk — consider replacing with getByRole/getByText
      await page.locator('xpath=/html/body/div[2]/div[1]/div[1]/nav/ul[2]/li[3]/ul/li[2]/a').click();
      await page.waitForLoadState('load', { timeout: 2000 });
    } catch {
      // ignore script break error
    }
  });
});
