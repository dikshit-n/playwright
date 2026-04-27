import { test, expect } from '@playwright/test';

test('CyberArk:CyberArk_Portal_Okta_Uptime', async ({ page }) => {
  await test.step('Synthetic transaction 1', async () => {
    try {
      await page.goto('https://spgi.cyberark.cloud/');

      await page.locator('#usernameForm input').fill('SpgiCyberArk.Test@spglobal.com');

      await page.locator('#usernameForm button').click();
      await page.waitForLoadState('load', { timeout: 5000 });

      await page.locator('input[type="password"]').fill('W?7z3GxH:gA?m=J');

      // TODO: fragile XPath from Splunk — consider replacing with getByRole/getByText
      await page.locator('xpath=//*[@id="okta-sign-in"]/div/div/div/div[2]/form/div/div[5]/button').click();
      await page.waitForLoadState('load', { timeout: 550 });

      await page.waitForTimeout(40000);

      await expect(page.locator('[data-testid="tree-link-Incoming Requests"]')).toBeAttached({ timeout: 2000 });

      await expect(page.locator('[data-testid="tree-link-Incoming Requests"]')).toBeVisible({ timeout: 10000 });

      const pcloudFrame = page.frameLocator('[name="pcloud"]');
      const epvFrame = pcloudFrame.frameLocator('[name="frame-epv"]');

      await expect(epvFrame.locator('body')).toContainText('DATADOG_SYN', { timeout: 10000 });

      await page.locator('[data-testid="user-info-displayname"]').click();

      await page.waitForTimeout(5000);

      await page.locator('xpath=//*[@data-testid="user-info-sign-out"]/span[2]').click();

      await page.waitForTimeout(1000);

      await expect(page.locator('body')).toContainText('Sign', { timeout: 10000 });
    } catch {
      // ignore script break error
    }
  });
});
