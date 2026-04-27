import { test } from '@playwright/test';

test('Okta_Non_Prod_Internal_Preview_Dashboard_Uptime', async ({ page }) => {
  await test.step('Synthetic transaction 1', async () => {
    try {
      await page.goto('https://spglobal.oktapreview.com/login/default');

      await page.locator('[id="identifier"]').fill('datadogintdev@spglobal.com');
      await page.waitForLoadState('load', { timeout: 2000 });

      await page.locator('[id="credentials.passcode"]').fill('Jyd@j9edh2');
      await page.waitForLoadState('load', { timeout: 2000 });

      await page.locator('div:nth-of-type(5) > button').click();
      await page.waitForLoadState('load', { timeout: 2000 });

      await page.locator('o-dropdown-menu > div > button').click();
      await page.waitForLoadState('load', { timeout: 2000 });

      await page.locator('a.danger').click();
      await page.waitForLoadState('load', { timeout: 2000 });
    } catch {
      // ignore script break error
    }
  });
});
