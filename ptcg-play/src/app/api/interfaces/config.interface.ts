import { ServerConfig as ServerServerConfig } from 'ptcg-server';

export interface ServerConfig extends ServerServerConfig {
  sleevesUrl: string;
} 