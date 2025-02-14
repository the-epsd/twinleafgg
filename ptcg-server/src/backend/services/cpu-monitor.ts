// cpu-monitor.ts
import * as fs from 'fs';
import * as path from 'path';
import * as v8 from 'v8';

interface CPUMonitorOptions {
  logToConsole?: boolean;
  logToFile?: boolean;
  threshold?: number; // CPU usage threshold percentage to trigger detailed logging
  logPath?: string;
}

export default class CPUMonitor {
  private startTime: number = 0;
  private startUsage: NodeJS.CpuUsage;
  private options: CPUMonitorOptions;

  constructor(options: CPUMonitorOptions = {}) {
    this.options = {
      logToConsole: false,
      logToFile: false,
      threshold: 50, // Default threshold of 80%
      logPath: 'logs/cpu-profile.log',
      ...options
    };
    this.startUsage = process.cpuUsage();
  }

  private getStackTrace(): string {
    const err = new Error();
    const stack = err.stack || '';

    // Parse the stack trace to extract file information
    const stackLines = stack.split('\n').slice(1); // Skip first line (Error message)
    const parsedStack = stackLines.map(line => {
      const match = line.match(/at\s+(.*)\s+\((.*):(\d+):(\d+)\)/);
      if (match) {
        const [_, functionName, filePath, line] = match;
        // Get just the filename from the full path
        const fileName = path.basename(filePath);
        return `    at ${functionName} (${fileName}:${line})`;
      }
      return line;
    }).join('\n');

    return `Most Recent Files in Stack:\n${parsedStack}`;
  }

  private async captureHeapSnapshot(timestamp: string) {
    const snapshot = v8.getHeapSnapshot();
    const snapshotPath = path.join('logs', `heap-${timestamp}.heapsnapshot`);

    const writeStream = fs.createWriteStream(snapshotPath);
    snapshot.pipe(writeStream);
  }

  private logUsage() {
    const currentUsage = process.cpuUsage(this.startUsage);
    const elapsedTime = process.hrtime.bigint() - BigInt(this.startTime);
    const elapsedTimeInMs = Number(elapsedTime) / 1_000_000;

    // Calculate CPU usage percentage
    const totalUsage = (currentUsage.user + currentUsage.system) / 1000; // Convert to ms
    const cpuPercentage = (totalUsage / elapsedTimeInMs) * 100;

    const timestamp = new Date().toISOString();
    let logMessage = `[${timestamp}] CPU Usage: ${cpuPercentage.toFixed(2)}%`;

    // If CPU usage is above threshold, capture more details
    if (cpuPercentage > this.options.threshold!) {
      logMessage += '\nHigh CPU Usage Detected!';
      logMessage += `\nResponsible Stack (${cpuPercentage.toFixed(2)}% CPU):`;
      logMessage += '\n' + this.getStackTrace();

      // Capture memory usage
      const memoryUsage = process.memoryUsage();
      logMessage += '\nMemory Usage:';
      logMessage += `\n  RSS: ${(memoryUsage.rss / 1024 / 1024).toFixed(2)} MB`;
      logMessage += `\n  Heap Total: ${(memoryUsage.heapTotal / 1024 / 1024).toFixed(2)} MB`;
      logMessage += `\n  Heap Used: ${(memoryUsage.heapUsed / 1024 / 1024).toFixed(2)} MB`;

      // Capture heap snapshot for detailed analysis
      this.captureHeapSnapshot(timestamp.replace(/[:.]/g, '-'));
    }

    if (this.options.logToConsole) {
      console.log(logMessage);
    }

    if (this.options.logToFile) {
      const logDir = path.dirname(this.options.logPath!);
      if (!fs.existsSync(logDir)) {
        fs.mkdirSync(logDir, { recursive: true });
      }
      fs.appendFileSync(this.options.logPath!, logMessage + '\n\n');
    }

    // Reset for next interval
    this.startTime = Number(process.hrtime.bigint());
    this.startUsage = process.cpuUsage();
  }

  public start(interval: number = 60000) {
    this.startTime = Number(process.hrtime.bigint());
    setInterval(() => this.logUsage(), interval);
  }
}