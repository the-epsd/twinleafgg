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
    rateLimitCount: 10000,     // Increased from 100 to 1000 HTTP requests
    wsRateLimitCount: 10000,   // Increased from 200 to 2000 WebSocket messages
    rateLimitTime: 60000,     // Keeping this at 1 minute
    apiUrl: 'https://play-server.twinleaf.gg',
    timeout: 60 * 60 * 1000,
    production: true,
    apiVersion: 2,
    allowServerChange: true,
    refreshTokenInterval: 60 * 60 * 1000,
    enableImageCache: true,
  },
  core: {
    debug: false,

    // How often should we execute the background tasks
    schedulerInterval: 24 * 60 * 60 * 1000, // Run every 24 hours

    // Wait till next hour before running tasks
    schedulerStartNextHour: false, // Removed wait time

    // Deletes matches older than `keepMatchTike` from the database, to keep it small.
    // If you wish to disable this feature set IntervalCount to 0
    keepMatchTime: 14 * 24 * 60 * 60 * 1000, // Reduced to 14 days
    keepMatchIntervalCount: 0,

    // Deletes empty users that don't log in within `keepUserTime`.
    // If you wish to disable this feature set IntervalCount to 0
    keepUserTime: 14 * 24 * 60 * 60 * 1000, // Increased to 14 days
    keepUserIntervalCount: 0
  },
  bots: {
    // Default password for bot user
    defaultPassword: 'bot',

    // Delay between every action that bot is making
    actionDelay: 1500, // Reduced from 2500ms

    // Simulate matches every X ticks of the scheduler
    // If set to 0, the bot matches are disabled
    botGamesIntervalCount: 0,
  },
  reconnection: {
    // How long to preserve game state (5 minutes)
    preservationTimeoutMs: 5 * 60 * 1000,

    // Automatic reconnection attempts
    maxAutoReconnectAttempts: 3,

    // Intervals between reconnection attempts (5s, 10s, 15s)
    reconnectIntervals: [5000, 10000, 15000],

    // Connection health check interval (30 seconds)
    healthCheckIntervalMs: 30 * 1000,

    // Cleanup interval for expired sessions (1 minute)
    cleanupIntervalMs: 60 * 1000,

    // Maximum number of preserved sessions per user
    maxPreservedSessionsPerUser: 1,

    // Time before auto-forfeit when a player is disconnected (60 seconds; was 15s)
    disconnectForfeitMs: 60 * 1000
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
