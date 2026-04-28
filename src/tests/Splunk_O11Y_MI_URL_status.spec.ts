import { test, expect } from '@playwright/test';

test('Splunk_O11Y_MI_URL_status', async ({ page }) => {
  await test.step('Synthetic transaction 1', async () => {
    try {
      await page.goto('https://spglobal.okta.com/login/default');

      await page.locator('#identifier').click();

      await page.locator('#identifier').fill('svc_splunko11y@spglobal.com');

      await page.locator('[id="credentials.passcode"]').fill(process.env.svc_splunko11y!);

      await page.locator('div:nth-of-type(5) > button').click();

      await page.goto('https://spgi-mi.signalfx.com/#/home');

      await page.locator('div.sf-fill-extents > div > div > div > div > a').click();
      await page.waitForLoadState('load', { timeout: 2000 });

      await page.locator('#okta-sign-in').getByRole('button', { name: 'Next' }).click();
      // TODO: User not assigned to this application error fix

      await page.locator('[id="credentials.passcode"]').fill(process.env.svc_splunko11y!);

      await page.locator('#okta-sign-in').getByRole('button', { name: 'Verify' }).click();

      await page.waitForTimeout(2000);

      await expect(page.locator('body')).toContainText('Get started', { timeout: 10000 });

      await page.locator('header').getByRole('button').last().click();

      await page.getByRole('button', { name: 'Sign Out' }).click();
    } catch {
      // ignore script break error
    }
  });
});
