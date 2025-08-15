import { Injectable } from '@angular/core';
import {
  ClientInfo, GameState, State, CardTarget, StateLog, Replay,
  Base64, StateSerializer, PlayerStats
} from 'ptcg-server';
import { Observable } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { finalize } from 'rxjs/operators';

import { AlertService } from '../../shared/alert/alert.service';
import { ApiError } from '../api.error';
import { ApiService } from '../api.service';
import { LocalGameState, PlayerGameStats } from '../../shared/session/session.interface';
import { isValidPlayerGameStats, sanitizePlayerGameStats } from '../../shared/session/game-stats.utils';
import { PlayerStatsResponse } from '../interfaces/game.interface';
import { SocketService } from '../socket.service';
import { SessionService } from '../../shared/session/session.service';
import { BoardInteractionService } from '../../shared/services/board-interaction.service';

export interface GameUserInfo {
  gameId: number;
  userInfo: ClientInfo;
}

@Injectable()
export class GameService {

  constructor(
    private api: ApiService,
    private alertService: AlertService,
    private sessionService: SessionService,
    public socketService: SocketService,
    private translate: TranslateService,
    private boardInteractionService: BoardInteractionService
  ) { }

  public getPlayerStats(gameId: number) {
    return this.api.get<PlayerStatsResponse>('/v1/game/' + gameId + '/playerStats');
  }

  public join(gameId: number): Observable<GameState> {
    this.boardInteractionService.endBoardSelection();
    return new Observable<GameState>(observer => {
      this.socketService.emit('game:join', gameId)
        .pipe(finalize(() => observer.complete()))
        .subscribe((gameState: GameState) => {
          this.appendGameState(gameState);
          observer.next(gameState);
        }, (error: any) => {
          observer.error(error);
        });
    });
  }

  public appendGameState(gameState: GameState, replay?: Replay): LocalGameState | undefined {
    const gameId = gameState.gameId;
    const games = this.sessionService.session.gameStates;
    const index = games.findIndex(g => g.gameId === gameId && g.deleted === false);
    if (index === -1) {
      const logs: StateLog[] = [];
      let lastGameId = this.sessionService.session.lastGameId || 0;
      lastGameId++;
      const state = this.decodeStateData(gameState.stateData);
      const enhancedPlayerStats = this.extractPlayerGameStats(state);

      const localGameState: LocalGameState = {
        ...gameState,
        localId: lastGameId,
        gameOver: replay ? true : false,
        deleted: replay ? true : false,
        switchSide: false,
        promptMinimized: false,
        state,
        logs,
        replayPosition: 1,
        replay,
        enhancedPlayerStats: enhancedPlayerStats,
      };
      const gameStates = [...games, localGameState];
      this.startListening(gameState.gameId);
      this.sessionService.set({ gameStates, lastGameId });
      return localGameState;
    }
  }

  public markAsDeleted(gameId: number) {
    const games = this.sessionService.session.gameStates;
    const index = games.findIndex(g => g.gameId === gameId && g.deleted === false);
    if (index !== -1) {
      const gameStates = this.sessionService.session.gameStates.slice();
      gameStates[index] = { ...gameStates[index], deleted: true };
      this.stopListening(gameId);
      this.sessionService.set({ gameStates });
    }
  }

  public setPromptMinimized(gameId: number, minimized: boolean) {
    const games = this.sessionService.session.gameStates;
    const index = games.findIndex(g => g.localId === gameId);
    if (index !== -1) {
      const gameStates = this.sessionService.session.gameStates.slice();
      gameStates[index] = { ...gameStates[index], promptMinimized: minimized };
      this.sessionService.set({ gameStates });
    }
  }

  public removeGameState(gameId: number) {
    const games = this.sessionService.session.gameStates;
    const index = games.findIndex(g => g.gameId === gameId && g.deleted === false);
    if (index !== -1) {
      const gameStates = games.filter(g => g.gameId !== gameId || g.deleted !== false);
      this.stopListening(gameId);
      this.sessionService.set({ gameStates });
    }
  }

  public removeLocalGameState(localGameId: number) {
    const games = this.sessionService.session.gameStates;
    const index = games.findIndex(g => g.localId === localGameId);
    if (index !== -1) {
      const gameStates = games.filter(table => table.localId !== localGameId);
      this.sessionService.set({ gameStates });
    }
  }

  public leave(gameId: number) {
    const games = this.sessionService.session.gameStates;
    const index = games.findIndex(g => g.gameId === gameId && g.deleted === false);
    if (index !== -1) {
      const localGameId = games[index].localId;
      this.socketService.emit('game:leave', gameId)
        .subscribe(() => {
          this.removeGameState(gameId);
          this.removeLocalGameState(localGameId);
        }, (error: ApiError) => this.handleError(error));
    }
  }

