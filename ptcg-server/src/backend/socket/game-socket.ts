import {
  AddPlayerAction, AppendLogAction, Action, PassTurnAction,
  ReorderHandAction, ReorderBenchAction, PlayCardAction, CardTarget,
  RetreatAction, AttackAction, UseAbilityAction, StateSerializer,
  UseStadiumAction, GameLog,
  UseTrainerAbilityAction
} from '../../game';
import { Base64 } from '../../utils';
import { ChangeAvatarAction } from '../../game/store/actions/change-avatar-action';
import { Client } from '../../game/client/client.interface';
import { CoreSocket } from './core-socket';
import { ApiErrorEnum } from '../common/errors';
import { Game } from '../../game/core/game';
import { State } from '../../game/store/state/state';
import { Player } from '../../game/store/state/player';
import { Core } from '../../game/core/core';
import { GameState } from '../interfaces/core.interface';
import { ResolvePromptAction } from '../../game/store/actions/resolve-prompt-action';
import { SocketCache } from './socket-cache';
import { SocketWrapper, Response } from './socket-wrapper';
import { StateSanitizer } from './state-sanitizer';

export class GameSocket {

  private cache: SocketCache;
  private client: Client;
  private socket: SocketWrapper;
  private core: Core;
  private stateSanitizer: StateSanitizer;

  constructor(client: Client, socket: SocketWrapper, core: Core, cache: SocketCache) {
    this.cache = cache;
    this.client = client;
    this.socket = socket;
    this.core = core;
    this.stateSanitizer = new StateSanitizer(client, cache);

    // game listeners
    this.socket.addListener('game:join', this.joinGame.bind(this));
    this.socket.addListener('game:leave', this.leaveGame.bind(this));
    this.socket.addListener('game:getStatus', this.getGameStatus.bind(this));
    this.socket.addListener('game:action:ability', this.ability.bind(this));
    this.socket.addListener('game:action:ability', this.trainerability.bind(this));
    this.socket.addListener('game:action:attack', this.attack.bind(this));
    this.socket.addListener('game:action:stadium', this.stadium.bind(this));
    this.socket.addListener('game:action:play', this.playGame.bind(this));
    this.socket.addListener('game:action:playCard', this.playCard.bind(this));
    this.socket.addListener('game:action:resolvePrompt', this.resolvePrompt.bind(this));
    this.socket.addListener('game:action:retreat', this.retreat.bind(this));
    this.socket.addListener('game:action:reorderBench', this.reorderBench.bind(this));
    this.socket.addListener('game:action:reorderHand', this.reorderHand.bind(this));
    this.socket.addListener('game:action:passTurn', this.passTurn.bind(this));
    this.socket.addListener('game:action:appendLog', this.appendLog.bind(this));
    this.socket.addListener('game:action:changeAvatar', this.changeAvatar.bind(this));
  }

  public onGameJoin(game: Game, client: Client): void {
    this.socket.emit(`game[${game.id}]:join`, { clientId: client.id });
  }

  public onGameLeave(game: Game, client: Client): void {
    this.socket.emit(`game[${game.id}]:leave`, { clientId: client.id });
  }

  public onStateChange(game: Game, state: State): void {
    if (this.core.games.indexOf(game) !== -1) {
      state = this.stateSanitizer.sanitize(game.state, game.id);

      const serializer = new StateSerializer();
      const serializedState = serializer.serialize(state);
      const base64 = new Base64();
      const stateData = base64.encode(serializedState);
      const playerStats = game.playerStats;
      this.socket.emit(`game[${game.id}]:stateChange`, { stateData, playerStats });
    }
  }

  private joinGame(params: { gameId: number, playerId?: number }, response: Response<GameState>): void {
    const game = this.core.games.find(g => g.id === params.gameId);
    if (game === undefined) {
      response('error', ApiErrorEnum.GAME_INVALID_ID);
      return;
    }

    // Check if this client is already in the game
    const existingPlayer = game.state.players.find(p => p.id === this.client.id);
    if (existingPlayer) {
      // Client is already in the game, just update their connection
      console.log(`[Game] Player ${this.client.name} (${this.client.id}) already in game ${params.gameId}`);
      game.handleClientReconnect(this.client);
    } else if (params.playerId !== undefined) {
      // Try to reconnect with provided playerId
      const previousPlayer = game.state.players.find(p => p.id === params.playerId);
      if (previousPlayer && previousPlayer.name === this.client.name) {
        console.log(`[Game] Player ${this.client.name} (${params.playerId}) reconnecting to game ${params.gameId}`);
        this.client.id = params.playerId;
        game.handleClientReconnect(this.client);
      } else {
        console.log(`[Game] Invalid reconnection attempt - player ${params.playerId} not found or name mismatch in game ${params.gameId}`);
        response('error', ApiErrorEnum.GAME_INVALID_ID);
        return;
      }
    }

    this.cache.lastLogIdCache[game.id] = 0;
    this.core.joinGame(this.client, game);
    response('ok', CoreSocket.buildGameState(game));
  }

