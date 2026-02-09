import { Injectable } from '@angular/core';
import { ApiErrorEnum, Format } from 'ptcg-server';
import { BehaviorSubject, Observable, throwError, timer, Subject } from 'rxjs';
import { Socket, io } from 'socket.io-client';
import { timeout, catchError, retry, takeUntil, switchMap, tap } from 'rxjs/operators';

import { ApiError } from './api.error';
import { environment } from '../../environments/environment';
import { SessionService } from '../shared/session/session.service';
import { GamePhase } from 'ptcg-server';

interface SocketResponse<T> {
  message: string;
  data?: T;
}

interface ReconnectionConfig {
  maxAutoReconnectAttempts: number;
  reconnectIntervals: number[];
  preservationTimeoutMs: number;
}

interface ReconnectionStatus {
  isReconnecting: boolean;
  currentAttempt: number;
  maxAttempts: number;
  nextRetryIn: number;
  lastDisconnectTime: number;
  error?: string;
}

interface ReconnectionEvent {
  type: 'attempting' | 'success' | 'failed' | 'timeout' | 'manual_required';
  attempt?: number;
  maxAttempts?: number;
  nextRetryIn?: number;
  error?: string;
}

@Injectable()
export class SocketService {

  public socket: Socket;
  private callbacks: { event: string, fn: any }[] = [];
  private enabled = false;
  private connectionSubject = new BehaviorSubject<boolean>(false);

  // Reconnection state
  private reconnectionConfig: ReconnectionConfig = {
    maxAutoReconnectAttempts: 3,
    reconnectIntervals: [5000, 10000, 15000], // 5s, 10s, 15s
    preservationTimeoutMs: 5 * 60 * 1000 // 5 minutes
  };

  private reconnectionStatus: ReconnectionStatus = {
    isReconnecting: false,
    currentAttempt: 0,
    maxAttempts: 3,
    nextRetryIn: 0,
    lastDisconnectTime: 0
  };

  private reconnectionStatusSubject = new BehaviorSubject<ReconnectionStatus>(this.reconnectionStatus);
  private reconnectionEventSubject = new Subject<ReconnectionEvent>();
  private reconnectionTimer?: any;
  private countdownInterval?: any;
  private connectionAttemptTimeout?: any;
  private stopReconnection$ = new Subject<void>();
  private wasConnectedBefore = false;
  private lastKnownGameId?: number;

  constructor(private sessionService: SessionService) {
    this.setServerUrl(environment.apiUrl);
  }

  public setServerUrl(apiUrl: string) {
    if (this.enabled) {
      this.disable();
    }

    if (this.socket) {
      this.socket.off('connect');
      this.socket.off('disconnect');
    }

    this.socket = io(apiUrl, {
      autoConnect: false,
      reconnection: false,
      // More resilient reconnection/backoff settings for flaky networks
      reconnectionAttempts: Infinity,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 10000,
      // Prefer websocket to avoid issues with long-polling being blocked by some environments
      transports: ['websocket'],
      // Allow more time for background tabs to respond to pings
      timeout: 20000,
      query: {}
    });

    this.socket.on('connect', () => this.handleConnect());
    this.socket.on('reconnect', () => this.handleReconnect());
    this.socket.on('reconnect_attempt', () => this.handleReconnectAttempt());
    this.socket.on('reconnect_error', (error) => this.handleReconnectError(error));
    this.socket.on('reconnect_failed', () => this.handleReconnectFailed());
    this.socket.on('connect_error', (error) => this.handleConnectError(error));
    this.socket.on('disconnect', (reason) => this.handleDisconnect(reason));
  }

  public joinMatchmakingQueue(format: Format, deck: string[], artworks?: { code: string; artworkId?: number }[], deckId?: number, sleeveImagePath?: string): Observable<any> {
    return this.emit('matchmaking:join', { format, deck, artworks, deckId, sleeveImagePath }).pipe(
      timeout(5000),
      retry(1),
      catchError((error) => {
        const apiError = ApiError.fromError(error);
        return throwError(apiError);
      })
    );
  }

