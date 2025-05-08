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
      this.socket.off('connect_error');
      this.socket.off('reconnect');
      this.socket.off('reconnect_attempt');
      this.socket.off('reconnect_error');
      this.socket.off('reconnect_failed');
      this.socket.off('ping');
    }

    this.socket = io(apiUrl, {
      autoConnect: false,
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      timeout: 24 * 60 * 60 * 1000,
      transports: ['websocket'],
      forceNew: true,
      query: {},
      randomizationFactor: 0.5
    });

    this.socket.on('connect', () => {
      console.log('[Socket] Connected to server');
      this.connectionSubject.next(true);
      this.lastPingTime = Date.now();
    });

    this.socket.on('connect_error', (error) => {
      if (!error.message.includes('xhr poll error') && !error.message.includes('network error')) {
        console.error('[Socket] Connection error:', error.message);
      }
      const delay = Math.min(1000 * Math.pow(2, this.socket.io.reconnectionAttempts()), 5000);
      setTimeout(() => {
        if (!this.socket.connected) {
          this.socket.connect();
        }
      }, delay);
    });

    this.socket.on('disconnect', (reason) => {
      console.log(`[Socket] Disconnected: ${reason}`);
      this.connectionSubject.next(false);

      switch (reason) {
        case 'io server disconnect':
          console.log('[Socket] Server initiated disconnect, attempting reconnect');
          this.socket.connect();
          break;
        case 'transport close':
          const delay = Math.min(1000 * Math.pow(2, this.socket.io.reconnectionAttempts()), 5000);
          console.log(`[Socket] Transport closed, reconnecting in ${delay}ms`);
          setTimeout(() => {
            if (!this.socket.connected) {
              this.socket.connect();
            }
          }, delay);
          break;
        case 'ping timeout':
          console.log('[Socket] Ping timeout, attempting immediate reconnect');
          this.socket.connect();
          break;
        default:
          const defaultDelay = Math.min(1000 * Math.pow(2, this.socket.io.reconnectionAttempts()), 5000);
          console.log(`[Socket] Unknown disconnect reason, reconnecting in ${defaultDelay}ms`);
          setTimeout(() => {
            if (!this.socket.connected) {
              this.socket.connect();
            }
          }, defaultDelay);
      }
    });

    this.socket.on('reconnect', (attemptNumber) => {
      console.log(`[Socket] Reconnected after ${attemptNumber} attempts`);
      this.connectionSubject.next(true);
      this.lastPingTime = Date.now();
    });

    this.socket.on('reconnect_attempt', (attemptNumber) => {
      if (attemptNumber % 5 === 0) {
        console.log(`[Socket] Reconnection attempt ${attemptNumber}`);
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

    this.socket.io.on('ping', () => {
      const now = Date.now();
      if (this.lastPingTime > 0 && now - this.lastPingTime > 30000) {
        console.log(`[Socket] Delayed ping (${now - this.lastPingTime}ms)`);
      }
      this.lastPingTime = now;
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

    this.off();

    if (this.socket.connected) {
      this.socket.disconnect();
    }

    this.socket.connect();
    this.enabled = true;
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