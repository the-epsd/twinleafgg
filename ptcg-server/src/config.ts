
export const config = {
  backend: {
    address: 'http://server.epsd.ca',
    port: 8080,
    registrationEnabled: true,  // Completly disables/enables registration
    allowCors: true,
    tokenExpire: 86400,
    defaultPageSize: 50,
    avatarsDir: '',
    avatarsUrl: '/avatars/{name}',
    avatarFileSize: 256 * 1024,
    avatarMinSize: 64,
    avatarMaxSize: 512,
    replayFileSize: 512 * 1024,
    rateLimitCount: 50, // Ban IP after that many wrong password errors
    rateLimitTime: 0 // How long the user should be banned
  },
  core: {
    debug: false,

    // How often should we execute the background tasks
    schedulerInterval: 60 * 60 * 1000,


    // Wait till next hour before running tasks
    schedulerStartNextHour: true,

    // Decrease players' ranking every day
    // If you wish to disable this feature set IntervalCount to 0
    rankingDecraseRate: 0.975, // 1 - 0.025 for 2.5% decrease
    rankingDecraseTime: 14 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
    rankingDecreaseIntervalCount: 1, // Check every scheduler tick

    // Deletes matches older than `keepMatchTike` from the database, to keep it small.
    // If you wish to disable this feature set IntervalCount to 0
    keepMatchTime: 31 * 24 * 60 * 60 * 1000,
    keepMatchIntervalCount: 0,  // run every X scheduler ticks

    // Deletes users that doesn't log in in the `keepUserTime` and their ranking is 0
    // If you wish to disable this feature set IntervalCount to 0
    keepUserTime: 7 * 24 * 60 * 60 * 1000,
    keepUserIntervalCount: 0  // run every X scheduler ticks
  },
  bots: {
    // Default password for bot user
    defaultPassword: 'bot',

    // Delay between every action that bot is making
    actionDelay: 2500,

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