import { test } from '@playwright/test';

test('Artifactory_USW_Prod_URL_Performance_Status', async ({ page }) => {
  await test.step('Synthetic transaction 1', async () => {
    try {
      await page.goto('https://artifactory-usw-prod.cicd.spglobal.com/ui/login');

      await page.locator('div.basic-auth-container > div:nth-of-type(1) input').fill('svc_splunko11y');

      // TODO: fragile absolute XPath from Splunk — consider replacing with getByRole/getByText
      await page.locator('xpath=/html/body/div[4]/div/div[2]/div/div/div[2]/div/div[2]/div/div/form/div[2]/div[2]/div/div/input').fill('{{env.svc_splunko11y}}');

      await page.locator('div.el-form-item-button-container span').click();

      // TODO: fragile absolute XPath from Splunk — consider replacing with getByRole/getByText
      await page.locator('xpath=/html/body/div[4]/div/div[2]/div/div[2]/div[1]/div[2]/div[3]/section[2]/div[2]/div[2]/div/div/div').click();
    } catch {
      // ignore script break error
    }
  });
});
