export interface ServerConfig {
  apiVersion: number;
  defaultPageSize: number;
  scansUrl: string;
  replayFileSize: number;
  refreshTokenInterval: number;
  board3dWhitelist: string[];
}
