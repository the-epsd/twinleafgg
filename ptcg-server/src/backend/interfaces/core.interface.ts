import { Format, GamePhase } from '../../game';
import { PlayerStats } from '../../game/core/player-stats';
import { Rank } from './rank.enum';

export interface CustomAvatarInfo {
  face: string;
  hair: string;
  glasses: string;
  shirt: string;
  hat: string;
  accessory: string;
}

export interface PlayerInfo {
  clientId: number;
  name: string;
  prizes: number;
  deck: number;
}

export interface GameInfo {
  gameId: number;
  phase: GamePhase;
  turn: number;
  activePlayer: number;
  players: PlayerInfo[];
}

export interface ClientInfo {
  clientId: number;
  userId: number;
}

export interface CoreInfo {
  clientId: number;
  clients: ClientInfo[];
  users: UserInfo[];
  games: GameInfo[];
}

export interface GameState {
  gameId: number;
  stateData: string;
  clientIds: number[];
  timeLimit: number;
  recordingEnabled: boolean;
  playerStats: PlayerStats[];
  format?: Format;
}

export interface UserInfo {
  userId: number;
  name: string;
  email: string;
  connected: boolean;
  registered: number;
  lastSeen: number;
  ranking: number;
  rank: Rank;
  lastRankingChange: number;
  avatarFile: string;
  roleId: number;
  customAvatar?: CustomAvatarInfo;
}
