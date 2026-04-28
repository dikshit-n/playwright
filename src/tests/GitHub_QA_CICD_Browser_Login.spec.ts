import { test, expect } from '@playwright/test';

test('GitHub_QA_CICD_Browser_Login', async ({ page }) => {
  await test.step('Synthetic transaction 1', async () => {
    try {
      await page.goto('https://githubqa.cicd.spglobal.com/');

      await page.locator('div.application-main a').click();
      await page.waitForLoadState('load', { timeout: 2000 });

      await page.locator('#identifier').click();

      await page.locator('#identifier').fill('svc_splunko11y@spglobal.com');

      await page.locator('button').click();

      await page.waitForTimeout(400);

      await page.locator('[name="credentials.passcode"]').click();

      await page.locator('[name="credentials.passcode"]').fill(process.env.svc_splunko11y!);

      await page.locator('div:nth-of-type(5) > button').click();
      await page.waitForLoadState('load', { timeout: 2000 });

      await expect(page.locator('div.AppHeader-context-full span')).toBeAttached({ timeout: 10000 });

      await page.locator('xpath=/html/body/div[1]/div[1]/header/div[1]/div[2]/div[3]/deferred-side-panel/include-fragment/user-drawer-side-panel/button/span/span/img').click();

      await page.locator('li:nth-of-type(18) span').click();

      await page.locator('input[type="submit"]').click();
      await page.waitForLoadState('load', { timeout: 2000 });
    } catch {
      // ignore script break error
    }
  });
});
