import { test } from '@playwright/test';

test('EDX:edxmailbox:Mailbox_Uptime', async ({ page }) => {
  await test.step('Synthetic transaction 1', async () => {
    try {
      await page.goto('https://edxmailbox.mhf.mhc/mailbox/jsp/MBILogin');

      await page.goto('https://edxmailbox.mhf.mhc/mailbox/jsp/login.jsp');

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
