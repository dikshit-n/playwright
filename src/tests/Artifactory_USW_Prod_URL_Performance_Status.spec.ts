import { test } from '@playwright/test';

test('Artifactory_USW_Prod_URL_Performance_Status', async ({ page }) => {
  await test.step('Synthetic transaction 1', async () => {
    try {
      await page.goto('https://artifactory-usw-prod.cicd.spglobal.com/ui/login');

      await page.locator('div.basic-auth-container > div:nth-of-type(1) input').fill('svc_splunko11y');

      await page.locator('div.basic-auth-container').locator('input[type="password"]').fill(process.env.svc_splunko11y!);

      await page.locator('div.el-p-form-item-button-container span').click();

      await page.locator('section:nth-of-type(2)').locator('div:nth-of-type(2) > div:nth-of-type(2) > div > div > div').click();
    } catch {
      // ignore script break error
    }
  });
});
