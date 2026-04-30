import { test } from '@playwright/test';

test('Okta:Prod:Internal_Prod_Dashboard_Performance', async ({ page }) => {
  await test.step('Synthetic transaction 1', async () => {
    try {
      await page.goto('https://spglobal.okta.com/login/default');

      await page.locator('#identifier').fill('sys-datadog.okta@spglobal.com');

      await page.locator('[id="credentials.passcode"]').fill('6TwswzE@NwKs');

      await page.locator('div:nth-of-type(5) > button').click();
      await page.waitForLoadState('load', { timeout: 2000 });

      await page.locator('o-dropdown-menu > div > button').click();

      await page.locator('a.danger').click();
      await page.waitForLoadState('load', { timeout: 2000 });
    } catch {
      // ignore script break error
    }
  });
});
