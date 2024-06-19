export const environment = {
  /**
   * Uncomment this for local dev
   */
  apiUrl: 'http://0.0.0.0:8080',

  /**
   * Uncomment this for prod
   */
  // apiUrl: 'https://play-server.twinleaf.gg',
  timeout: 10000 * 1000,
  production: false,
  apiVersion: 2,
  defaultPageSize: 50,
  allowServerChange: true,
  refreshTokenInterval: 60 * 60 * 1000,
  enableImageCache: false,
  defaultLanguage: 'en',
  languages: { en: 'English', jp: 'Japanese', fr: 'French' },
};