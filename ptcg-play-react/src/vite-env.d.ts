/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string;
  readonly VITE_TIMEOUT_MS: string;
  readonly VITE_REFRESH_TOKEN_MS: string;
  readonly VITE_DEFAULT_PAGE_SIZE: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
