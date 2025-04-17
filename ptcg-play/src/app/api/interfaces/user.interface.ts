import { UserInfo as ServerUserInfo } from 'ptcg-server';

export interface UserInfo extends ServerUserInfo {
  sleeveFile: string;
} 