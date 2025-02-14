export declare class RateLimit {
    private items;
    private static instance;
    private lastCleanup;
    private readonly CLEANUP_INTERVAL;
    static getInstance(): RateLimit;
    isLimitExceeded(ip: string): boolean;
    increment(ip: string): void;
    private cleanupIfNeeded;
}
