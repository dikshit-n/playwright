/**
 * gcp-metrics-reporter.ts
 *
 * A custom Playwright reporter that converts test results into a structure that
 * matches (as closely as possible without a live GCP project) the Cloud Monitoring
 * TimeSeries write request format.
 *
 * IMPORTANT: This reporter does NOT call any GCP API. It writes JSON files to
 * ./metrics-output/ so you can inspect what *would* be sent.
 *
 * Official API reference for the real implementation:
 * https://cloud.google.com/monitoring/api/ref_v3/rest/v3/projects.timeSeries/create
 *
 * Metric design (two custom metrics per test):
 *  1. custom.googleapis.com/playwright/test_duration_ms
 *       Type: GAUGE (instantaneous measurement — how long the test took)
 *       Labels: test_name, test_suite, browser, status
 *
 *  2. custom.googleapis.com/playwright/test_result
 *       Type: GAUGE, value 1 = pass / 0 = fail / -1 = skipped
 *       Labels: test_name, test_suite, browser, status
 *
 * Why two metrics? Cloud Monitoring best practice is to keep numeric measurements
 * (duration) separate from enumerated state (pass/fail) so you can alert on each
 * independently.
 */

import type {
  Reporter,
  Suite,
  TestCase,
  TestResult,
} from '@playwright/test/reporter';
import * as fs from 'fs';
import * as path from 'path';

// ─── Types ────────────────────────────────────────────────────────────────────

/**
 * Minimal representation of a GCP TimeSeries object.
 * Field names are taken from the official REST reference above.
 * Fields marked // VERIFY should be double-checked against the live API docs
 * before using in production.
 */
interface GcpTimeSeries {
  metric: {
    type: string;          // e.g. "custom.googleapis.com/playwright/test_duration_ms"
    labels: Record<string, string>; // string key/value pairs, max 10 labels per metric
  };
  resource: {
    type: string;          // "global" is the simplest monitored resource type // VERIFY against https://cloud.google.com/monitoring/api/resources
    labels: {
      project_id: string;  // your GCP project ID would go here
    };
  };
  metricKind: 'GAUGE' | 'CUMULATIVE' | 'DELTA'; // VERIFY field name casing
  valueType: 'INT64' | 'DOUBLE' | 'BOOL' | 'STRING'; // VERIFY
  points: Array<{
    interval: {
      endTime: string;     // RFC 3339 format, e.g. "2024-01-15T10:30:00Z"
      // For GAUGE metrics, startTime equals endTime. // VERIFY
    };
    value: {
      int64Value?: string; // GCP uses string for int64 to avoid JS precision loss // VERIFY
      doubleValue?: number;
    };
  }>;
}

interface GcpTimeSeriesPayload {
  // This is the body of a projects.timeSeries.create request
  // https://cloud.google.com/monitoring/api/ref_v3/rest/v3/projects.timeSeries/create
  timeSeries: GcpTimeSeries[];
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function toRfc3339(date: Date): string {
  return date.toISOString(); // ISO 8601 / RFC 3339 compatible
}

function statusToInt(status: TestResult['status']): number {
  switch (status) {
    case 'passed':  return 1;
    case 'failed':  return 0;
    case 'skipped': return -1;
    case 'timedOut': return 0; // treat timeout like failure for metrics
    case 'interrupted': return -1;
    default: return -1;
  }
}

/**
 * Sanitise a test title so it's safe to use as a GCP metric label value.
 * Labels must be ≤ 1024 chars; characters outside [a-zA-Z0-9_] replaced with _.
 */
function sanitiseLabel(value: string): string {
  return value.replace(/[^a-zA-Z0-9_]/g, '_').slice(0, 256);
}

// ─── Reporter class ───────────────────────────────────────────────────────────

class GcpMetricsReporter implements Reporter {
  // Accumulate all time series across every test so we write one file per run.
  private allTimeSeries: GcpTimeSeries[] = [];
  private outputDir = path.join(process.cwd(), 'src/metrics-output');

