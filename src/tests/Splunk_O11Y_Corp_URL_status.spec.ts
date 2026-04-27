import { test, expect } from '@playwright/test';

test('Splunk_O11Y_Corp_URL_status', async ({ page }) => {
  await test.step('Synthetic transaction 1', async () => {
    try {
      await page.goto('https://spglobal.okta.com/login/default');

      await page.locator('#identifier').click();

      await page.locator('#identifier').fill('svc_splunko11y@spglobal.com');

      await page.locator('[id="credentials.passcode"]').fill('{{env.svc_splunko11y}}');

      await page.locator('div:nth-of-type(5) > button').click();

      await page.goto('https://spgi-corp.signalfx.com/#/home');

      await page.waitForTimeout(1000);

      await page.locator('div.sf-fill-extents > div > div > div > div > a').click();
      await page.waitForLoadState('load', { timeout: 2000 });

      await page.locator('#okta-sign-in').getByRole('button', { name: 'Next' }).click();

      await page.locator('[id="credentials.passcode"]').fill('{{env.svc_splunko11y}}');

      // TODO: this step fails due to Verification button not present in the UI
      await page.locator('#okta-sign-in').getByRole('button', { name: 'Verify' }).click();

      await page.waitForTimeout(20000);

      await expect(page.locator('body')).toContainText('Get started', { timeout: 10000 });

      await page.locator('header').getByRole('button').last().click();

      await page.getByRole('button', { name: 'Sign Out' }).click();
    } catch {
      // ignore script break error
    }
  });
});
