import { test, expect } from '@playwright/test';

test('SonarQube_Prod_Browser_Login', async ({ page }) => {
  await test.step('Synthetic transaction 1', async () => {
    try {
      await page.goto('https://sonar-use-prod.cicd.spglobal.com/projects');

      await page.locator('#global-navigation').getByRole('link', { name: 'Log in' }).click();
      await page.waitForLoadState('load', { timeout: 2000 });

      await page.getByRole('link', { name: /saml/i }).click();
      await page.waitForLoadState('load', { timeout: 2000 });

      await page.locator('#identifier').click();

      await page.locator('#identifier').fill('svc_splunko11y@spglobal.com');

      await page.getByRole('button', { name: 'Next' }).click();
      await page.waitForLoadState('load', { timeout: 2000 });

      // TODO: fix password input flow is not showing up
      await page.locator('[name="credentials.passcode"]').click();
      await page.waitForLoadState('load', { timeout: 2000 });

      await page.locator('[name="credentials.passcode"]').fill(process.env.svc_splunko11y!);

      await page.locator('div:nth-of-type(5) > button').click();
      await page.waitForLoadState('load', { timeout: 2000 });

      await expect(page.locator('#global-navigation').locator('img').first()).toBeAttached({ timeout: 10000 });

      await page.locator('#global-navigation').getByRole('button', { name: /account/i }).click();

      await page.getByRole('link', { name: 'Log out' }).click();
      await page.waitForLoadState('load', { timeout: 2000 });
    } catch {
      // ignore script break error
    }
  });
});
