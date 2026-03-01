import {
  AddPlayerAction, AppendLogAction, Action, PassTurnAction,
  ReorderHandAction, ReorderBenchAction, PlayCardAction, CardTarget,
  RetreatAction, AttackAction, UseAbilityAction, StateSerializer,
  UseStadiumAction, GameLog,
  UseTrainerAbilityAction,
  UseEnergyAbilityAction,
  ConcedeAction
} from '../../game';
import { SandboxModifyPlayerAction } from '../../game/store/actions/sandbox-modify-player-action';
import { SandboxModifyGameStateAction } from '../../game/store/actions/sandbox-modify-game-state-action';
import { SandboxModifyCardAction } from '../../game/store/actions/sandbox-modify-card-action';
import { SandboxModifyPokemonAction } from '../../game/store/actions/sandbox-modify-pokemon-action';
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
  private lastActivePlayerId: number | null = null; // Track last active player

  constructor(client: Client, socket: SocketWrapper, core: Core, cache: SocketCache) {
    this.cache = cache;
    this.client = client;
    this.socket = socket;
    this.core = core;
    this.stateSanitizer = new StateSanitizer(client, cache);

    // game listeners
    this.socket.addListener('game:join', this.joinGame.bind(this));
    this.socket.addListener('game:leave', this.leaveGame.bind(this));
    this.socket.addListener('game:rejoin', this.rejoinGame.bind(this));
    this.socket.addListener('game:concede', this.concedeGame.bind(this));
    this.socket.addListener('game:getStatus', this.getGameStatus.bind(this));
    this.socket.addListener('game:action:ability', this.ability.bind(this));
    this.socket.addListener('game:action:trainerAbility', this.trainerAbility.bind(this));
    this.socket.addListener('game:action:energyAbility', this.energyAbility.bind(this));
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
    // Sandbox actions
    this.socket.addListener('game:sandbox:modifyPlayer', this.sandboxModifyPlayer.bind(this));
    this.socket.addListener('game:sandbox:modifyGameState', this.sandboxModifyGameState.bind(this));
    this.socket.addListener('game:sandbox:modifyCard', this.sandboxModifyCard.bind(this));
    this.socket.addListener('game:sandbox:modifyPokemon', this.sandboxModifyPokemon.bind(this));
  }

  public onGameJoin(game: Game, client: Client): void {
    this.socket.emit(`game[${game.id}]:join`, { clientId: client.id });
  }

  public onGameLeave(game: Game, client: Client): void {
    this.socket.emit(`game[${game.id}]:leave`, { clientId: client.id });
  }

  public onStateChange(game: Game, state: State): void {
    // Only send game state updates to clients that are in this game
    // This is a defensive check - the root cause is fixed in Game.onStateChange()
    if (!game.clients.includes(this.client)) {
      return;
    }

    if (this.core.games.indexOf(game) !== -1) {
      game.setBonusHps(state);
      state = this.stateSanitizer.sanitize(game.state, game.id);

      // Emit turn start if active player changed
      const activePlayer = state.players[state.activePlayer];
      if (activePlayer && this.lastActivePlayerId !== activePlayer.id) {
        this.lastActivePlayerId = activePlayer.id;
        this.socket.emit(`game[${game.id}]:turnStart`, {
          activePlayerId: activePlayer.id,
          activePlayerName: activePlayer.name
        });
      }

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

  private async rejoinGame(params: { gameId: number }, response: Response<GameState>): Promise<void> {
    try {
      const gameId = params.gameId;

      // Find the game
      const game = this.core.games.find(g => g.id === gameId);
      if (!game) {
        response('error', ApiErrorEnum.GAME_INVALID_ID);
        return;
      }

      // Check if the client is already in the game
      const isAlreadyInGame = game.clients.some(client => client.id === this.client.id);
      if (isAlreadyInGame) {
        // Client is already in the game, just return the current state
        this.cache.lastLogIdCache[game.id] = 0;
        response('ok', CoreSocket.buildGameState(game));
        return;
      }

      const playerId = game.getPlayerIdForUser(this.client.user.id);
      if (!playerId) {
        response('error', ApiErrorEnum.GAME_INVALID_ID);
        return;
      }

      // User is a player, check if they're disconnected
      const disconnectedPlayer = game.getDisconnectedPlayerInfo(playerId);

      if (!disconnectedPlayer) {
        // User is a player but not disconnected - they're already connected or never disconnected
        // Don't allow rejoin if they're not actually disconnected
        response('error', ApiErrorEnum.GAME_INVALID_ID);
        return;
      }

      // User is disconnected, attempt reconnection
      if (this.client.id !== playerId) {
        this.client.id = playerId;
      }

      const reconnected = game.handlePlayerReconnection(this.client);

      if (reconnected) {
        // Successfully reconnected to the game
        this.cache.lastLogIdCache[game.id] = 0;
        if (!this.client.games.includes(game)) {
          this.client.games.push(game);
        }
        response('ok', CoreSocket.buildGameState(game));
        return;
      } else {
        response('error', ApiErrorEnum.GAME_INVALID_ID);
        return;
      }

    } catch (error) {
      console.error('Error in rejoinGame:', error);
      response('error', ApiErrorEnum.SERVER_ERROR);
    }
  }

  private concedeGame(params: { gameId: number }, response: Response<void>): void {
    const gameId = params.gameId;
    const game = this.core.games.find(g => g.id === gameId);
    if (game === undefined) {
      response('error', ApiErrorEnum.GAME_INVALID_ID);
      return;
    }

    try {
      const action = new ConcedeAction(this.client.id);
      game.dispatch(this.client, action);
      response('ok');
    } catch (error) {
      console.error('Error in concedeGame:', error);
      response('error', ApiErrorEnum.SERVER_ERROR);
    }
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
      response('error', error.message);
    }
    response('ok');
  }

  private ability(params: { gameId: number, ability: string, target: CardTarget }, response: Response<void>) {
    const action = new UseAbilityAction(this.client.id, params.ability, params.target);
    this.dispatch(params.gameId, action, response);
  }

  private trainerAbility(params: { gameId: number, ability: string, target: CardTarget }, response: Response<void>) {
    const action = new UseTrainerAbilityAction(this.client.id, params.ability, params.target);
    this.dispatch(params.gameId, action, response);
  }

  private energyAbility(params: { gameId: number, ability: string, target: CardTarget }, response: Response<void>) {
    const action = new UseEnergyAbilityAction(this.client.id, params.ability, params.target);
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

  private playGame(params: { gameId: number, deck: string[], artworks?: { code: string; artworkId?: number }[], sleeveImagePath?: string }, response: Response<void>) {
    const action = new AddPlayerAction(this.client.id, this.client.user.name, params.deck, undefined, undefined, params.sleeveImagePath);
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
      response('error', error);
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

  private sandboxModifyPlayer(params: {
    gameId: number,
    targetPlayerId: number,
    modifications: any
  }, response: Response<void>) {
    // Validate admin role
    if (this.client.user.roleId !== 4) {
      response('error', ApiErrorEnum.ACTION_INVALID);
      return;
    }
    const action = new SandboxModifyPlayerAction(
      this.client.id,
      params.targetPlayerId,
      params.modifications
    );
    this.dispatch(params.gameId, action, response);
  }

  private sandboxModifyGameState(params: {
    gameId: number,
    modifications: any
  }, response: Response<void>) {
    // Validate admin role
    if (this.client.user.roleId !== 4) {
      response('error', ApiErrorEnum.ACTION_INVALID);
      return;
    }
    const action = new SandboxModifyGameStateAction(
      this.client.id,
      params.modifications
    );
    this.dispatch(params.gameId, action, response);
  }

  private sandboxModifyCard(params: {
    gameId: number,
    targetPlayerId: number,
    action: 'add' | 'remove' | 'move',
    cardName: string,
    fromZone?: string,
    toZone?: string,
    fromIndex?: number,
    toIndex?: number,
    prizeIndex?: number
  }, response: Response<void>) {
    // Validate admin role
    if (this.client.user.roleId !== 4) {
      response('error', ApiErrorEnum.ACTION_INVALID);
      return;
    }
    const action = new SandboxModifyCardAction(
      this.client.id,
      params.targetPlayerId,
      params.action,
      params.cardName,
      params.fromZone as any,
      params.toZone as any,
      params.fromIndex,
      params.toIndex,
      params.prizeIndex
    );
    this.dispatch(params.gameId, action, response);
  }

  private sandboxModifyPokemon(params: {
    gameId: number,
    targetPlayerId: number,
    location: 'active' | 'bench',
    benchIndex?: number,
    modifications: any
  }, response: Response<void>) {
    // Validate admin role
    if (this.client.user.roleId !== 4) {
      response('error', ApiErrorEnum.ACTION_INVALID);
      return;
    }
    const action = new SandboxModifyPokemonAction(
      this.client.id,
      params.targetPlayerId,
      params.location,
      params.modifications,
      params.benchIndex
    );
    this.dispatch(params.gameId, action, response);
  }

  public onTimerUpdate(game: Game, playerStats: any[]): void {
    this.socket.emit(`game[${game.id}]:timerUpdate`, { playerStats });
  }

  public onPlayerDisconnected(game: Game, disconnectedClient: Client): void {
    // Notify this client about the disconnection
    this.socket.emit(`game[${game.id}]:playerDisconnected`, {
      playerId: disconnectedClient.id,
      playerName: disconnectedClient.name,
      disconnectedAt: Date.now(),
      gamePhase: game.state.phase,
      isPaused: game.isPausedForDisconnection()
    });
  }

  public onPlayerReconnected(game: Game, reconnectedClient: Client): void {
    // Notify this client about the reconnection
    this.socket.emit(`game[${game.id}]:playerReconnected`, {
      playerId: reconnectedClient.id,
      playerName: reconnectedClient.name,
      reconnectedAt: Date.now(),
      gamePhase: game.state.phase,
      isPaused: game.isPausedForDisconnection()
    });
  }

  public onConnectionStatusUpdate(game: Game, connectionStatuses: Array<{ playerId: number, playerName: string, isConnected: boolean, disconnectedAt?: number }>): void {
    // Send connection status update to this client
    this.socket.emit(`game[${game.id}]:connectionStatusUpdate`, {
      connectionStatuses,
      gamePhase: game.state.phase,
      isPaused: game.isPausedForDisconnection()
    });
  }

  public onReconnectionTimeout(game: Game, playerId: number, playerName: string): void {
    // Notify this client about reconnection timeout
    this.socket.emit(`game[${game.id}]:reconnectionTimeout`, {
      playerId,
      playerName,
      timeoutAt: Date.now(),
      gamePhase: game.state.phase
    });
  }

  public onTimeoutWarning(game: Game, timeRemaining: number): void {
    // Send timeout warning to this client
    this.socket.emit(`game[${game.id}]:timeoutWarning`, {
      timeRemaining,
      gamePhase: game.state.phase
    });
  }

  public dispose(): void {
    this.socket.removeListener('game:join');
    this.socket.removeListener('game:leave');
    this.socket.removeListener('game:rejoin');
    this.socket.removeListener('game:concede');
    this.socket.removeListener('game:getStatus');
    this.socket.removeListener('game:action:ability');
    this.socket.removeListener('game:action:trainerAbility');
    this.socket.removeListener('game:action:attack');
    this.socket.removeListener('game:action:stadium');
    this.socket.removeListener('game:action:play');
    this.socket.removeListener('game:action:playCard');
    this.socket.removeListener('game:action:resolvePrompt');
    this.socket.removeListener('game:action:retreat');
    this.socket.removeListener('game:action:reorderBench');
    this.socket.removeListener('game:action:reorderHand');
    this.socket.removeListener('game:action:passTurn');
    this.socket.removeListener('game:action:appendLog');
    this.socket.removeListener('game:action:changeAvatar');
    this.socket.removeListener('game:sandbox:modifyPlayer');
    this.socket.removeListener('game:sandbox:modifyGameState');
    this.socket.removeListener('game:sandbox:modifyCard');
    this.socket.removeListener('game:sandbox:modifyPokemon');
  }

}