  public leaveMatchmakingQueue(): Observable<any> {
    return this.emit('matchmaking:leave').pipe(
      timeout(5000),
      catchError((error) => {
        const apiError = ApiError.fromError(error);
        return throwError(apiError);
      })
    );
  }

  public enable(authToken: string) {
    if (this.enabled) {
      this.socket.disconnect();
    }

    (this.socket.io.opts.query as any).token = authToken;
    this.setReconnectionFlag(false);
    this.socket.connect();
    this.enabled = true;
  }

  public disable() {
    this.off();
    this.stopAutoReconnection();
    this.resetReconnectionStatus();
    this.setReconnectionFlag(false);
    this.socket.disconnect();
    this.enabled = false;
    this.wasConnectedBefore = false;
    this.clearGameId();
  }

  /**
   * Force disconnect to simulate network issues for testing reconnection
   * Unlike disable(), this keeps the service enabled so reconnection can work
   */
  public forceDisconnect() {
    if (this.socket && this.socket.connected) {
      // Disconnect the socket but keep the service enabled
      this.socket.disconnect();
    }
  }

  public emit<T, R>(message: string, data?: T): Observable<R> {
    return new Observable<R>(observer => {

      this.socket.emit(message, data, (response: SocketResponse<R>) => {
        if (response && response.message !== 'ok') {
          observer.error(new ApiError(ApiErrorEnum.SOCKET_ERROR, String(response.data)));
          observer.complete();
          return;
        }

        observer.next(response.data);
        observer.complete();
      });

    }).pipe(
      timeout(environment.timeout),
      catchError(response => {
        const apiError = ApiError.fromError(response);
        return throwError(apiError);
      })
    );
  }

  public on<T>(event: string, fn: (data: T) => void): void {
    const callback = { event, fn: fn.bind(this) };
    this.callbacks.push(callback);
    this.socket.on(event, callback.fn);
  }

  public off(message?: string): void {
    this.callbacks = this.callbacks.filter(callback => {
      if (message === undefined || message === callback.event) {
        this.socket.off(callback.event, callback.fn);
        return false;
      }
      return true;
    });
  }

  get connection(): Observable<boolean> {
    return this.connectionSubject.asObservable();
  }

  get isEnabled(): boolean {
    return this.enabled;
  }

  get isConnected(): boolean {
    return this.socket.connected;
  }

  get reconnectionStatus$(): Observable<ReconnectionStatus> {
    return this.reconnectionStatusSubject.asObservable();
  }

  get reconnectionEvents$(): Observable<ReconnectionEvent> {
    return this.reconnectionEventSubject.asObservable();
  }

  public setGameId(gameId: number): void {
    this.lastKnownGameId = gameId;
  }

  public clearGameId(): void {
    this.lastKnownGameId = undefined;
  }

  public manualReconnect(): Observable<boolean> {
    return new Observable<boolean>(observer => {
      if (this.isConnected) {
        observer.next(true);
        observer.complete();
        return;
      }

      this.stopAutoReconnection();
      this.resetReconnectionStatus();
      this.setReconnectionFlag(true);

      const connectHandler = () => {
        this.socket.off('connect', connectHandler);
        this.socket.off('connect_error', errorHandler);
        observer.next(true);
        observer.complete();
      };

      const errorHandler = (error: any) => {
        this.socket.off('connect', connectHandler);
        this.socket.off('connect_error', errorHandler);
        observer.error(new ApiError(ApiErrorEnum.SOCKET_ERROR, 'Manual reconnection failed'));
        observer.complete();
      };

      this.socket.on('connect', connectHandler);
      this.socket.on('connect_error', errorHandler);

      this.socket.connect();
    });
  }

  private handleConnect(): void {
    this.connectionSubject.next(true);
    this.wasConnectedBefore = true;

    if (this.reconnectionStatus.isReconnecting) {
      this.handleSuccessfulReconnection();
    }
  }

  private handleReconnect(): void {
    this.connectionSubject.next(true);
    this.handleSuccessfulReconnection();
  }

  private handleReconnectAttempt(): void {
    this.connectionSubject.next(false);
  }

