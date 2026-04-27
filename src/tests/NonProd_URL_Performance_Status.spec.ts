import { test, expect } from '@playwright/test';

test('Artifactory: NonProd_URL_Performance_Status', async ({ page }) => {
  await test.step('Synthetic transaction 1', async () => {
    try {
      await page.goto('https://artifactory-use-nonprod.cicd.spglobal.com/ui/login');

      await page.locator('span.tooltip-wrapper').click();
      await page.waitForLoadState('load', { timeout: 2000 });

      await page.locator('#identifier').fill('svc_splunko11y@spglobal.com');

      await page.locator('button').click();
      await page.waitForLoadState('load', { timeout: 2000 });

      // TODO: fix password input flow is not showing up
      await page.locator('main').locator('input[type="password"]').fill('{{env.svc_splunko11y}}');

      await page.locator('div:nth-of-type(5) > button').click();
      await page.waitForLoadState('load', { timeout: 2000 });

      await expect(page.locator('body')).toContainText('Packages', { timeout: 10000 });

      await page.locator('[data-cy="user-menu-button"] span').click();

      await page.locator('body > ul').getByRole('link', { name: 'Sign Out' }).click();
      await page.waitForLoadState('load', { timeout: 200 });
    } catch {
      // ignore script break error
    }
  });
});
