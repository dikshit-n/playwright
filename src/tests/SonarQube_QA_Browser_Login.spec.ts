import { test, expect } from '@playwright/test';

test('SonarQube_QA_Browser_Login', async ({ page }) => {
  await test.step('Synthetic transaction 1', async () => {
    try {
      await page.goto('https://sonar-use-qa.cicd.spglobal.com/sessions/new?return_to=%2F');

      await page.waitForTimeout(200);

      await page.locator('span').click();
      await page.waitForLoadState('load', { timeout: 2000 });

      await page.locator('#identifier').click();

      await page.locator('#identifier').fill('svc_splunko11y@spglobal.com');

      await page.locator('button').click();
      await page.waitForLoadState('load', { timeout: 50 });

      await page.waitForTimeout(400);

      await page.locator('[name="credentials.passcode"]').click();

      await page.locator('[name="credentials.passcode"]').fill(process.env.svc_splunko11y!);

      await page.locator('div:nth-of-type(5) > button').click();
      await page.waitForLoadState('load', { timeout: 200 });

      await expect(page.locator('div.big-spacer-top > div:nth-of-type(1) > span')).toBeAttached({ timeout: 10000 });

      await page.locator('div.js-user-authenticated div').click();

      await page.locator('#global-navigation > div > div > div li:nth-of-type(4) > a').click();

      await page.goto('https://sonar-use-qa.cicd.spglobal.com/sessions/new?return_to=%2F');

      await page.goto('https://sonar-use-qa.cicd.spglobal.com/sessions/new?return_to=%2F');
    } catch {
      // ignore script break error
    }
  });
});
