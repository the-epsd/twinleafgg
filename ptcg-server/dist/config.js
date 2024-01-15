export const config = {
    backend: {
        address: 'http://server.epsd.ca',
        port: 12021,
        serverPassword: '',
        registrationEnabled: true,
        allowCors: true,
        secret: '!secret!',
        tokenExpire: 86400,
        defaultPageSize: 50,
        avatarsDir: '',
        avatarsUrl: '/avatars/{name}',
        avatarFileSize: 256 * 1024,
        avatarMinSize: 64,
        avatarMaxSize: 512,
        replayFileSize: 512 * 1024,
        rateLimitCount: 50,
        rateLimitTime: 0 // How long the user should be banned
    },
    storage: {
        type: 'mysql',
        host: 'twinleaf-database-do-user-15340438-0.c.db.ondigitalocean.com',
        port: 25060,
        username: 'doadmin',
        password: 'AVNS_gV9gkMzg6MbbCdiSesR',
        database: 'ptcg'
    },
    core: {
        debug: false,
        // How often should we execute the background tasks
        schedulerInterval: 15 * 60 * 1000,
        // Wait till next hour before running tasks
        schedulerStartNextHour: true,
        // Decrease players' ranking every day by 0.95
        // If you wish to disable this feature set IntervalCount to 0
        rankingDecraseRate: 0.95,
        rankingDecraseTime: 24 * 60 * 60 * 1000,
        rankingDecreaseIntervalCount: 0,
        // Deletes matches older than `keepMatchTike` from the database, to keep it small.
        // If you wish to disable this feature set IntervalCount to 0
        keepMatchTime: 31 * 24 * 60 * 60 * 1000,
        keepMatchIntervalCount: 4,
        // Deletes users that doesn't log in in the `keepUserTime` and their ranking is 0
        // If you wish to disable this feature set IntervalCount to 0
        keepUserTime: 7 * 24 * 60 * 60 * 1000,
        keepUserIntervalCount: 4 // run every X scheduler ticks
    },
    bots: {
        // Default password for bot user
        defaultPassword: 'bot',
        // Delay between every action that bot is making
        actionDelay: 2500,
        // Simulate matches every X ticks of the scheduler
        // If set to 0, the bot matches are disabled
        botGamesIntervalCount: 60
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
        sender: 'example@example.com',
        appName: 'AAAAA',
        publicAddress: 'http://localhost' // Address inside the e-mail messages
    }
};