  private handleReconnectError(error: any): void {
    this.connectionSubject.next(false);
  }

  private handleReconnectFailed(): void {
    this.connectionSubject.next(false);
    this.handleReconnectionFailure('All automatic reconnection attempts failed');
  }

  private handleConnectError(error: any): void {
    this.connectionSubject.next(false);
  }

  private handleDisconnect(reason: string): void {
    this.connectionSubject.next(false);

    if (this.wasConnectedBefore && this.enabled) {
      this.startCustomReconnectionLogic(reason);
    }
  }

  private startCustomReconnectionLogic(reason: string): void {
    // Don't start custom reconnection if socket.io is already handling it
    if (reason === 'io server disconnect' || reason === 'io client disconnect') {
      return;
    }

    this.reconnectionStatus = {
      isReconnecting: true,
      currentAttempt: 0,
      maxAttempts: this.reconnectionConfig.maxAutoReconnectAttempts,
      nextRetryIn: 0,
      lastDisconnectTime: Date.now()
    };

    this.setReconnectionFlag(true);
    this.updateReconnectionStatus();
    this.attemptReconnection();
  }

  private attemptReconnection(): void {
    if (this.reconnectionStatus.currentAttempt >= this.reconnectionStatus.maxAttempts) {
      this.handleReconnectionFailure('Maximum reconnection attempts reached');
      return;
    }

    // Check if we've exceeded the preservation timeout
    const timeSinceDisconnect = Date.now() - this.reconnectionStatus.lastDisconnectTime;
    if (timeSinceDisconnect > this.reconnectionConfig.preservationTimeoutMs) {
      this.handleReconnectionFailure('Reconnection timeout exceeded');
      return;
    }

    this.reconnectionStatus.currentAttempt++;
    const attemptIndex = Math.min(this.reconnectionStatus.currentAttempt - 1, this.reconnectionConfig.reconnectIntervals.length - 1);
    const delay = this.reconnectionConfig.reconnectIntervals[attemptIndex];

    this.reconnectionEventSubject.next({
      type: 'attempting',
      attempt: this.reconnectionStatus.currentAttempt,
      maxAttempts: this.reconnectionStatus.maxAttempts,
      nextRetryIn: delay
    });


    // Update countdown
    this.startCountdown(delay);

    this.reconnectionTimer = setTimeout(() => {
      if (!this.isConnected && this.reconnectionStatus.isReconnecting) {
        this.socket.connect();

        // Set a timeout for this specific attempt
        this.connectionAttemptTimeout = setTimeout(() => {
          if (!this.isConnected && this.reconnectionStatus.isReconnecting) {
            this.attemptReconnection();
          }
          this.connectionAttemptTimeout = undefined;
        }, 5000); // Wait 5 seconds for connection to establish
      }
    }, delay);
  }

