export declare const config: {
    backend: {
        address: string;
        port: number;
        registrationEnabled: boolean;
        allowCors: boolean;
        tokenExpire: number;
        defaultPageSize: number;
        avatarsDir: string;
        avatarsUrl: string;
        avatarFileSize: number;
        avatarMinSize: number;
        avatarMaxSize: number;
        replayFileSize: number;
        rateLimitCount: number;
        rateLimitTime: number;
    };
    core: {
        debug: boolean;
        schedulerInterval: number;
        schedulerStartNextHour: boolean;
        rankingDecraseRate: number;
        rankingDecraseTime: number;
        rankingDecreaseIntervalCount: number;
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
