export const config = {
    backend: {
        address: 'http://server.epsd.ca',
        port: 8080,
        registrationEnabled: true,
        allowCors: true,
        tokenExpire: 86400,
        defaultPageSize: 50,
        avatarsDir: '',
        avatarsUrl: '/avatars/{name}',
        avatarFileSize: 256 * 1024,
        avatarMinSize: 64,
        avatarMaxSize: 512,
        replayFileSize: 512 * 1024,
        rateLimitCount: 25,
        rateLimitTime: 300 // How long the user should be banned
    },
    core: {
        debug: false,
        // How often should we execute the background tasks
        schedulerInterval: 30 * 60 * 1000,
        // Wait till next hour before running tasks
        schedulerStartNextHour: false,
        // Decrease players' ranking every day
        // If you wish to disable this feature set IntervalCount to 0
        rankingDecraseRate: 0.975,
        rankingDecraseTime: 7 * 24 * 60 * 60 * 1000,
        rankingDecreaseIntervalCount: 2,
        // Deletes matches older than `keepMatchTike` from the database, to keep it small.
        // If you wish to disable this feature set IntervalCount to 0
        keepMatchTime: 14 * 24 * 60 * 60 * 1000,
        keepMatchIntervalCount: 1,
        // Deletes users that doesn't log in in the `keepUserTime` and their ranking is 0
        // If you wish to disable this feature set IntervalCount to 0
        keepUserTime: 14 * 24 * 60 * 60 * 1000,
        keepUserIntervalCount: 1
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
        scansUrl: '{cardImage}'
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
