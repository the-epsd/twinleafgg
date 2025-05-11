import { Injectable } from '@angular/core';
import {
  ClientInfo, GameState, State, CardTarget, StateLog, Replay,
  Base64, StateSerializer, PlayerStats, ApiErrorEnum
} from 'ptcg-server';
import { Observable } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { finalize } from 'rxjs/operators';

import { AlertService } from '../../shared/alert/alert.service';
import { ApiError } from '../api.error';
import { ApiService } from '../api.service';
import { LocalGameState } from '../../shared/session/session.interface';
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
  private lastAction: string = '';
  private lastActionParams: any = {};
  private currentGameId: number = 0;

  constructor(
    private api: ApiService,
    private alertService: AlertService,
    private sessionService: SessionService,
    private socketService: SocketService,
    private translate: TranslateService,
    private boardInteractionService: BoardInteractionService
  ) { }

  public getPlayerStats(gameId: number) {
    return this.api.get<PlayerStatsResponse>('/v1/game/' + gameId + '/playerStats');
  }

  public join(gameId: number, playerId?: number): Observable<GameState> {
    this.boardInteractionService.endBoardSelection();
    this.currentGameId = gameId; // Store the current game ID

    return new Observable<GameState>(observer => {
      const joinData = { gameId, playerId };
      console.log('[Game] Joining game with data:', joinData);

      this.socketService.emit('game:join', joinData)
        .pipe(finalize(() => observer.complete()))
        .subscribe((gameState: GameState) => {
          // Ensure we have a valid game state before proceeding
          if (!gameState || !gameState.stateData) {
            console.error('[Game] Invalid game state received');
            observer.error(new ApiError(ApiErrorEnum.GAME_INVALID_ID));
            return;
          }

          try {
            const localGameState = this.appendGameState(gameState);
            if (!localGameState) {
              console.error('[Game] Failed to append game state');
              observer.error(new ApiError(ApiErrorEnum.GAME_INVALID_ID));
              return;
            }

            // Store the player ID for reconnection purposes
            const clientId = this.sessionService.session.clientId;
            const state = this.decodeStateData(gameState.stateData);
            const player = state.players.find(p => p.id === clientId);
            if (player) {
              console.log('[Game] Storing player ID for reconnection:', player.id);
              this.socketService.setPlayerId(player.id);
            }

            observer.next(gameState);
          } catch (error) {
            console.error('[Game] Error appending game state:', error);
            observer.error(new ApiError(ApiErrorEnum.GAME_INVALID_ID));
          }
        }, (error: any) => {
          console.error('[Game] Error joining game:', error);
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
      const localGameState: LocalGameState = {
        ...gameState,
        localId: lastGameId,
        gameOver: replay ? true : false,
        deleted: replay ? true : false,
        switchSide: false,
        promptMinimized: false,
        state: this.decodeStateData(gameState.stateData),
        logs,
        replayPosition: 1,
        replay,
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
    this.lastAction = 'game:action:playCard';
    this.lastActionParams = { gameId, handIndex, target };
    this.socketService.emit(this.lastAction, this.lastActionParams)
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

  private startListening(id: number) {
    // Remove any existing listeners first to prevent duplicates
    this.stopListening(id);

    this.socketService.on(`game[${id}]:join`, (clientId: number) => this.onJoin(id, clientId));
    this.socketService.on(`game[${id}]:leave`, (clientId: number) => this.onLeave(id, clientId));
    this.socketService.on(`game[${id}]:stateChange`, (data: { stateData: string, playerStats: PlayerStats[] }) => {
      try {
        if (!data || !data.stateData) {
          console.error('[Game Service] Invalid state change data received');
          return;
        }
        this.onStateChange(id, data.stateData, data.playerStats);
      } catch (error) {
        console.error('[Game Service] Error handling state change:', error);
      }
    });
  }

  private stopListening(id: number) {
    this.socketService.off(`game[${id}]:join`);
    this.socketService.off(`game[${id}]:leave`);
    this.socketService.off(`game[${id}]:stateChange`);
  }

  private onStateChange(gameId: number, stateData: string, playerStats: PlayerStats[]) {
    try {
      const state = this.decodeStateData(stateData);
      const games = this.sessionService.session.gameStates;
      const index = games.findIndex(g => g.gameId === gameId && g.deleted === false);

      if (index === -1) {
        console.warn(`[Game Service] Game state not found for game ${gameId}`);
        return;
      }

      const gameStates = this.sessionService.session.gameStates.slice();
      const logs = [...gameStates[index].logs, ...state.logs];
      gameStates[index] = { ...gameStates[index], state, logs, playerStats };
      this.sessionService.set({ gameStates });

      // Update the BoardInteractionService with the latest logs
      this.boardInteractionService.updateGameLogs(logs);
    } catch (error) {
      console.error('[Game Service] Error processing state change:', error);
      // Attempt to recover by requesting a fresh game state
      this.socketService.emit('game:join', gameId).subscribe(
        (gameState: GameState) => {
          this.appendGameState(gameState);
        },
        (error) => {
          console.error('[Game Service] Failed to recover game state:', error);
        }
      );
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

  private decodeStateData(stateData: string): State {
    const base64 = new Base64();
    const serializedState = base64.decode(stateData);
    const serializer = new StateSerializer();
    return serializer.deserialize(serializedState);
  }

  private handleError(error: ApiError) {
    if (!error.handled) {
      console.log('[Game] Error details:', {
        message: error.message,
        code: error.code,
        currentGameId: this.currentGameId,
        lastAction: this.lastAction
      });

      // Check if this is a reconnection-related error
      if (error.message === ApiErrorEnum.GAME_INVALID_ID ||
        error.message === 'ERROR_DISCONNECTED_FROM_SERVER' ||
        error.message === ApiErrorEnum.SOCKET_ERROR) {

        // Get the player ID for reconnection
        const playerId = this.socketService.getPlayerId();
        console.log('[Game] Attempting to rejoin game with player ID:', playerId);

        // Try to rejoin the game with the stored player ID
        this.socketService.emit('game:join', {
          gameId: this.currentGameId,
          playerId: playerId
        }).subscribe({
          next: (gameState: GameState) => {
            console.log('[Game] Successfully rejoined game');
            this.appendGameState(gameState);

            // If we have a pending action, retry it
            if (this.lastAction) {
              console.log('[Game] Retrying last action:', this.lastAction);
              this.socketService.emit(this.lastAction, this.lastActionParams)
                .subscribe(() => { }, (retryError: ApiError) => {
                  console.error('[Game] Failed to retry action:', retryError);
                  this.alertService.toast(this.translate.instant('ERROR_UNKNOWN'));
                });
            }
          },
          error: (rejoinError) => {
            console.error('[Game] Failed to rejoin game:', rejoinError);
            this.alertService.toast(this.translate.instant('ERROR_DISCONNECTED_FROM_SERVER'));
          }
        });
      } else {
        this.alertService.toast(this.translate.instant('ERROR_UNKNOWN'));
      }
    }
  }

  // Modify action methods to track the last action
  public attackAction(gameId: number, attack: string) {
    this.lastAction = 'game:action:attack';
    this.lastActionParams = { gameId, attack };
    this.socketService.emit(this.lastAction, this.lastActionParams)
      .subscribe(() => { }, (error: ApiError) => this.handleError(error));
  }

}
