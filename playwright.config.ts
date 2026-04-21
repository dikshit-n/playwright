import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './src/tests',
  outputDir: './src/results',

  // Headed mode: you can watch every test run in a real browser window.
  // Flip to false for unattended / CI runs.
  use: {
    headless: false,
    browserName: 'chromium',
    // Slow-motion makes animations and clicks visible while watching.
    launchOptions: { slowMo: 300 },
    // Screenshots only on failure, so output stays clean.
    screenshot: 'only-on-failure',
    // Keep videos off to avoid large files during learning.
    video: 'off',
  },

  // Run tests sequentially so the headed browser is easy to follow.
  workers: 1,

  // Disable retries so each test result is deterministic for learning.
  retries: 0,

  // Built-in reporters:
  //   html  → src/report/index.html  (open with: npx playwright show-report)
  //   json  → src/output/results.json   (the raw shape documented in README)
  //   list  → live terminal output
  reporter: [
    ['list'],
    ['html', { outputFolder: './src/report', open: 'never' }],
    ['json', { outputFile: './src/output/results.json' }]
  ],

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
