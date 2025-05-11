import { Injectable } from '@angular/core';
import { ApiErrorEnum, Format } from 'ptcg-server';
import { BehaviorSubject, Observable, throwError, timer } from 'rxjs';
import { Socket, io } from 'socket.io-client';
import { timeout, catchError, retry, takeUntil } from 'rxjs/operators';

import { ApiError } from './api.error';
import { environment } from '../../environments/environment';

interface SocketResponse<T> {
  message: string;
  data?: T;
}

interface ReconnectStrategy {
  maxAttempts: number;
  backoff: {
    min: number;
    max: number;
    jitter: number;
  };
  getDelay(attempt: number): number;
}

@Injectable()
export class SocketService {
  public socket: Socket;
  private callbacks: { event: string, fn: any }[] = [];
  private enabled = false;
  private connectionSubject = new BehaviorSubject<boolean>(false);
  private lastPingTime: number = 0;
  private heartbeatInterval: any;
  private playerId: number | undefined;
  private reconnectStrategy: ReconnectStrategy = {
    maxAttempts: 5,
    backoff: {
      min: 1000,
      max: 30000,
      jitter: 0.5
    },
    getDelay(attempt: number): number {
      const delay = Math.min(
        this.backoff.min * Math.pow(2, attempt),
        this.backoff.max
      );
      return delay * (1 + Math.random() * this.backoff.jitter);
    }
  };

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
      this.socket.off('connect_error');
      this.socket.off('reconnect');
      this.socket.off('reconnect_attempt');
      this.socket.off('reconnect_error');
      this.socket.off('reconnect_failed');
      this.socket.off('ping');
      this.socket.off('heartbeat_ack');
    }

    this.socket = io(apiUrl, {
      autoConnect: false,
      reconnection: true,
      reconnectionAttempts: this.reconnectStrategy.maxAttempts,
      reconnectionDelay: this.reconnectStrategy.backoff.min,
      reconnectionDelayMax: this.reconnectStrategy.backoff.max,
      timeout: 60000,
      transports: ['websocket', 'polling'],
      forceNew: true,
      query: {},
      randomizationFactor: this.reconnectStrategy.backoff.jitter
    });

    this.setupSocketListeners();
  }

  private setupSocketListeners(): void {
    this.socket.on('connect', () => {
      console.log('[Socket] Connected to server');
      this.connectionSubject.next(true);
      this.lastPingTime = Date.now();
      this.startHeartbeat();

      // Reset reconnection attempts on successful connection
      this.socket.io.reconnectionAttempts(0);

      if (this.socket.io.engine) {
        this.socket.io.engine.on('upgrade', () => {
          console.log('[Socket] Transport upgraded to:', this.socket.io.engine.transport.name);
        });

        this.socket.io.engine.on('downgrade', () => {
          console.log('[Socket] Transport downgraded to:', this.socket.io.engine.transport.name);
          // Attempt to upgrade back to WebSocket after a delay
          setTimeout(() => {
            if (this.socket.io.engine.transport.name === 'polling') {
              console.log('[Socket] Attempting to upgrade back to WebSocket');
              this.socket.io.engine.upgrade();
            }
          }, 5000);
        });

        // Monitor transport errors
        this.socket.io.engine.on('error', (error: Error) => {
          console.error('[Socket] Transport error:', error);
          // Attempt to recover by forcing a reconnection
          if (this.socket.connected) {
            this.socket.disconnect().connect();
          }
        });
      }
    });

    this.socket.on('connect_error', (error) => {
      if (!error.message.includes('xhr poll error') && !error.message.includes('network error')) {
        console.error('[Socket] Connection error:', error.message);
      }
      this.handleConnectionError();
    });

    this.socket.on('disconnect', (reason) => {
      console.log(`[Socket] Disconnected: ${reason}`);
      this.connectionSubject.next(false);
      this.stopHeartbeat();
      this.handleDisconnect(reason);
    });

    this.socket.on('reconnect', (attemptNumber) => {
      console.log(`[Socket] Reconnected after ${attemptNumber} attempts`);
      this.connectionSubject.next(true);
      this.lastPingTime = Date.now();
      this.startHeartbeat();
    });

    this.socket.on('reconnect_attempt', (attemptNumber) => {
      if (attemptNumber % 5 === 0) {
        console.log(`[Socket] Reconnection attempt ${attemptNumber}`);
      }
      // Adjust transport based on attempt number
      if (attemptNumber > 3) {
        this.socket.io.opts.transports = ['polling', 'websocket'];
      }
    });

    this.socket.on('reconnect_error', (error) => {
      if (!error.message.includes('xhr poll error') && !error.message.includes('network error')) {
        console.error('[Socket] Reconnection error:', error.message);
      }
    });

    this.socket.on('reconnect_failed', () => {
      console.error('[Socket] Reconnection failed after all attempts');
      this.connectionSubject.next(false);
    });

    this.socket.on('heartbeat_ack', () => {
      this.lastPingTime = Date.now();
    });

    this.socket.io.on('ping', () => {
      const now = Date.now();
      if (this.lastPingTime > 0 && now - this.lastPingTime > 30000) {
        console.log(`[Socket] Delayed ping (${now - this.lastPingTime}ms)`);
        // If ping delay is too high, try to recover the connection
        if (now - this.lastPingTime > 60000) {
          console.log('[Socket] High ping delay, attempting to recover connection');
          this.socket.disconnect().connect();
        }
      }
      this.lastPingTime = now;
    });

    // Add error recovery handler
    this.socket.on('error_recovery', () => {
      console.log('[Socket] Received error recovery signal from server');
      if (!this.socket.connected) {
        this.socket.connect();
      }
    });
  }

  private startHeartbeat(): void {
    this.stopHeartbeat(); // Clear any existing interval
    this.heartbeatInterval = setInterval(() => {
      if (this.socket.connected) {
        this.socket.emit('heartbeat');

        // Check for stale connection
        const now = Date.now();
        if (now - this.lastPingTime > 60000) {
          console.log('[Socket] Heartbeat timeout, attempting to recover connection');
          this.socket.disconnect().connect();
        }
      }
    }, 15000); // Send heartbeat every 15 seconds
  }

  private stopHeartbeat(): void {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }
  }

  private handleConnectionError(): void {
    const delay = this.reconnectStrategy.getDelay(this.socket.io.reconnectionAttempts());
    console.log(`[Socket] Connection error, retrying in ${delay}ms`);

    // Try to recover by switching transport
    if (this.socket.io.engine && this.socket.io.engine.transport.name === 'websocket') {
      console.log('[Socket] Switching to polling transport');
      this.socket.io.opts.transports = ['polling', 'websocket'];
    }

    setTimeout(() => {
      if (!this.socket.connected) {
        this.socket.connect();
      }
    }, delay);
  }

  private handleDisconnect(reason: string): void {
    switch (reason) {
      case 'io server disconnect':
        console.log('[Socket] Server initiated disconnect, attempting reconnect');
        // Server initiated disconnect, try immediate reconnect
        this.socket.connect();
        break;
      case 'transport close':
        const delay = this.reconnectStrategy.getDelay(this.socket.io.reconnectionAttempts());
        console.log(`[Socket] Transport closed, reconnecting in ${delay}ms`);
        // Transport closed, try with delay
        setTimeout(() => {
          if (!this.socket.connected) {
            this.socket.connect();
          }
        }, delay);
        break;
      case 'ping timeout':
        console.log('[Socket] Ping timeout, attempting immediate reconnect');
        // Ping timeout, try immediate reconnect
        this.socket.connect();
        break;
      case 'transport error':
        console.log('[Socket] Transport error, attempting reconnect with polling');
        // Transport error, try with polling first
        this.socket.io.opts.transports = ['polling', 'websocket'];
        this.socket.connect();
        break;
      default:
        const defaultDelay = this.reconnectStrategy.getDelay(this.socket.io.reconnectionAttempts());
        console.log(`[Socket] Unknown disconnect reason, reconnecting in ${defaultDelay}ms`);
        setTimeout(() => {
          if (!this.socket.connected) {
            this.socket.connect();
          }
        }, defaultDelay);
    }

    // Emit disconnect event to notify subscribers
    this.connectionSubject.next(false);
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

    this.off();

    if (this.socket.connected) {
      this.socket.disconnect();
    }

    // Reset reconnection attempts counter
    this.socket.io.reconnectionAttempts(0);

    this.socket.connect();
    this.enabled = true;
  }

  public disable() {
    this.stopHeartbeat();
    this.off();
    this.socket.disconnect();
    this.enabled = false;
  }

  public emit<T, R>(message: string, data?: T): Observable<R> {
    return new Observable<R>(observer => {
      if (!this.socket.connected) {
        observer.error(new ApiError(ApiErrorEnum.SOCKET_ERROR, 'Socket not connected'));
        observer.complete();
        return;
      }

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

  public setPlayerId(id: number): void {
    this.playerId = id;
  }

  public getPlayerId(): number | undefined {
    return this.playerId;
  }

  public joinGame(gameId: number): Observable<any> {
    return this.emit('game:join', {
      gameId,
      playerId: this.playerId  // Pass the stored player ID during reconnection
    });
  }
}