import { Core } from '../core/core';
import { Game } from '../core/game';
import { Player } from '../store/state/player';
import { Socket } from 'socket.io';
import { User } from '../../storage';
import { CoreClient } from './core-client.interface';
import { GameClient } from './game-client.interface';
import { MessageClient } from './message-client.interface';

export interface Client extends CoreClient, GameClient, MessageClient {

  id: number;
  name: string;
  user: User;
  core: Core | undefined;
  games: Game[];
  socket?: Socket;
  onConnect(client: Client): void;
  onDisconnect(client: Client): void;
  onGameAdd(game: Game): void;
  onGameDelete(game: Game): void;
  onGameJoin(game: Game, client: Client): void;
  onGameLeave(game: Game, client: Client): void;
  onUsersUpdate(users: User[]): void;
  onPlayerDisconnect(game: Game, player: Player): void;
  onPlayerReconnect(game: Game, player: Player): void;

}
