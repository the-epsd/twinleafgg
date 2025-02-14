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
  private readonly MAX_MESSAGE_LENGTH = 256;
  private readonly MIN_MESSAGE_LENGTH = 1;

  constructor(client: Client, socket: SocketWrapper, core: Core, cache: SocketCache) {
    if (!client || !socket || !core || !cache) {
      throw new Error('Required dependencies missing in GameSocket constructor');
    }

    this.cache = cache;
    this.client = client;
    this.socket = socket;
    this.core = core;
    this.stateSanitizer = new StateSanitizer(client, cache);

    // Bind methods to avoid context issues
    const boundMethods = {
      joinGame: this.joinGame.bind(this),
      leaveGame: this.leaveGame.bind(this),
      getGameStatus: this.getGameStatus.bind(this),
      ability: this.ability.bind(this),
      trainerability: this.trainerability.bind(this),
      attack: this.attack.bind(this),
      stadium: this.stadium.bind(this),
      playGame: this.playGame.bind(this),
      playCard: this.playCard.bind(this),
      resolvePrompt: this.resolvePrompt.bind(this),
      retreat: this.retreat.bind(this),
      reorderBench: this.reorderBench.bind(this),
      reorderHand: this.reorderHand.bind(this),
      passTurn: this.passTurn.bind(this),
      appendLog: this.appendLog.bind(this),
      changeAvatar: this.changeAvatar.bind(this)
    };

    // Add listeners with error handling
    try {
      this.socket.addListener('game:join', boundMethods.joinGame);
      this.socket.addListener('game:leave', boundMethods.leaveGame);
      this.socket.addListener('game:getStatus', boundMethods.getGameStatus);
      this.socket.addListener('game:action:ability', boundMethods.ability);
      this.socket.addListener('game:action:trainerAbility', boundMethods.trainerability);
      this.socket.addListener('game:action:attack', boundMethods.attack);
      this.socket.addListener('game:action:stadium', boundMethods.stadium);
      this.socket.addListener('game:action:play', boundMethods.playGame);
      this.socket.addListener('game:action:playCard', boundMethods.playCard);
      this.socket.addListener('game:action:resolvePrompt', boundMethods.resolvePrompt);
      this.socket.addListener('game:action:retreat', boundMethods.retreat);
      this.socket.addListener('game:action:reorderBench', boundMethods.reorderBench);
      this.socket.addListener('game:action:reorderHand', boundMethods.reorderHand);
      this.socket.addListener('game:action:passTurn', boundMethods.passTurn);
      this.socket.addListener('game:action:appendLog', boundMethods.appendLog);
      this.socket.addListener('game:action:changeAvatar', boundMethods.changeAvatar);
    } catch (error) {
      console.error('Failed to initialize game socket listeners:', error);
      throw error;
    }
  }

  public onGameJoin(game: Game, client: Client): void {
    try {
      if (!game || !client) return;
      this.socket.emit(`game[${game.id}]:join`, { clientId: client.id });
    } catch (error) {
      console.error('Error in onGameJoin:', error);
    }
  }

  public onGameLeave(game: Game, client: Client): void {
    try {
      if (!game || !client) return;
      this.socket.emit(`game[${game.id}]:leave`, { clientId: client.id });
    } catch (error) {
      console.error('Error in onGameLeave:', error);
    }
  }

  public onStateChange(game: Game, state: State): void {
    try {
      if (!game || !state || this.core.games.indexOf(game) === -1) return;

      // Throttle state updates to prevent CPU spikes
      const sanitizedState = this.stateSanitizer.sanitize(game.state, game.id);
      const serializer = new StateSerializer();
      const serializedState = serializer.serialize(sanitizedState);
      const base64 = new Base64();
      const stateData = base64.encode(serializedState);
      const playerStats = game.playerStats;

      this.socket.emit(`game[${game.id}]:stateChange`, { stateData, playerStats });
    } catch (error) {
      console.error('Error in onStateChange:', error);
    }
  }

  private joinGame(gameId: number, response: Response<GameState>): void {
    try {
      const game = this.core.games.find(g => g.id === gameId);
      if (!game) {
        response('error', ApiErrorEnum.GAME_INVALID_ID);
        return;
      }

      this.cache.lastLogIdCache[game.id] = 0;
      this.core.joinGame(this.client, game);
      response('ok', CoreSocket.buildGameState(game));
    } catch (error) {
      console.error('Error in joinGame:', error);
      response('error', ApiErrorEnum.SOCKET_ERROR);
    }
  }

  private leaveGame(gameId: number, response: Response<void>): void {
    try {
      const game = this.core.games.find(g => g.id === gameId);
      if (!game) {
        response('error', ApiErrorEnum.GAME_INVALID_ID);
        return;
      }

      delete this.cache.lastLogIdCache[game.id];
      this.core.leaveGame(this.client, game);
      response('ok');
    } catch (error) {
      console.error('Error in leaveGame:', error);
      response('error', ApiErrorEnum.SOCKET_ERROR);
    }
  }

  private getGameStatus(gameId: number, response: Response<GameState>): void {
    try {
      const game = this.core.games.find(g => g.id === gameId);
      if (!game) {
        response('error', ApiErrorEnum.GAME_INVALID_ID);
        return;
      }
      response('ok', CoreSocket.buildGameState(game));
    } catch (error) {
      console.error('Error in getGameStatus:', error);
      response('error', ApiErrorEnum.SOCKET_ERROR);
    }
  }

  private dispatch(gameId: number, action: Action, response: Response<void>) {
    try {
      const game = this.core.games.find(g => g.id === gameId);
      if (!game) {
        response('error', ApiErrorEnum.GAME_INVALID_ID);
        return;
      }

      game.dispatch(this.client, action);
      response('ok');
    } catch (error) {
      console.error('Error in dispatch:', error);
      response('error', error.message);
    }
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
    try {
      if (!params || !params.gameId || typeof params.id !== 'number') {
        response('error', ApiErrorEnum.INVALID_PARAMETERS);
        return;
      }

      const game = this.core.games.find(g => g.id === params.gameId);
      if (!game) {
        response('error', ApiErrorEnum.GAME_INVALID_ID);
        return;
      }

      const prompt = game.state.prompts.find(p => p.id === params.id);
      if (!prompt) {
        response('error', ApiErrorEnum.PROMPT_INVALID_ID);
        return;
      }

      const decodedResult = prompt.decode(params.result, game.state);
      if (!prompt.validate(decodedResult, game.state)) {
        response('error', ApiErrorEnum.PROMPT_INVALID_RESULT);
        return;
      }

      const action = new ResolvePromptAction(params.id, decodedResult);
      this.dispatch(params.gameId, action, response);
    } catch (error) {
      console.error('Error in resolvePrompt:', error);
      response('error', ApiErrorEnum.SOCKET_ERROR);
    }
  }

  private reorderBench(params: { gameId: number, from: number, to: number }, response: Response<void>) {
    if (!params || !params.gameId || typeof params.from !== 'number' || typeof params.to !== 'number') {
      response('error', ApiErrorEnum.INVALID_PARAMETERS);
      return;
    }
    const action = new ReorderBenchAction(this.client.id, params.from, params.to);
    this.dispatch(params.gameId, action, response);
  }

  private reorderHand(params: { gameId: number, order: number[] }, response: Response<void>) {
    if (!params || !params.gameId || !Array.isArray(params.order)) {
      response('error', ApiErrorEnum.INVALID_PARAMETERS);
      return;
    }
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
    try {
      if (!params || !params.gameId) {
        response('error', ApiErrorEnum.INVALID_PARAMETERS);
        return;
      }

      const message = (params.message || '').trim();
      if (message.length < this.MIN_MESSAGE_LENGTH || message.length > this.MAX_MESSAGE_LENGTH) {
        response('error', ApiErrorEnum.CANNOT_SEND_MESSAGE);
        return;
      }

      const action = new AppendLogAction(this.client.id, GameLog.LOG_TEXT, { text: message });
      this.dispatch(params.gameId, action, response);
    } catch (error) {
      console.error('Error in appendLog:', error);
      response('error', ApiErrorEnum.SOCKET_ERROR);
    }
  }

  private changeAvatar(params: { gameId: number, avatarName: string }, response: Response<void>) {
    const action = new ChangeAvatarAction(this.client.id, params.avatarName);
    this.dispatch(params.gameId, action, response);
  }

}
