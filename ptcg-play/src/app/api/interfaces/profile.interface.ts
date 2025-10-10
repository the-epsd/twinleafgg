import { Response } from './response.interface';
import { UserInfo as UserInfoBase, MatchInfo } from 'ptcg-server';

export type UserInfo = UserInfoBase;

export interface ProfileResponse extends Response {
  user: UserInfo;
}

export interface MatchHistoryResponse extends Response {
  matches: MatchInfo[];
  users: UserInfo[];
  total: number;
}
