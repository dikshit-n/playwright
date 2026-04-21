import { defineConfig, devices } from '@playwright/test';
import * as path from 'path';

export default defineConfig({
  testDir: './src/tests',
  outputDir: './src/test-results',

  // Headed mode: you can watch every test run in a real browser window.
  // Flip to false for unattended / CI runs.
  use: {
    headless: false,
    browserName: 'chromium',
    // Slow-motion makes animations and clicks visible while watching.
    launchOptions: { slowMo: 300 },
    // Screenshots only on failure, so metrics-output stays clean.
    screenshot: 'only-on-failure',
    // Keep videos off to avoid large files during learning.
    video: 'off',
  },

  // Run tests sequentially so the headed browser is easy to follow.
  workers: 1,

  // Disable retries so each test result is deterministic for learning.
  retries: 0,

  // Built-in reporters:
  //   html  → src/playwright-report/index.html  (open with: npx playwright show-report)
  //   json  → src/metrics-output/results.json   (the raw shape documented in README)
  //   list  → live terminal output
  reporter: [
    ['list'],
    ['html', { outputFolder: './src/playwright-report', open: 'never' }],
    ['json', { outputFile: './src/metrics-output/results.json' }],
    // Our custom GCP-simulation reporter (TypeScript compiled at runtime by Playwright).
    ['./src/reporters/gcp-metrics-reporter.ts'],
  ],

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
