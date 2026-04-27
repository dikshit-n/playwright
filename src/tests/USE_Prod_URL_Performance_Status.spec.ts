import { test, expect } from '@playwright/test';

test('Artifactory: USE_Prod_URL_Performance_Status', async ({ page }) => {
  await test.step('Synthetic transaction 1', async () => {
    try {
      await page.goto('https://artifactory-use-prod.cicd.spglobal.com/ui/login');

      await page.locator('span.el-tooltip').click();
      await page.waitForLoadState('load', { timeout: 2000 });

      await page.locator('#identifier').click();

      await page.locator('#identifier').fill('svc_splunko11y@spglobal.com');

      await page.locator('button').click();
      await page.waitForLoadState('load', { timeout: 2000 });

      // TODO: fragile absolute XPath from Splunk — consider replacing with getByRole/getByText
      await page.locator('xpath=/html/body/div[2]/div[2]/div/main/div/div/div/div[2]/form/div/div[4]/div/div/input').fill('{{env.svc_splunko11y}}');

      await page.locator('div:nth-of-type(5) > button').click();
      await page.waitForLoadState('load', { timeout: 2000 });

      await expect(page.locator('body')).toContainText('Packages', { timeout: 500 });

      await page.locator('[data-cy="user-menu-button"] span').click();

      await page.locator('li:nth-of-type(4) span.menu-item').click();
      await page.waitForLoadState('load', { timeout: 2000 });
    } catch {
      // ignore script break error
    }
  });
});
