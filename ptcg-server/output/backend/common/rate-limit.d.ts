export declare class RateLimit {
    private items;
    private static instance;
    static getInstance(): RateLimit;
    isLimitExceeded(ip: string, type?: 'http' | 'websocket'): boolean;
    increment(ip: string, type?: 'http' | 'websocket'): void;
    getCurrentCount(ip: string, type?: 'http' | 'websocket'): number;
    getRetryAfter(ip: string, type?: 'http' | 'websocket'): number;
    private deleteExpired;
}
