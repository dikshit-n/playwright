# playwright-browser-testing

Splunk browser tests converted to manual playwright script

---

## Quick start

```bash
# 1. Install dependencies (only @playwright/test)
npm install

# 2. Install Chromium (only — keeps download small)
npx playwright install chromium

# 3. Run tests in headed mode (you will see a browser window open)
npm test
# equivalent to: npx playwright test --headed

# 4. Run tests in headless mode
npm run test:headless
# equivalent to: npx playwright test

# 5. After the run, inspect results:
npx playwright show-report          # opens report/index.html
```

## What gets written to `output/`

After each run you will find:

```
src/output/
  results.json              ← raw Playwright JSON reporter output (see section below)
```

---

## Playwright result format

Playwright's built-in `--reporter=json` writes a single JSON file.
The shape that matters for metric extraction:

```jsonc
{
  "suites": [
    {
      "title": "example.spec.ts",         // → metric label: test_suite
      "specs": [
        {
          "title": "homepage title is correct [PASS]", // → metric label: test_name
          "tests": [
            {
              "projectName": "chromium",   // → metric label: browser
              "results": [
                {
                  "status": "passed",       // "passed" | "failed" | "timedOut" | "skipped"
                  "duration": 1823,         // milliseconds → GAUGE value for test_duration_ms
                  "startTime": "2024-01-15T10:30:00.000Z",
                  "errors": []             // non-empty on failure
                }
              ]
            }
          ]
        }
      ]
    }
  ],
  "stats": {
    "expected": 2,
    "unexpected": 1,
    "duration": 8012      // total wall-clock ms for the whole run
  }
}
```
---

## Files in this project

| File | Purpose |
|------|---------|
| `package.json` | npm manifest; only dependency is `@playwright/test` |
| `playwright.config.ts` | Test runner config: headed, slowMo, reporters |
| `src/tests/` | manual tests |
| `src/output/` | Written at runtime; contains complete json data for test execution |
| `src/report/` | Written at runtime by built-in HTML reporter |
