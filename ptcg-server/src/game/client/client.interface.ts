import { User } from '../../storage';
import { CoreClient } from './core-client.interface';
import { GameClient } from './game-client.interface';
import { MessageClient } from './message-client.interface';
import { Game } from '../core/game';
import { PlayerStats } from '../core/player-stats';

export interface Client extends CoreClient, GameClient, MessageClient {

  id: number;
  name: string;
  user: User;
  attachListeners?(): void;
  onTimerUpdate?(game: Game, playerStats: PlayerStats[]): void;
  onPlayerDisconnected?(game: Game, disconnectedClient: Client): void;
  onPlayerReconnected?(game: Game, reconnectedClient: Client): void;

}
