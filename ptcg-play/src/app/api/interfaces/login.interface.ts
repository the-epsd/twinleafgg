import { Response } from './response.interface';
import { ServerConfig } from 'ptcg-server';

export interface LoginResponse extends Response {
  token: string;
  config: ServerConfig;
  user?: {
    id: number;
    name: string;
    roleId: number;
  };
}

export interface InfoResponse extends Response {
  banned: string;
  config: ServerConfig;
}
