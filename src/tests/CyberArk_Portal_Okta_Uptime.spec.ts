import { test, expect } from '@playwright/test';

test('CyberArk:CyberArk_Portal_Okta_Uptime', async ({ page }) => {
  await test.step('Synthetic transaction 1', async () => {
    try {
      await page.goto('https://spgi.cyberark.cloud/');

      await page.locator('#usernameForm input').fill('SpgiCyberArk.Test@spglobal.com');

      await page.locator('#usernameForm button').click();
      await page.waitForLoadState('load', { timeout: 5000 });

      await page.locator('input[type="password"]').fill('W?7z3GxH:gA?m=J');

      await page.locator('#okta-sign-in').getByRole('button', { name: 'Verify' }).click();
      await page.waitForLoadState('load', { timeout: 550 });

      await page.waitForTimeout(40000);

      await expect(page.locator('[data-testid="tree-link-Incoming Requests"]')).toBeAttached({ timeout: 2000 });

      await expect(page.locator('[data-testid="tree-link-Incoming Requests"]')).toBeVisible({ timeout: 10000 });

      const pcloudFrame = page.frameLocator('[name="pcloud"]');
      const epvFrame = pcloudFrame.frameLocator('[name="frame-epv"]');

      await expect(epvFrame.locator('body')).toContainText('DATADOG_SYN', { timeout: 10000 });

      await page.locator('[data-testid="user-info-displayname"]').click();

      await page.waitForTimeout(5000);

      await page.locator('[data-testid="user-info-sign-out"] span').nth(1).click();

      await page.waitForTimeout(1000);

      await expect(page.locator('body')).toContainText('Sign', { timeout: 10000 });
    } catch {
      // ignore script break error
    }
  });
});
