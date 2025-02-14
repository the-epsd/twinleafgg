interface CPUMonitorOptions {
    logToConsole?: boolean;
    logToFile?: boolean;
    threshold?: number;
    logPath?: string;
}
export default class CPUMonitor {
    private startTime;
    private startUsage;
    private options;
    constructor(options?: CPUMonitorOptions);
    private getStackTrace;
    private captureHeapSnapshot;
    private logUsage;
    start(interval?: number): void;
}
export {};
