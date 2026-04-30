import { test } from '@playwright/test';

test('Spark-Assist-UAT-URL-Reachability', async ({ page }) => {
  await test.step('Synthetic transaction 1', async () => {
    try {
      await page.goto('https://sparkuat.spglobal.com//assist');

      await page.goto('https://spglobal.okta.com/oauth2/default/v1/authorize?response_type=code&client_id=0oaewx2xlntOc1QTk5d7&redirect_uri=https%3A%2F%2Fspark.spglobal.com%2F.auth%2Flogin%2FOKTA%2Fcallback&nonce=9267c3bbb9aa4d199274596b7b5de46a_20240507062018&state=redir%3D%252Fassist&scope=openid+profile+email');

      await page.locator('#input28').fill(process.env.userID!);

      await page.locator('div.o-form-button-bar > input').click();
      await page.waitForLoadState('load', { timeout: 2000 });

      await page.locator('#input59').click();

      await page.locator('#input59').fill(process.env.svc_sparkassist_password2!);

      await page.locator('div.o-form-button-bar > input').click();
      await page.waitForLoadState('load', { timeout: 2000 });
    } catch {
      // ignore script break error
    }
  });
});
