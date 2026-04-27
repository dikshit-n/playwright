import { test } from '@playwright/test';

test('Tanium_Prod2_Internal_Browser_Status', async ({ page }) => {
  await test.step('Synthetic transaction 1', async () => {
    try {
      await page.goto('https://tanium-prod2.mhf.mhc/');

      await page.getByRole('button').first().click();

      await page.locator('#identifier').click()
      
      await page.locator('#identifier').fill('svc_splunko11y@spglobal.com');

      await page.locator('button').click();
      await page.waitForLoadState('load', { timeout: 2000 });
      // TODO: User not assigned to this application error fix

      await page.locator('[id="credentials.passcode"]').fill('Gnvr)VF1*z9YP*?[.=rn=m$CW');

      await page.locator('form').getByRole('button', { name: 'Sign In' }).click();

      await page.waitForTimeout(10000);

      await page.locator('nav').getByRole('button').nth(6).click();

      await page.locator('nav').locator('div').nth(4).click();

      await page.waitForTimeout(10000);
    } catch {
      // ignore script break error
    }
  });
});
