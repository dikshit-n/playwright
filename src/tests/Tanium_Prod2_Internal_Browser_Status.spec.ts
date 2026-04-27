import { test } from '@playwright/test';

test('Tanium_Prod2_Internal_Browser_Status', async ({ page }) => {
  await test.step('Synthetic transaction 1', async () => {
    try {
      await page.goto('https://tanium-prod2.mhf.mhc/');

      // TODO: fragile absolute XPath from Splunk — consider replacing with getByRole/getByText
      await page.locator('xpath=/html/body/div/div/div[2]/div/div/div[2]/div/button').click();

      await page.locator('[id="-username"]').fill('svc_splunko11y');

      await page.locator('[id="-password"]').click();

      await page.locator('[id="-password"]').fill('Gnvr)VF1*z9YP*?[.=rn=m$CW');

      // TODO: fragile absolute XPath from Splunk — consider replacing with getByRole/getByText
      await page.locator('xpath=/html/body/div/div/div[2]/div/div/div/form/div[1]/div[2]/div/div/div/div[3]/button/div').click();

      await page.waitForTimeout(10000);

      // TODO: fragile absolute XPath from Splunk — consider replacing with getByRole/getByText
      await page.locator('xpath=/html/body/div[1]/div/div[2]/div/div[1]/div[5]/div[2]/div/div/div[7]/button/div/div/div/div').click();

      // TODO: fragile absolute XPath from Splunk — consider replacing with getByRole/getByText
      await page.locator('xpath=/html/body/div[1]/div/div[2]/div/div[1]/div[5]/div[2]/div/div/div[7]/div/div/div[5]/div').click();

      await page.waitForTimeout(10000);
    } catch {
      // ignore script break error
    }
  });
});
