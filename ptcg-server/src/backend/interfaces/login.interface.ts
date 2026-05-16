export interface ServerConfig {
  apiVersion: number;
  defaultPageSize: number;
  scansUrl: string;
  replayFileSize: number;
  refreshTokenInterval: number;
  board3dWhitelist: string[];
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  serverPassword: string;
}

export interface LoginRequest {
  name: string;
  password: string;
}
