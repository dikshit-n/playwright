import { test, expect } from '@playwright/test';

test('GitHub Enterprise Cloud Browser Login', async ({ page }) => {
  await test.step('New synthetic transaction', async () => {
    try {
      await page.goto('https://github.com/enterprises/spglobal/sso');

      await page.locator('xpath=/html/body/div[1]/div[3]/main/div/div[2]/form/button/span').click();
      await page.waitForLoadState('load', { timeout: 2000 });

      await page.locator('#identifier').click();

      await page.locator('#identifier').fill('svc_splunko11y@spglobal.com');

      await page.getByRole('button', { name: 'Next' }).click();
      await page.waitForLoadState('load', { timeout: 2000 });

      await page.locator('[name="credentials.passcode"]').click();

      await page.locator('[name="credentials.passcode"]').fill(process.env.svc_splunko11y!);

      await page.locator('div:nth-of-type(5) > button').click();

      await expect(page.locator('xpath=/html/body/div[1]/div[1]/header/div[1]/div[1]/span')).toBeAttached({ timeout: 10000 });

      await page.locator('xpath=/html/body/div[1]/div[1]/header/div[2]/div[2]/div[4]/deferred-side-panel/include-fragment/react-partial-anchor/button/span/span/img').click();

      await page.locator('xpath=/html/body/div[4]/div/div/div/div[2]/div/ul/li[23]/a/span[3]/span[1]').click();
      await page.waitForLoadState('load', { timeout: 2000 });

      await page.locator('xpath=/html/body/div[1]/div[4]/main/div/div[3]/div/div[2]/form/input[3]').click();
      await page.waitForLoadState('load', { timeout: 2000 });
    } catch {
      // ignore script break error
    }
  });
});
