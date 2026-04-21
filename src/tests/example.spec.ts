/**
 * Three synthetic-style tests that mirror the kind of checks a Splunk
 * Synthetic suite would run. Deliberately simple so you can read what
 * Playwright is doing while the headed browser plays back.
 *
 *  Test 1 – PASS : Verify Playwright's own demo site loads and shows a title.
 *  Test 2 – FAIL : Assert something we know is wrong (simulates a broken SLO).
 *  Test 3 – SLOW : Waits 3 s before asserting, so the duration metric is large.
 *
 * In a real Splunk → GCP migration these would be your SLO checks
 * (login flow, API health, checkout page), not toy assertions.
 */

import { test, expect } from '@playwright/test';

// ──────────────────────────────────────────────────────────────────
// Test 1: PASS — basic page-load check
// ──────────────────────────────────────────────────────────────────
test('homepage title is correct [PASS]', async ({ page }) => {
  // Playwright's public demo site; no auth, no flakiness.
  await page.goto('https://playwright.dev/');

  // The <title> tag contains "Playwright" — if this fails the site changed.
  await expect(page).toHaveTitle(/Playwright/);

  // Also verify the hero heading is visible (a real synthetic check pattern).
  const heading = page.getByRole('heading', { name: /Playwright enables reliable/ });
  await expect(heading).toBeVisible();
});

// ──────────────────────────────────────────────────────────────────
// Test 2: FAIL — intentional assertion failure (simulates a broken check)
// ──────────────────────────────────────────────────────────────────
test('page contains expected text [FAIL - intentional]', async ({ page }) => {
  await page.goto('https://playwright.dev/');

  // This text does NOT exist on the page — assertion will fail on purpose.
  // In a real migration this would represent a broken SLO check: something
  // on your production page that has gone missing.
  await expect(page.getByText('This text does not exist on the page')).toBeVisible({
    timeout: 3000, // Short timeout so we fail fast rather than hang.
  });
});

// ──────────────────────────────────────────────────────────────────
// Test 3: SLOW — artificial delay so the GCP duration metric is large
// ──────────────────────────────────────────────────────────────────
test('simulated slow synthetic check [SLOW]', async ({ page }) => {
  await page.goto('https://playwright.dev/');

  // Mimic a slow external dependency (e.g., a third-party widget timing out
  // then recovering). In Splunk Synthetics this shows up as high response time.
  // In GCP Monitoring it will appear as a high-value GAUGE data point.
  await page.waitForTimeout(3000); // intentional 3-second delay

  // The assertion itself is correct — the test should PASS, just slowly.
  await expect(page).toHaveTitle(/Playwright/);
});
