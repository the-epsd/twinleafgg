export const config = {
    backend: {
        address: 'https://play-server.twinleaf.gg',
        port: 8080,
        allowCors: true,
        tokenExpire: 21600,
        defaultPageSize: 50,
        replayFileSize: 512 * 1024,
        /** JSON body limit for /v1/replays only (base64 replay imports can exceed the general limit). */
        replayImportJsonBodyLimit: 8 * 1024 * 1024,
        rateLimitCount: 10000,
        wsRateLimitCount: 10000,
        rateLimitTime: 60000,
        apiUrl: 'https://play-server.twinleaf.gg',
        timeout: 60 * 60 * 1000,
        production: true,
        apiVersion: 2,
        allowServerChange: true,
        enableImageCache: true,
    },
    core: {
        debug: false,
        // How often should we execute the background tasks
        schedulerInterval: 24 * 60 * 60 * 1000,
        // Wait till next hour before running tasks
        schedulerStartNextHour: false,
        // Deletes matches older than `keepMatchTike` from the database, to keep it small.
        // If you wish to disable this feature set IntervalCount to 0
        keepMatchTime: 14 * 24 * 60 * 60 * 1000,
        keepMatchIntervalCount: 0,
        // Deletes empty users that don't log in within `keepUserTime`.
        // If you wish to disable this feature set IntervalCount to 0
        keepUserTime: 14 * 24 * 60 * 60 * 1000,
        keepUserIntervalCount: 0
    },
    bots: {
        // Default password for bot user
        defaultPassword: 'bot',
        // Delay between every action that bot is making
        actionDelay: 1500,
        // Simulate matches every X ticks of the scheduler
        // If set to 0, the bot matches are disabled
        botGamesIntervalCount: 0,
    },
    sets: {
        scansDir: '',
        scansUrl: '{cardImage}',
        imageProxyAllowedOrigins: [
            'https://images.pokemontcg.io',
            'https://api.pokemontcg.io',
            'https://limitlesstcg.nyc3.cdn.digitaloceanspaces.com'
        ]
    },
    email: {
        transporter: {
            sendmail: true,
            newline: 'unix',
            path: '/usr/sbin/sendmail'
        },
        sender: 'no-reply@twinleaf.gg',
        appName: 'twinleaf',
        publicAddress: 'http://play.twinleaf.gg' // Address inside the e-mail messages
    }
};