  public ability(gameId: number, ability: string, target: CardTarget) {
    this.socketService.emit('game:action:ability', { gameId, ability, target })
      .subscribe(() => { }, (error: ApiError) => this.handleError(error));
  }

  public trainerAbility(gameId: number, ability: string, target: CardTarget) {
    this.socketService.emit('game:action:trainerAbility', { gameId, ability, target })
      .subscribe(() => { }, (error: ApiError) => this.handleError(error));
  }

  public energyAbility(gameId: number, ability: string, target: CardTarget) {
    this.socketService.emit('game:action:energyAbility', { gameId, ability, target })
      .subscribe(() => { }, (error: ApiError) => this.handleError(error));
  }

  public attack(gameId: number, attack: string) {
    this.socketService.emit('game:action:attack', { gameId, attack })
      .subscribe(() => { }, (error: ApiError) => this.handleError(error));
  }

  public stadium(gameId: number) {
    this.socketService.emit('game:action:stadium', { gameId })
      .subscribe(() => { }, (error: ApiError) => this.handleError(error));
  }

  public play(gameId: number, deck: string[]) {
    this.socketService.emit('game:action:play', { gameId, deck })
      .subscribe(() => { }, (error: ApiError) => this.handleError(error));
  }

  public resolvePrompt(gameId: number, promptId: number, result: any) {
    this.socketService.emit('game:action:resolvePrompt', { gameId, id: promptId, result })
      .subscribe(() => { }, (error: ApiError) => this.handleError(error));
  }

  public playCardAction(gameId: number, handIndex: number, target: CardTarget) {
    this.socketService.emit('game:action:playCard', { gameId, handIndex, target })
      .subscribe(() => { }, (error: ApiError) => this.handleError(error));
  }

  public reorderBenchAction(gameId: number, from: number, to: number) {
    this.socketService.emit('game:action:reorderBench', { gameId, from, to })
      .subscribe(() => { }, (error: ApiError) => this.handleError(error));
  }

  public reorderHandAction(gameId: number, order: number[]) {
    this.socketService.emit('game:action:reorderHand', { gameId, order })
      .subscribe(() => { }, (error: ApiError) => this.handleError(error));
  }

  public retreatAction(gameId: number, to: number) {
    this.socketService.emit('game:action:retreat', { gameId, to })
      .subscribe(() => { }, (error: ApiError) => this.handleError(error));
  }

  public passTurnAction(gameId: number) {
    this.socketService.emit('game:action:passTurn', { gameId })
      .subscribe(() => { }, (error: ApiError) => this.handleError(error));
  }

  public appendLogAction(gameId: number, message: string) {
    this.socketService.emit('game:action:appendLog', { gameId, message })
      .subscribe(() => { }, (error: ApiError) => this.handleError(error));
  }

  public changeAvatarAction(gameId: number, avatarName: string) {
    this.socketService.emit('game:action:changeAvatar', { gameId, avatarName })
      .subscribe(() => { }, (error: ApiError) => this.handleError(error));
  }

  public undo(gameId: number) {
    this.socketService.emit('game:action:undo', { gameId })
      .subscribe(() => { }, (error: ApiError) => this.handleError(error));
  }

  public canUndo(gameId: number): Observable<boolean> {
    return new Observable<boolean>(observer => {
      this.socketService.emit('game:canUndo', { gameId })
        .subscribe((result: { canUndo: boolean }) => {
          observer.next(result.canUndo);
          observer.complete();
        }, (error: ApiError) => {
          observer.next(false);
          observer.complete();
        });
    });
  }

  private startListening(id: number) {
    this.socketService.on(`game[${id}]:join`, (clientId: number) => this.onJoin(id, clientId));
    this.socketService.on(`game[${id}]:leave`, (clientId: number) => this.onLeave(id, clientId));
    this.socketService.on(`game[${id}]:stateChange`, (data: { stateData: string, playerStats: PlayerStats[] }) =>
      this.onStateChange(id, data.stateData, data.playerStats));
    this.socketService.on(`game[${id}]:timerUpdate`, (data: { playerStats: PlayerStats[] }) =>
      this.onTimerUpdate(id, data.playerStats));

    // Animation event handlers
    this.socketService.on(`game[${id}]:playBasicAnimation`, (data: { playerId: number, cardId: number | string, slot: string, index?: number }) => {
      this.boardInteractionService.triggerBasicAnimation(data);
    });
    this.socketService.on(`game[${id}]:evolution`, (data: { playerId: number, cardId: number | string, slot: string, index?: number }) => {
      this.boardInteractionService.triggerEvolutionAnimation(data);
    });
    this.socketService.on(`game[${id}]:attack`, (data: { playerId: number, cardId: number | string, slot: string, index?: number }) => {
      this.boardInteractionService.triggerAttackAnimation(data);
    });
  }

