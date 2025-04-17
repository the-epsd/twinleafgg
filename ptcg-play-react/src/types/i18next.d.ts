import 'i18next';

declare module 'i18next' {
  interface CustomTypeOptions {
    defaultNS: 'translation';
    resources: {
      translation: {
        login: {
          title: string;
          username: string;
          password: string;
          button: string;
        };
      };
    };
  }
} 