import { Injectable } from '@angular/core';
import { ApiErrorEnum, Format } from 'ptcg-server';
import { BehaviorSubject, Observable, throwError, timer, Subject } from 'rxjs';
import { Socket, io } from 'socket.io-client';
import { timeout, catchError, retry, takeUntil, switchMap, tap } from 'rxjs/operators';

import { ApiError } from './api.error';
import { environment } from '../../environments/environment';

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
  private stopReconnection$ = new Subject<void>();
  private wasConnectedBefore = false;
  private lastKnownGameId?: number;

  constructor() {
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
      reconnection: true,
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

  public joinMatchmakingQueue(format: Format, deck: string[]): Observable<any> {
    return this.emit('matchmaking:join', { format, deck }).pipe(
      timeout(5000),
      retry(1),
      catchError((error) => {
        const apiError = ApiError.fromError(error);
        console.error('Failed to join matchmaking queue:', error);
        return throwError(apiError);
      })
    );
  }

  public leaveMatchmakingQueue(): Observable<any> {
    return this.emit('matchmaking:leave').pipe(
      timeout(5000),
      catchError((error) => {
        const apiError = ApiError.fromError(error);
        console.error('Failed to leave matchmaking queue:', error);
        return throwError(apiError);
      })
    );
  }

  public enable(authToken: string) {
    if (this.enabled) {
      this.socket.disconnect();
    }

    (this.socket.io.opts.query as any).token = authToken;
    this.socket.connect();
    this.enabled = true;
  }

  public disable() {
    this.off();
    this.stopAutoReconnection();
    this.resetReconnectionStatus();
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
      console.log('[SocketService] Force disconnect triggered for testing');
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
    console.log('[SocketService] Connected to server');
    this.connectionSubject.next(true);
    this.wasConnectedBefore = true;

    if (this.reconnectionStatus.isReconnecting) {
      this.handleSuccessfulReconnection();
    }
  }

  private handleReconnect(): void {
    console.log('[SocketService] Reconnected to server');
    this.connectionSubject.next(true);
    this.handleSuccessfulReconnection();
  }

  private handleReconnectAttempt(): void {
    console.log('[SocketService] Attempting to reconnect...');
    this.connectionSubject.next(false);
  }

  private handleReconnectError(error: any): void {
    console.warn('[SocketService] Reconnection error:', error);
    this.connectionSubject.next(false);
  }

  private handleReconnectFailed(): void {
    console.error('[SocketService] All reconnection attempts failed');
    this.connectionSubject.next(false);
    this.handleReconnectionFailure('All automatic reconnection attempts failed');
  }

  private handleConnectError(error: any): void {
    console.error('[SocketService] Connection error:', error);
    this.connectionSubject.next(false);
  }

  private handleDisconnect(reason: string): void {
    console.log('[SocketService] Disconnected from server. Reason:', reason);
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

    console.log(`[SocketService] Reconnection attempt ${this.reconnectionStatus.currentAttempt}/${this.reconnectionStatus.maxAttempts} in ${delay}ms`);

    // Update countdown
    this.startCountdown(delay);

    this.reconnectionTimer = setTimeout(() => {
      if (!this.isConnected && this.reconnectionStatus.isReconnecting) {
        this.socket.connect();

        // Set a timeout for this specific attempt
        setTimeout(() => {
          if (!this.isConnected && this.reconnectionStatus.isReconnecting) {
            this.attemptReconnection();
          }
        }, 5000); // Wait 5 seconds for connection to establish
      }
    }, delay);
  }

  private startCountdown(delay: number): void {
    const startTime = Date.now();
    const countdownInterval = setInterval(() => {
      if (!this.reconnectionStatus.isReconnecting) {
        clearInterval(countdownInterval);
        return;
      }

      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, delay - elapsed);

      this.reconnectionStatus.nextRetryIn = remaining;
      this.updateReconnectionStatus();

      if (remaining <= 0) {
        clearInterval(countdownInterval);
      }
    }, 100);
  }

  private handleSuccessfulReconnection(): void {
    console.log('[SocketService] Reconnection successful');
    this.stopAutoReconnection();
    this.resetReconnectionStatus();

    this.reconnectionEventSubject.next({
      type: 'success'
    });

    // If we were in a game, attempt to rejoin after a short delay
    // This gives the server time to fully process the reconnection
    if (this.lastKnownGameId) {
      setTimeout(() => {
        this.attemptGameRejoin();
      }, 1000); // 1 second delay
    }
  }

  private handleReconnectionFailure(error: string): void {
    console.error('[SocketService] Reconnection failed:', error);
    this.stopAutoReconnection();

    this.reconnectionStatus.error = error;
    this.updateReconnectionStatus();

    this.reconnectionEventSubject.next({
      type: 'failed',
      error: error
    });

    // After a delay, offer manual reconnection
    setTimeout(() => {
      if (!this.isConnected) {
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

    console.log(`[SocketService] Attempting to rejoin game ${this.lastKnownGameId} (attempt ${attempt}/3)`);

    this.emit('game:rejoin', { gameId: this.lastKnownGameId }).pipe(
      timeout(15000), // 15 second timeout for rejoin operations
      catchError((error) => {
        console.error('Failed to rejoin game:', error);
        return throwError(error);
      })
    ).subscribe(
      (response) => {
        console.log('[SocketService] Successfully rejoined game');
      },
      (error) => {
        console.error(`[SocketService] Failed to rejoin game (attempt ${attempt}/3):`, error);

        // Retry up to 3 times with increasing delays
        if (attempt < 3) {
          const retryDelay = attempt * 2000; // 2s, 4s delays
          console.log(`[SocketService] Retrying game rejoin in ${retryDelay}ms`);
          setTimeout(() => {
            this.attemptGameRejoin(attempt + 1);
          }, retryDelay);
        } else {
          console.error('[SocketService] All rejoin attempts failed, clearing game ID');
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
    this.stopReconnection$.next();
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