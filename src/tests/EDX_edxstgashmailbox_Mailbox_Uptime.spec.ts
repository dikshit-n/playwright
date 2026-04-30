import { test } from '@playwright/test';

test('EDX:edxstgashmailbox:Mailbox_Uptime', async ({ page }) => {
  await test.step('Synthetic transaction 1', async () => {
    try {
      await page.goto('https://edxstgashmailbox.mhf.mhc/mailbox/');

      await page.locator('tr:nth-of-type(3) input').fill('FTPMon');
      await page.waitForLoadState('load', { timeout: 2000 });

      await page.locator('tr:nth-of-type(6) input').fill('25FTPMon');
      await page.waitForLoadState('load', { timeout: 2000 });

      await page.locator('tr:nth-of-type(9) input').click();
      await page.waitForLoadState('load', { timeout: 2000 });

      const contentsFrame = page.frameLocator('[name="contents"]');

      await contentsFrame.locator('xpath=//a[contains(.,"Log Out")]').click();
    } catch {
      // ignore script break error
    }
  });
});
