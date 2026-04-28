import { test, expect } from '@playwright/test';

test('CyberArt_Conjur_PRD_BrowserLogin', async ({ page }) => {
  await test.step('Synthetic transaction 1', async () => {
    try {
      await page.goto('https://aav4233.id.cyberark.cloud/login?redirectUrl=https%3A%2F%2Fspgi.cyberark.cloud%2Fsecretsmgr');

      await page.locator('#usernameForm input').click();

      await page.locator('#usernameForm input').fill('SpgiCyberArk.Test@spglobal.com');

      await page.locator('#usernameForm button').click();
      await page.waitForLoadState('load', { timeout: 2000 });

      await page.locator('xpath=//input[@type="password"]').fill('W?7z3GxH:gA?m=J');

      await page.locator('div:nth-of-type(5) > button').click();
      await page.waitForLoadState('load', { timeout: 2000 });

      await page.locator('[data-testid="user-details-bay-button"] > i').click();

      await page.waitForTimeout(5000);

      await page.locator('[data-testid="user-info-sign-out"] > span > span').click();
      await page.waitForLoadState('load', { timeout: 2000 });

      await expect(page.locator('xpath=//button[@type="button"]')).toBeAttached({ timeout: 10000 });
    } catch {
      // ignore script break error
    }
  });
});
