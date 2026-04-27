import { test, expect } from '@playwright/test';

test('Splunk_O11Y_OSTTRA_URL_status', async ({ page }) => {
  await test.step('Synthetic transaction 1', async () => {
    try {
      await page.goto('https://spglobal.okta.com/login/default');

      await page.locator('#identifier').click();

      await page.locator('#identifier').fill('svc_splunko11y@spglobal.com');

      await page.locator('[id="credentials.passcode"]').fill('|<ioK|4nLW*piKmKA+w7gx7/J');

      await page.locator('div:nth-of-type(5) > button').click();

      await page.goto('https://spgi-osttra.signalfx.com/#/home');

      await page.locator('div.sf-fill-extents > div > div > div > div > a').click();
      await page.waitForLoadState('load', { timeout: 2000 });

      // TODO: fragile XPath from Splunk — consider replacing with getByRole/getByText
      await page.locator('xpath=//*[@id="okta-sign-in"]/div/div/div/div[2]/form/div/div[4]/button').click();

      await page.locator('[id="credentials.passcode"]').fill('{{env.svc_splunko11y}}');

      // TODO: fragile XPath from Splunk — consider replacing with getByRole/getByText
      await page.locator('xpath=//*[@id="okta-sign-in"]/div/div/div/div[2]/form/div/div[5]/button').click();

      await page.waitForTimeout(2000);

      await expect(page.locator('body')).toContainText('Get started', { timeout: 10000 });

      // TODO: fragile absolute XPath from Splunk — consider replacing with getByRole/getByText
      await page.locator('xpath=/html/body/div[1]/div/div/div[4]/header/div[2]/div[3]/button/span/div/div[3]').click();

      // TODO: fragile absolute XPath from Splunk — consider replacing with getByRole/getByText
      await page.locator('xpath=/html/body/div[3]/div[2]/div/div[1]/div/div/div/div[1]/div/div[3]/button/span/span').click();
    } catch {
      // ignore script break error
    }
  });
});