  // Called once when Playwright starts; Suite is the root.
  onBegin(_config: unknown, suite: Suite) {
    console.log(
      `\n[GCP Reporter] Run started. ${suite.allTests().length} tests queued.\n`
    );
    // Ensure output directory exists.
    fs.mkdirSync(this.outputDir, { recursive: true });
  }

  // Called after every individual test finishes.
  onTestEnd(test: TestCase, result: TestResult) {
    const endTime = new Date(result.startTime.getTime() + result.duration);
    const endTimeStr = toRfc3339(endTime);

    // Labels shared by both metrics for this test.
    const labels: Record<string, string> = {
      test_name:  sanitiseLabel(test.title),
      // test.titlePath() returns [file, describe-block, test-title] hierarchy.
      test_suite: sanitiseLabel(test.titlePath()[0] ?? 'unknown'),
      browser:    sanitiseLabel(test.parent?.project()?.name ?? 'chromium'),
      status:     result.status,
    };

    // ── Metric 1: duration ──────────────────────────────────────────────────
    const durationSeries: GcpTimeSeries = {
      metric: {
        type: 'custom.googleapis.com/playwright/test_duration_ms',
        labels,
      },
      resource: {
        type: 'global', // simplest resource type for custom metrics // VERIFY
        labels: {
          project_id: 'YOUR_GCP_PROJECT_ID', // replace before real use
        },
      },
      metricKind: 'GAUGE',
      valueType: 'INT64',
      points: [
        {
          interval: { endTime: endTimeStr },
          // int64Value must be a string in GCP's JSON encoding. // VERIFY
          value: { int64Value: String(Math.round(result.duration)) },
        },
      ],
    };

    // ── Metric 2: pass/fail result ──────────────────────────────────────────
    const resultSeries: GcpTimeSeries = {
      metric: {
        type: 'custom.googleapis.com/playwright/test_result',
        labels,
      },
      resource: {
        type: 'global', // VERIFY
        labels: { project_id: 'YOUR_GCP_PROJECT_ID' },
      },
      metricKind: 'GAUGE',
      valueType: 'INT64',
      points: [
        {
          interval: { endTime: endTimeStr },
          value: { int64Value: String(statusToInt(result.status)) },
        },
      ],
    };

    this.allTimeSeries.push(durationSeries, resultSeries);

    // Live console log so you can watch metrics form in real time.
    console.log(
      `[GCP Reporter] ${result.status.toUpperCase().padEnd(10)} ` +
      `"${test.title}" | ${Math.round(result.duration)} ms`
    );
  }

  // Called once after all tests finish.
  onEnd() {
    const payload: GcpTimeSeriesPayload = {
      timeSeries: this.allTimeSeries,
    };

    // Write the full run payload (what would be sent to Cloud Monitoring).
    const runFile = path.join(
      this.outputDir,
      `gcp-timeseries-${Date.now()}.json`
    );
    fs.writeFileSync(runFile, JSON.stringify(payload, null, 2));

    // Also write a human-friendly summary.
    const summary = this.allTimeSeries
      .filter(ts => ts.metric.type.endsWith('test_duration_ms'))
      .map(ts => ({
        test:     ts.metric.labels['test_name'],
        status:   ts.metric.labels['status'],
        duration: ts.points[0]?.value.int64Value + ' ms',
      }));

    const summaryFile = path.join(this.outputDir, 'summary.json');
    fs.writeFileSync(summaryFile, JSON.stringify(summary, null, 2));

    console.log(`\n[GCP Reporter] Simulated payload written to:`);
    console.log(`  ${runFile}`);
    console.log(`  ${summaryFile}`);
    console.log(
      `\n[GCP Reporter] In production, POST the timeSeries payload to:\n` +
      `  https://monitoring.googleapis.com/v3/projects/{PROJECT_ID}/timeSeries\n` +
      `  (requires @google-cloud/monitoring SDK and ADC credentials)\n` +
      `  // VERIFY against https://cloud.google.com/monitoring/api/ref_v3/rest/v3/projects.timeSeries/create\n`
    );
  }
}

// Playwright loads the default export from a reporter file.
export default GcpMetricsReporter;
