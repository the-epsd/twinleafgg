export declare class Scheduler {
    private static instance;
    private jobs;
    private timeoutRef;
    private intervalRef;
    static getInstance(): Scheduler;
    run(callback: Function, counter?: number): void;
    private startInterval;
    stop(callback: Function): void;
}
