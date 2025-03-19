import { Injectable } from '@angular/core';
import { ApiErrorEnum, Format } from 'ptcg-server';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { Socket, io } from 'socket.io-client';
import { timeout, catchError, retry } from 'rxjs/operators';

import { ApiError } from './api.error';
import { environment } from '../../environments/environment';

interface SocketResponse<T> {
  message: string;
  data?: T;
}

@Injectable()
export class SocketService {

  public socket: Socket;
  private callbacks: { event: string, fn: any }[] = [];
  private enabled = false;
  private connectionSubject = new BehaviorSubject<boolean>(false);
  private lastPingTime: number = 0;

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
      reconnectionAttempts: Infinity,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 10000,
      timeout: 30000,
      transports: ['websocket'],
      forceNew: true,
      query: {}
    });

    this.socket.on('connect', () => {
      console.log('[Socket] Connected to server');
      this.connectionSubject.next(true);
      this.lastPingTime = Date.now();
    });

    this.socket.on('connect_error', (error) => {
      console.error('[Socket] Connection error:', error);
    });

    this.socket.on('disconnect', (reason) => {
      console.log('[Socket] Disconnected from server. Reason:', reason);
      this.connectionSubject.next(false);

      // If the server closed the connection, try to reconnect
      if (reason === 'io server disconnect') {
        this.socket.connect();
      }
    });

    this.socket.on('reconnect', (attemptNumber) => {
      console.log(`[Socket] Reconnected to server after ${attemptNumber} attempts`);
    });

    this.socket.on('reconnect_attempt', (attemptNumber) => {
      console.log(`[Socket] Attempting to reconnect (attempt ${attemptNumber})`);
    });

    this.socket.on('reconnect_error', (error) => {
      console.error('[Socket] Reconnection error:', error);
    });

    this.socket.on('reconnect_failed', () => {
      console.error('[Socket] Failed to reconnect after all attempts');
    });

    // Monitor connection health
    this.socket.io.on('ping', () => {
      console.log('[Socket] Ping sent to server');
      this.lastPingTime = Date.now();
    });
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

    // Clear any existing listeners before connecting
    this.off();

    // Ensure clean state before connecting
    if (this.socket.connected) {
      this.socket.disconnect();
    }

    this.socket.connect();
    this.enabled = true;

    // Add connection monitoring
    this.startConnectionMonitoring();
  }

  private startConnectionMonitoring() {
    // Monitor for potential frozen connections
    setInterval(() => {
      if (this.enabled && !this.socket.connected) {
        console.log('[Socket] Connection appears frozen, attempting to reconnect...');
        this.socket.disconnect();
        this.socket.connect();
      }

      // Check if we haven't received a ping in more than 45 seconds
      const timeSinceLastPing = Date.now() - this.lastPingTime;
      if (this.enabled && this.lastPingTime > 0 && timeSinceLastPing > 45000) {
        console.log('[Socket] No ping received for 45 seconds, attempting to reconnect...');
        this.socket.disconnect();
        this.socket.connect();
      }
    }, 30000); // Check every 30 seconds
  }

  public disable() {
    this.off();
    this.socket.disconnect();
    this.enabled = false;
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
}