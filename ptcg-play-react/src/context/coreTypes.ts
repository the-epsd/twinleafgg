import type { UserInfo } from 'ptcg-server';

export interface ClientUserData {
  clientId: number;
  user: UserInfo;
}
