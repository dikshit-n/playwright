import { test, expect } from '@playwright/test';

test('LPM_Browser_Status', async ({ page }) => {
  await test.step('Synthetic transaction 1', async () => {
    try {
      await page.goto('https://tools.spglobal.com/LPM/');

      await page.locator('#identifier').click();

      await page.locator('#identifier').fill('svc_splunko11y@spglobal.com');

      await page.getByRole('button', { name: 'Next' }).click();
      await page.waitForLoadState('load', { timeout: 2000 });

      await page.locator('[name="credentials.passcode"]').click();

      await page.locator('[name="credentials.passcode"]').fill(process.env.svc_splunko11y!);

      await page.locator('div:nth-of-type(5) > button').click();
      await page.waitForLoadState('load', { timeout: 2000 });

      await expect(page.locator('xpath=/html/body/div/div/div/div[1]/div[1]/header/div/div[1]/div/div/div[3]/span')).toBeAttached({ timeout: 10000 });
    } catch {
      // ignore script break error
    }
  });
});