  private startCountdown(delay: number): void {
    // Clear any existing countdown interval
    if (this.countdownInterval) {
      clearInterval(this.countdownInterval);
      this.countdownInterval = undefined;
    }

    const startTime = Date.now();
    this.countdownInterval = setInterval(() => {
      if (!this.reconnectionStatus.isReconnecting) {
        if (this.countdownInterval) {
          clearInterval(this.countdownInterval);
          this.countdownInterval = undefined;
        }
        return;
      }

      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, delay - elapsed);

      this.reconnectionStatus.nextRetryIn = remaining;
      this.updateReconnectionStatus();

      if (remaining <= 0) {
        if (this.countdownInterval) {
          clearInterval(this.countdownInterval);
          this.countdownInterval = undefined;
        }
      }
    }, 100);
  }

  private handleSuccessfulReconnection(): void {
    this.stopAutoReconnection();
    this.resetReconnectionStatus();
    this.setReconnectionFlag(false);

    this.reconnectionEventSubject.next({
      type: 'success'
    });

    // If we were in a game, attempt to rejoin after a short delay
    // This gives the server time to fully process the reconnection
    if (this.lastKnownGameId) {
      // Store timeout reference for cleanup if needed
      const rejoinTimeout = setTimeout(() => {
        this.attemptGameRejoin();
      }, 1000); // 1 second delay
      // Note: This timeout is intentionally not stored as it should complete
      // If service is disabled before completion, the attemptGameRejoin will check if gameId still exists
    }
  }

  private handleReconnectionFailure(error: string): void {
    this.stopAutoReconnection();

    this.reconnectionStatus.error = error;
    this.updateReconnectionStatus();

    this.reconnectionEventSubject.next({
      type: 'failed',
      error: error
    });

    // After a delay, offer manual reconnection
    // Note: This timeout is intentionally not stored as it should complete
    // If service is disabled before completion, the check will fail gracefully
    setTimeout(() => {
      if (!this.isConnected && this.enabled) {
        this.reconnectionEventSubject.next({
          type: 'manual_required',
          error: error
        });
      }
    }, 2000);
  }

  private attemptGameRejoin(attempt: number = 1): void {
    if (!this.lastKnownGameId) {
      return;
    }

    // Verify the user is actually a player in this game before attempting rejoin
    const session = this.sessionService.session;
    const gameState = session.gameStates.find(
      g => g.gameId === this.lastKnownGameId && g.deleted === false
    );

    if (!gameState) {
      // No game state found, clear game ID and don't attempt rejoin
      this.clearGameId();
      return;
    }

    // Check if the user is a player (not just a spectator)
    const clientId = session.clientId;
    const isPlayer = gameState.state.players.some(p => p.id === clientId);

    if (!isPlayer) {
      // User is not a player, clear game ID and don't attempt rejoin
      this.clearGameId();
      return;
    }

    // Check if game is finished - don't attempt rejoin for finished games
    if (gameState.state.phase === GamePhase.FINISHED) {
      this.clearGameId();
      return;
    }

    this.emit('game:rejoin', { gameId: this.lastKnownGameId }).pipe(
      timeout(15000), // 15 second timeout for rejoin operations
      catchError((error) => {
        return throwError(error);
      })
    ).subscribe(
      (response) => {
      },
      (error) => {

        // Retry up to 3 times with increasing delays
        if (attempt < 3 && this.enabled) {
          const retryDelay = attempt * 2000; // 2s, 4s delays
          // Note: This timeout is intentionally not stored as it should complete
          // If service is disabled before completion, the attemptGameRejoin will check if enabled
          setTimeout(() => {
            if (this.enabled && this.lastKnownGameId) {
              this.attemptGameRejoin(attempt + 1);
            }
          }, retryDelay);
        } else {
          this.clearGameId();
        }
      }
    );
  }

  private stopAutoReconnection(): void {
    if (this.reconnectionTimer) {
      clearTimeout(this.reconnectionTimer);
      this.reconnectionTimer = undefined;
    }
    if (this.countdownInterval) {
      clearInterval(this.countdownInterval);
      this.countdownInterval = undefined;
    }
    if (this.connectionAttemptTimeout) {
      clearTimeout(this.connectionAttemptTimeout);
      this.connectionAttemptTimeout = undefined;
    }
    this.stopReconnection$.next();
  }

  private setReconnectionFlag(isReconnecting: boolean): void {
    const query = this.socket.io.opts.query as any;
    if (isReconnecting) {
      query.reconnection = 'true';
      return;
    }

    delete query.reconnection;
  }

  private resetReconnectionStatus(): void {
    this.reconnectionStatus = {
      isReconnecting: false,
      currentAttempt: 0,
      maxAttempts: this.reconnectionConfig.maxAutoReconnectAttempts,
      nextRetryIn: 0,
      lastDisconnectTime: 0
    };
    this.updateReconnectionStatus();
  }

  private updateReconnectionStatus(): void {
    this.reconnectionStatusSubject.next({ ...this.reconnectionStatus });
  }

  public updateReconnectionConfig(config: Partial<ReconnectionConfig>): void {
    this.reconnectionConfig = { ...this.reconnectionConfig, ...config };
    this.reconnectionStatus.maxAttempts = this.reconnectionConfig.maxAutoReconnectAttempts;
  }
}