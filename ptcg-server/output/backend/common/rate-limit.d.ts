export declare class RateLimit {
    private items;
    private static instance;
    static getInstance(): RateLimit;
    isLimitExceeded(ip: string): boolean;
    increment(ip: string): void;
    private deleteExpired;
}
