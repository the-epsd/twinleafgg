/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string;
  readonly VITE_TIMEOUT_MS: string;
  readonly VITE_SHOW_FORMAT_UI: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
