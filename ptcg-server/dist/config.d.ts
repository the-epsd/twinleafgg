export declare const config: {
    backend: {
        address: string;
        port: number;
        allowCors: boolean;
        tokenExpire: number;
        defaultPageSize: number;
        replayFileSize: number;
        /** JSON body limit for /v1/replays only (base64 replay imports can exceed the general limit). */
        replayImportJsonBodyLimit: number;
        rateLimitCount: number;
        wsRateLimitCount: number;
        rateLimitTime: number;
        apiUrl: string;
        timeout: number;
        production: boolean;
        apiVersion: number;
        allowServerChange: boolean;
        enableImageCache: boolean;
    };
    core: {
        debug: boolean;
        schedulerInterval: number;
        schedulerStartNextHour: boolean;
        keepMatchTime: number;
        keepMatchIntervalCount: number;
        keepUserTime: number;
        keepUserIntervalCount: number;
    };
    bots: {
        defaultPassword: string;
        actionDelay: number;
        botGamesIntervalCount: number;
    };
    sets: {
        scansDir: string;
        scansUrl: string;
        imageProxyAllowedOrigins: string[];
    };
    email: {
        transporter: {
            sendmail: boolean;
            newline: string;
            path: string;
        };
        sender: string;
        appName: string;
        publicAddress: string;
    };
};
