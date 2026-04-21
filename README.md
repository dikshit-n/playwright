# playwright-gco-demo

A minimal learning artifact showing how Playwright test results can be captured,
shaped into GCP Cloud Monitoring TimeSeries objects, and (simulated) pushed to
Cloud Monitoring — so you can understand the Splunk → GCP synthetic-test
migration end-to-end.

---

## Quick start

```bash
# 1. Install dependencies (only @playwright/test — no GCP SDK)
npm install

# 2. Install Chromium (only — keeps download small)
npx playwright install chromium

# 3. Run tests in headed mode (you will see a browser window open)
npm test
# equivalent to: npx playwright test --headed

# 4. After the run, inspect results:
npx playwright show-report          # opens playwright-report/index.html
cat src/metrics-output/summary.json     # human-readable per-test summary
ls src/metrics-output/gcp-timeseries-*  # full simulated GCP payload(s)
```

---

## What the three tests do

| Test | Expected outcome | Why it exists |
|------|-----------------|---------------|
| `homepage title is correct` | PASS | Baseline healthy check — confirms the URL loads and the title is correct |
| `page contains expected text` | FAIL (intentional) | Simulates a broken SLO — text that doesn't exist on the page |
| `simulated slow synthetic check` | PASS, ~3 s | Produces a large `test_duration_ms` metric so you can see how latency shows up |

---

## What gets written to `metrics-output/`

After each run you will find:

