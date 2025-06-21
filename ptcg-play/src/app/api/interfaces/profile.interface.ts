import { Response } from './response.interface';
import { UserInfo as UserInfoBase, MatchInfo } from 'ptcg-server';

export interface CustomAvatarInfo {
  face: string;
  hair: string;
  glasses: string;
  shirt: string;
  hat: string;
  accessory: string;
}

export type UserInfo = UserInfoBase & { customAvatar?: CustomAvatarInfo };

export interface ProfileResponse extends Response {
  user: UserInfo;
}

export interface MatchHistoryResponse extends Response {
  matches: MatchInfo[];
  users: UserInfo[];
  total: number;
}
