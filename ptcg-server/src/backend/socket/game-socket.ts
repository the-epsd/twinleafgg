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

  private boundListeners = {
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


  constructor(client: Client, socket: SocketWrapper, core: Core, cache: SocketCache) {
    this.cache = cache;
    this.client = client;
    this.socket = socket;
    this.core = core;
    this.stateSanitizer = new StateSanitizer(client, cache);

    // game listeners
    this.socket.addListener('game:join', this.boundListeners.joinGame);
    this.socket.addListener('game:leave', this.boundListeners.leaveGame);
    this.socket.addListener('game:getStatus', this.boundListeners.getGameStatus);
    this.socket.addListener('game:action:ability', this.boundListeners.ability);
    this.socket.addListener('game:action:ability', this.boundListeners.trainerability);
    this.socket.addListener('game:action:attack', this.boundListeners.attack);
    this.socket.addListener('game:action:stadium', this.boundListeners.stadium);
    this.socket.addListener('game:action:play', this.boundListeners.playGame);
    this.socket.addListener('game:action:playCard', this.boundListeners.playCard);
    this.socket.addListener('game:action:resolvePrompt', this.boundListeners.resolvePrompt);
    this.socket.addListener('game:action:retreat', this.boundListeners.retreat);
    this.socket.addListener('game:action:reorderBench', this.boundListeners.reorderBench);
    this.socket.addListener('game:action:reorderHand', this.boundListeners.reorderHand);
    this.socket.addListener('game:action:passTurn', this.boundListeners.passTurn);
    this.socket.addListener('game:action:appendLog', this.boundListeners.appendLog);
    this.socket.addListener('game:action:changeAvatar', this.boundListeners.changeAvatar);
  }

  public destroy(): void {
    this.socket.socket.removeListener('game:join', this.boundListeners.joinGame);
    this.socket.socket.removeListener('game:leave', this.boundListeners.leaveGame);
    this.socket.socket.removeListener('game:getStatus', this.boundListeners.getGameStatus);
    this.socket.socket.removeListener('game:action:ability', this.boundListeners.ability);
    this.socket.socket.removeListener('game:action:ability', this.boundListeners.trainerability);
    this.socket.socket.removeListener('game:action:attack', this.boundListeners.attack);
    this.socket.socket.removeListener('game:action:stadium', this.boundListeners.stadium);
    this.socket.socket.removeListener('game:action:play', this.boundListeners.playGame);
    this.socket.socket.removeListener('game:action:playCard', this.boundListeners.playCard);
    this.socket.socket.removeListener('game:action:resolvePrompt', this.boundListeners.resolvePrompt);
    this.socket.socket.removeListener('game:action:retreat', this.boundListeners.retreat);
    this.socket.socket.removeListener('game:action:reorderBench', this.boundListeners.reorderBench);
    this.socket.socket.removeListener('game:action:reorderHand', this.boundListeners.reorderHand);
    this.socket.socket.removeListener('game:action:passTurn', this.boundListeners.passTurn);
    this.socket.socket.removeListener('game:action:appendLog', this.boundListeners.appendLog);
    this.socket.socket.removeListener('game:action:changeAvatar', this.boundListeners.changeAvatar);

    if (this.cache) {
      delete this.cache.lastLogIdCache[this.client.id];
    }
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

  private joinGame(gameId: number, response: Response<GameState>): void {
    const game = this.core.games.find(g => g.id === gameId);
    if (game === undefined) {
      response('error', ApiErrorEnum.GAME_INVALID_ID);
      return;
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
    } catch (err) {
      if (err instanceof Error) {
        response('error', err.message as ApiErrorEnum);
      } else {
        response('error', ApiErrorEnum.UNKNOWN_ERROR);
      }
      return;
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
    } catch (err) {
      response('error', ApiErrorEnum.PROMPT_INVALID_RESULT);
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

}