```
src/metrics-output/
  results.json              ← raw Playwright JSON reporter output (see section below)
  summary.json              ← human-friendly per-test summary written by custom reporter
  gcp-timeseries-<ts>.json  ← simulated Cloud Monitoring TimeSeries payload
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

### Field → GCP metric mapping

| Playwright JSON field | GCP TimeSeries field | Notes |
|-----------------------|----------------------|-------|
| `specs[].title` | `metric.labels.test_name` | sanitised: non-alphanumeric → `_` |
| `suites[].title` | `metric.labels.test_suite` | usually the filename |
| `tests[].projectName` | `metric.labels.browser` | `chromium`, `firefox`, `webkit` |
| `results[].status` | `metric.labels.status` | raw string; also encoded as int |
| `results[].duration` | `metric.points[].value.int64Value` | metric type: `test_duration_ms` |
| `results[].status` (encoded) | `metric.points[].value.int64Value` | metric type: `test_result`; `passed=1`, `failed=0`, `skipped=-1` |
| `results[].startTime` + `duration` | `metric.points[].interval.endTime` | RFC 3339 |

---

## Why Playwright to replicate Splunk browser tests?

**Capabilities parity:** Splunk Synthetics' browser checks are built on Puppeteer
under the hood (as of 2023 documentation). Playwright offers a superset of those
capabilities: multi-step navigation, network interception, file upload, shadow DOM
selectors, and built-in `expect` assertions with automatic retries.

**Multi-browser without extra cost:** Playwright runs the same test script against
Chromium, Firefox, and WebKit with a single `projects` config block. Splunk
Synthetics charges per monitor execution; running against three browsers triples
the cost. With self-hosted Playwright the only cost is the machine time.

**Scriptability and version control:** Splunk Synthetics scripts live inside the
Splunk UI with limited version-control support. Playwright tests are plain
TypeScript files in a git repo — PRs, code review, and diff history are
first-class.

**Open-source vs lock-in:** Playwright is maintained by Microsoft and Apache-2.0
licensed. Your test code is portable: the same `.spec.ts` file runs locally, in
GitHub Actions, on any Linux box, and inside GCP Cloud Run Jobs. Splunk Synthetics
scripts are tied to Splunk's runtime — if you leave Splunk, the scripts are useless.

**Trace viewer and headed replay:** Playwright records a trace (network, DOM
snapshots, console) that you can replay locally with `npx playwright show-trace`.
Splunk provides video replay but it is locked behind the Splunk UI.

**Limitations to acknowledge:** Playwright requires you to manage your own
execution infrastructure (schedule, alerting, dashboards). Splunk Synthetics gives
you all of that out of the box. The migration cost is real: you gain flexibility
but give up the managed layer.

---

## Is Playwright something only GCP supports?

**No. Playwright is completely observability-backend agnostic.**

Playwright is a browser automation framework. It has no opinion about where
results go after a test run. The output is:

1. Exit code (0 = all pass, 1 = any failure) — consumed by any CI system.
2. JSON report (`--reporter=json`) — a plain file you parse yourself.
3. JUnit XML (`--reporter=junit`) — understood by Jenkins, Azure DevOps,
   GitHub Actions test summaries, etc.
4. HTML report — a self-contained viewer you open in any browser.

GCP does not "support" Playwright in any privileged sense. What GCP provides is:

- **Cloud Monitoring custom metrics** — an HTTP API that accepts any numeric
  time-series data. You can push Playwright durations to it the same way you
  would push application latency. [UNCERTAIN: GCP does not currently offer a
  first-party Playwright integration or a dedicated "synthetic monitoring via
  Playwright" product. Verify whether a managed offering has launched since
  this was written.]
- **Cloud Run Jobs / Cloud Scheduler** — a way to run Playwright on a cron
  schedule without managing VMs. [UNCERTAIN: pricing and region support for
  headed browser execution inside Cloud Run may have changed; verify before
  committing to this approach.]

The same Playwright tests could push metrics to:
- **Datadog** (via `dogstatsd` or the Datadog API)
- **Prometheus** (write a custom exporter, scrape with your Prometheus instance)
- **Grafana Cloud** (via the Grafana Faro SDK or plain HTTP to Mimir)
- **New Relic** (via New Relic's metric ingest API)
- **Any time-series database** (InfluxDB, VictoriaMetrics, etc.)

The custom reporter in this project (`reporters/gcp-metrics-reporter.ts`) is the
only GCP-specific piece, and it is ~100 lines. Swapping it for a Datadog reporter
requires changing only that file.

---

## Simulated GCP payload shape (3-line summary)

```jsonc
// Full body of a projects.timeSeries.create request
// POST https://monitoring.googleapis.com/v3/projects/{PROJECT_ID}/timeSeries
// VERIFY: https://cloud.google.com/monitoring/api/ref_v3/rest/v3/projects.timeSeries/create
{
  "timeSeries": [
    {
      "metric": {
        "type": "custom.googleapis.com/playwright/test_duration_ms",
        "labels": { "test_name": "homepage_title_is_correct__PASS_", "status": "passed", "browser": "chromium", "test_suite": "example_spec_ts" }
      },
      "resource": { "type": "global", "labels": { "project_id": "YOUR_GCP_PROJECT_ID" } },
      "metricKind": "GAUGE",
      "valueType": "INT64",
      "points": [{ "interval": { "endTime": "2024-01-15T10:30:01.823Z" }, "value": { "int64Value": "1823" } }]
    }
    // ... one duration series + one result series per test
  ]
}
```

Two time series per test: one for **duration** (INT64, milliseconds) and one for
**result** (INT64: 1=pass, 0=fail, -1=skip). Labels carry the test name, suite,
browser, and raw status string so you can filter in Cloud Monitoring.

---

## Files in this project

| File | Purpose |
|------|---------|
| `package.json` | npm manifest; only dependency is `@playwright/test` |
| `playwright.config.ts` | Test runner config: headed, slowMo, reporters |
| `src/tests/example.spec.ts` | Three synthetic-style tests: pass / fail / slow |
| `reporters/gcp-metrics-reporter.ts` | Custom reporter — converts results to GCP TimeSeries JSON |
| `src/metrics-output/` | Written at runtime; contains simulated GCP payloads and summary |
| `src/playwright-report/` | Written at runtime by built-in HTML reporter |
