import type {
  Reporter,
  Suite,
  TestCase,
  TestResult,
} from '@playwright/test/reporter';
import * as fs from 'fs';
import * as path from 'path';

interface CollectedData {
  test_name: string;
  browser: string;
  duration: string;
  status: "passed" | "failed" | "timedOut" | "skipped" | "interrupted";
  startTime: string;
  endTime: string;
}

type CollectedDataPayload = {
  data: CollectedData[];
}

// ─── Reporter class ───────────────────────────────────────────────────────────

class MetricsReporter implements Reporter {
  // Accumulate all time series across every test so we write one file per run.
  private allTimeSeries: CollectedData[] = [];
  private outputDir = path.join(process.cwd(), 'src/output');

  // Called once when Playwright starts; Suite is the root.
  onBegin(_config: unknown, suite: Suite) {
    console.log(
      `\n[Metrics Reporter] Run started. ${suite.allTests().length} tests queued.\n`
    );
    // Ensure output directory exists.
    fs.mkdirSync(this.outputDir, { recursive: true });
  }

  // Called after every individual test finishes.
  onTestEnd(test: TestCase, result: TestResult) {
    const startTime = new Date(result.startTime.getTime()).toISOString();
    const endTime = new Date(result.startTime.getTime() + result.duration).toISOString();

    const data: CollectedData = {
      test_name:  test.title,
      browser: test.parent?.project()?.name ?? 'chromium',
      duration: String(Math.round(result.duration)),
      status: result.status,
      startTime,
      endTime
    };

    console.log('\n[onTestEnd] Collected data: ', JSON.stringify(data, null, 2));

    this.allTimeSeries.push(data);
  }

  // Called once after all tests finish.
  onEnd() {
    const payload: CollectedDataPayload = {
      data: this.allTimeSeries,
    };

    const runFile = path.join(
      this.outputDir,
      `metrics-report.json`
    );
    fs.writeFileSync(runFile, JSON.stringify(payload, null, 2));

    const summaryFile = path.join(this.outputDir, 'summary.json');
    fs.writeFileSync(summaryFile, JSON.stringify(this.allTimeSeries, null, 2));

    console.log(`\n[Metrics Reporter] Simulated payload written to:`);
    console.log(`  ${runFile}`);
    console.log(`  ${summaryFile}`);
  }
}

// Playwright loads the default export from a reporter file.
export default MetricsReporter;
