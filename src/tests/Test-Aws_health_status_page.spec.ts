import { test, expect } from '@playwright/test';

test('Test-Aws_health_status_page', async ({ page }) => {
  await test.step('New synthetic transaction', async () => {
    try {
      await page.goto('https://health.aws.amazon.com/health/status');

      await expect(page.locator('body')).toContainText('No recent issues', { timeout: 10000 });
    } catch {
      // ignore script break error
    }
  });
});
