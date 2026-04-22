import { defineConfig, devices } from '@playwright/test';

const isHeaded = process.env.HEADED === 'true';

export default defineConfig({
  testDir: './src/tests',
  outputDir: './src/results',

  use: {
    headless: !isHeaded,
    browserName: 'chromium',
    launchOptions: { slowMo: isHeaded ? 300 : 0 },
    screenshot: 'only-on-failure',
    video: 'off',
  },

  // Sequential workers in headed mode so the browser is easy to follow;
  // parallel in headless for faster CI runs.
  workers: isHeaded ? 1 : undefined,

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
