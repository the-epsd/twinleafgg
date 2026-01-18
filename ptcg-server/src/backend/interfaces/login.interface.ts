export interface ServerConfig {
  apiVersion: number;
  defaultPageSize: number;
  scansUrl: string;
  avatarsUrl: string;
  sleevesUrl: string;
  avatarFileSize: number;
  avatarMinSize: number;
  avatarMaxSize: number;
  replayFileSize: number;
  refreshTokenInterval: number;
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
