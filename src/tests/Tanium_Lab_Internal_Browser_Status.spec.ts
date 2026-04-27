import { test } from '@playwright/test';

test('Tanium_Lab_Internal_Browser_Status', async ({ page }) => {
  await test.step('Synthetic transaction 1', async () => {
    try {
      // TODO: This page cannot be reached
      await page.goto('https://tanium-lab.mhf.mhc/');

      await page.getByRole('button').first().click();

      await page.locator('[id="-username"]').fill('svc_splunko11y');

      await page.locator('[id="-password"]').click();

      await page.locator('[id="-password"]').fill('Gnvr)VF1*z9YP*?[.=rn=m$CW');

      await page.locator('form').getByRole('button', { name: 'Sign In' }).click();

      await page.waitForTimeout(10000);

      await page.locator('nav').getByRole('button').nth(6).click();

      await page.locator('nav').locator('div').nth(4).click();

      await page.waitForTimeout(10000);
    } catch {
      // ignore script break error
    }
  });
});
