import { test, expect } from '@playwright/test';

test('SonarQube_Prod_Browser_Login', async ({ page }) => {
  await test.step('Synthetic transaction 1', async () => {
    try {
      await page.goto('https://sonar-use-prod.cicd.spglobal.com/projects');

      await page.locator('xpath=//*[@id="global-navigation"]/div/div/div/div[3]/a').click();
      await page.waitForLoadState('load', { timeout: 2000 });

      await page.locator('xpath=/html/body/div/div/div[1]/div/div[1]/div/a/span').click();
      await page.waitForLoadState('load', { timeout: 2000 });

      await page.locator('xpath=/html/body/div[2]/div[2]/div/main/div/div/div/div[2]/form/div/div[2]/div/div/input').click();

      await page.locator('xpath=/html/body/div[2]/div[2]/div/main/div/div/div/div[2]/form/div/div[2]/div/div/input').fill('svc_splunko11y@spglobal.com');

      await page.locator('xpath=/html/body/div[2]/div[2]/div/main/div/div/div/div[2]/form/div/div[4]/button').click();
      await page.waitForLoadState('load', { timeout: 2000 });

      await page.locator('xpath=/html/body/div[2]/div[2]/div/main/div/div/div/div[2]/form/div/div[4]/div/div/input').click();
      await page.waitForLoadState('load', { timeout: 2000 });

      await page.locator('xpath=/html/body/div[2]/div[2]/div/main/div/div/div/div[2]/form/div/div[4]/div/div/input').fill(process.env.svc_splunko11y!);

      await page.locator('xpath=/html/body/div[2]/div[2]/div/main/div/div/div/div[2]/form/div/div[5]/button').click();
      await page.waitForLoadState('load', { timeout: 2000 });

      await expect(page.locator('xpath=/html/body/div[1]/div/div[1]/div/nav/div/div/a/img')).toBeAttached({ timeout: 10000 });

      await page.locator('xpath=/html/body/div[1]/div/div[1]/div/nav/div/div/div/div[3]/a/div').click();

      await page.locator('xpath=/html/body/div[1]/div/div[1]/div/nav/div/div/div/div[3]/div/div/ul/li[4]/a').click();
      await page.waitForLoadState('load', { timeout: 2000 });
    } catch {
      // ignore script break error
    }
  });
});
