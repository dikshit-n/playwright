import { test } from '@playwright/test';

test('EWS O365 Browser Status', async ({ page }) => {
  await test.step('New synthetic transaction', async () => {
    try {
      await page.goto('https://ews.spglobal.com/ecp');

      await page.locator('#username').click();

      await page.locator('#username').clear();

      await page.locator('#username').fill('svc_splunko11y@spglobal.com');

      await page.locator('#password').click();

      await page.locator('#password').fill(process.env.svc_splunko11y!);

      await page.locator('div.logonContainer div.signInEnter span').click();
      await page.waitForLoadState('load', { timeout: 2000 });

      await page.locator('#nameDropDown td.EnabledButtonPart span').click();

      await page.locator('#nameDropDown_toolbar_UserName_DropDown span').click();
      await page.waitForLoadState('load', { timeout: 2000 });
    } catch {
      // ignore script break error
    }
  });
});