  private stopListening(id: number) {
    this.socketService.off(`game[${id}]:join`);
    this.socketService.off(`game[${id}]:leave`);
    this.socketService.off(`game[${id}]:stateChange`);
    this.socketService.off(`game[${id}]:timerUpdate`);

    // Clean up animation event handlers
    this.socketService.off(`game[${id}]:playBasicAnimation`);
    this.socketService.off(`game[${id}]:evolution`);
    this.socketService.off(`game[${id}]:attack`);
  }

  private onStateChange(gameId: number, stateData: string, playerStats: PlayerStats[]) {
    const state = this.decodeStateData(stateData);
    const games = this.sessionService.session.gameStates;
    const index = games.findIndex(g => g.gameId === gameId && g.deleted === false);
    if (index !== -1) {
      const gameStates = this.sessionService.session.gameStates.slice();
      const logs = [...gameStates[index].logs, ...state.logs];

      // Extract enhanced player statistics if available from the state
      const enhancedPlayerStats = this.extractPlayerGameStats(state);

      gameStates[index] = {
        ...gameStates[index],
        state,
        logs,
        enhancedPlayerStats: enhancedPlayerStats,
        playerStats
      };
      this.sessionService.set({ gameStates });
      this.boardInteractionService.updateGameLogs(logs);
    }
  }



  private extractPlayerGameStats(state: State): PlayerGameStats[] | undefined {
    // For now, return undefined as the server-side statistics tracking is not yet implemented
    // This method will be updated when the server-side GameStatsTracker is implemented
    // The method provides type safety and proper structure for when the data becomes available

    if (!state || !state.players) {
      return undefined;
    }

    try {
      // Check if enhanced game statistics are available in the state
      // This will be populated by the server-side GameStatsTracker in future tasks
      const playerStats: PlayerGameStats[] = state.players.map((player, index) => {
        // Extract game statistics if available, otherwise use defaults
        const gameStats = (player as any).gameStats;

        if (gameStats && isValidPlayerGameStats(gameStats)) {
          return {
            prizesTakenCount: gameStats.prizesTakenCount,
            totalDamageDealt: gameStats.totalDamageDealt,
            topPokemon: gameStats.topPokemon
          };
        }

        // Fallback to default values when server-side tracking is not available
        return {
          prizesTakenCount: 0,
          totalDamageDealt: 0,
          topPokemon: null
        };
      });

      return playerStats;
    } catch (error) {
      console.warn('Error extracting player game statistics:', error);
      return undefined;
    }
  }

  private onJoin(gameId: number, clientId: number) {
    const games = this.sessionService.session.gameStates;
    const index = games.findIndex(g => g.gameId === gameId && g.deleted === false);
    if (index === -1) {
      return;
    }
    const game = this.sessionService.session.gameStates[index];
    const clientIndex = game.clientIds.indexOf(clientId);
    if (clientIndex === -1) {
      const clientIds = [...game.clientIds, clientId];
      const gameStates = this.sessionService.session.gameStates.slice();
      gameStates[index] = { ...gameStates[index], clientIds };
      this.sessionService.set({ gameStates });
    }
  }

  private onLeave(gameId: number, clientId: number) {
    const games = this.sessionService.session.gameStates;
    const index = games.findIndex(g => g.gameId === gameId && g.deleted === false);
    if (index === -1) {
      return;
    }
    const game = this.sessionService.session.gameStates[index];
    const clientIndex = game.clientIds.indexOf(clientId);
    if (clientIndex !== -1) {
      const clientIds = game.clientIds.filter(id => id !== clientId);
      const gameStates = this.sessionService.session.gameStates.slice();
      gameStates[index] = { ...gameStates[index], clientIds };
      this.sessionService.set({ gameStates });
    }
  }

  private onTimerUpdate(gameId: number, playerStats: PlayerStats[]) {
    const games = this.sessionService.session.gameStates;
    const index = games.findIndex(g => g.gameId === gameId && g.deleted === false);
    if (index !== -1) {
      const gameStates = this.sessionService.session.gameStates.slice();
      gameStates[index] = { ...gameStates[index], playerStats };
      this.sessionService.set({ gameStates });
    }
  }

  private decodeStateData(stateData: string): State {
    const base64 = new Base64();
    const serializedState = base64.decode(stateData);
    const serializer = new StateSerializer();
    return serializer.deserialize(serializedState);
  }

  private handleError(error: ApiError): void {
    const message = String(error.message);
    const translations = this.translate.translations[this.translate.currentLang]
      || this.translate.translations[this.translate.defaultLang];

    const key = translations && translations.GAME_MESSAGES[message]
      ? 'GAME_MESSAGES.' + message
      : 'ERROR_UNKNOWN';

    this.alertService.toast(this.translate.instant(key));
  }

}