  private leaveGame(gameId: number, response: Response<void>): void {
    const game = this.core.games.find(g => g.id === gameId);
    if (game === undefined) {
      response('error', ApiErrorEnum.GAME_INVALID_ID);
      return;
    }
    delete this.cache.lastLogIdCache[game.id];
    this.core.leaveGame(this.client, game);
    response('ok');
  }

  private getGameStatus(gameId: number, response: Response<GameState>): void {
    const game = this.core.games.find(g => g.id === gameId);
    if (game === undefined) {
      response('error', ApiErrorEnum.GAME_INVALID_ID);
      return;
    }
    response('ok', CoreSocket.buildGameState(game));
  }

  private dispatch(gameId: number, action: Action, response: Response<void>) {
    const game = this.core.games.find(g => g.id === gameId);
    if (game === undefined) {
      response('error', ApiErrorEnum.GAME_INVALID_ID);
      return;
    }
    try {
      game.dispatch(this.client, action);
    } catch (error: any) {
      response('error', error.message || ApiErrorEnum.SERVER_ERROR);
    }
    response('ok');
  }

  private ability(params: { gameId: number, ability: string, target: CardTarget }, response: Response<void>) {
    const action = new UseAbilityAction(this.client.id, params.ability, params.target);
    this.dispatch(params.gameId, action, response);
  }

  private trainerability(params: { gameId: number, ability: string, target: CardTarget }, response: Response<void>) {
    const action = new UseTrainerAbilityAction(this.client.id, params.ability, params.target);
    this.dispatch(params.gameId, action, response);
  }

  private attack(params: { gameId: number, attack: string }, response: Response<void>) {
    const action = new AttackAction(this.client.id, params.attack);
    this.dispatch(params.gameId, action, response);
  }

  private stadium(params: { gameId: number }, response: Response<void>) {
    const action = new UseStadiumAction(this.client.id);
    this.dispatch(params.gameId, action, response);
  }

  private playGame(params: { gameId: number, deck: string[] }, response: Response<void>) {
    const action = new AddPlayerAction(this.client.id, this.client.user.name, params.deck);
    this.dispatch(params.gameId, action, response);
  }

  private playCard(params: { gameId: number, handIndex: number, target: CardTarget }, response: Response<void>) {
    const action = new PlayCardAction(this.client.id, params.handIndex, params.target);
    this.dispatch(params.gameId, action, response);
  }

  private resolvePrompt(params: { gameId: number, id: number, result: any }, response: Response<void>) {
    const game = this.core.games.find(g => g.id === params.gameId);
    if (game === undefined) {
      response('error', ApiErrorEnum.GAME_INVALID_ID);
      return;
    }
    const prompt = game.state.prompts.find(p => p.id === params.id);
    if (prompt === undefined) {
      response('error', ApiErrorEnum.PROMPT_INVALID_ID);
      return;
    }

    try {
      params.result = prompt.decode(params.result, game.state);
      if (prompt.validate(params.result, game.state) === false) {
        response('error', ApiErrorEnum.PROMPT_INVALID_RESULT);
        return;
      }
    } catch (error: any) {
      response('error', error.message || ApiErrorEnum.PROMPT_INVALID_RESULT);
      return;
    }

    const action = new ResolvePromptAction(params.id, params.result);
    this.dispatch(params.gameId, action, response);
  }

  private reorderBench(params: { gameId: number, from: number, to: number }, response: Response<void>) {
    const action = new ReorderBenchAction(this.client.id, params.from, params.to);
    this.dispatch(params.gameId, action, response);
  }

  private reorderHand(params: { gameId: number, order: number[] }, response: Response<void>) {
    const action = new ReorderHandAction(this.client.id, params.order);
    this.dispatch(params.gameId, action, response);
  }

  private retreat(params: { gameId: number, to: number }, response: Response<void>) {
    const action = new RetreatAction(this.client.id, params.to);
    this.dispatch(params.gameId, action, response);
  }

  private passTurn(params: { gameId: number }, response: Response<void>) {
    const action = new PassTurnAction(this.client.id);
    this.dispatch(params.gameId, action, response);
  }

  private appendLog(params: { gameId: number, message: string }, response: Response<void>) {
    const message = (params.message || '').trim();
    if (message.length === 0 || message.length > 256) {
      response('error', ApiErrorEnum.CANNOT_SEND_MESSAGE);
    }
    const action = new AppendLogAction(this.client.id, GameLog.LOG_TEXT, { text: message });
    this.dispatch(params.gameId, action, response);
  }

  private changeAvatar(params: { gameId: number, avatarName: string }, response: Response<void>) {
    const action = new ChangeAvatarAction(this.client.id, params.avatarName);
    this.dispatch(params.gameId, action, response);
  }

  public onPlayerDisconnect(game: Game, player: Player): void {
    this.socket.emit(`game[${game.id}]:playerDisconnect`, { playerId: player.id });
  }

  public onPlayerReconnect(game: Game, player: Player): void {
    this.socket.emit(`game[${game.id}]:playerReconnect`, { playerId: player.id });
  }

}