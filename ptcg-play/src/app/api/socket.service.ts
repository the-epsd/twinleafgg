import { Injectable } from '@angular/core';
import { ApiErrorEnum, Format } from 'ptcg-server';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { Socket, io } from 'socket.io-client';
import { timeout, catchError, retry } from 'rxjs/operators';

import { ApiError } from './api.error';
import { environment } from '../../environments/environment';
import { AlertService } from '../shared/alert/alert.service';
import { TranslateService } from '@ngx-translate/core';

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

  constructor(
    private alertService: AlertService,
    private translate: TranslateService
  ) {
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
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      timeout: 10000,
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
      const attempt = this.socket.io.reconnectionAttempts();
      const delay = Math.min(1000 * Math.pow(2, attempt), 5000);
      console.log(`[Socket] Connection error, retrying in ${delay}ms (attempt ${attempt + 1})`);
      setTimeout(() => {
        if (!this.socket.connected) {
          this.socket.connect();
        }
      }, delay);
    });

    this.socket.on('disconnect', (reason) => {
      console.log(`[Socket] Disconnected: ${reason}`);
      this.connectionSubject.next(false);
      this.alertService.toast(this.translate.instant('SOCKET_DISCONNECTED'), 5000);

      switch (reason) {
        case 'io server disconnect':
          console.log('[Socket] Server initiated disconnect, attempting reconnect');
          this.socket.connect();
          break;
        case 'transport close':
        case 'ping timeout':
        case 'transport error':
          const attempt = this.socket.io.reconnectionAttempts();
          const delay = Math.min(1000 * Math.pow(2, attempt), 5000);
          console.log(`[Socket] ${reason}, retrying in ${delay}ms (attempt ${attempt + 1})`);
          this.alertService.toast(this.translate.instant('SOCKET_RECONNECTING', { attempt: attempt + 1 }), 5000);
          setTimeout(() => {
            if (!this.socket.connected) {
              this.socket.connect();
            }
          }, delay);
          break;
        default:
          console.log(`[Socket] Unknown disconnect reason: ${reason}, attempting reconnect`);
          this.socket.connect();
      }
    });

    this.socket.on('reconnect', (attemptNumber) => {
      console.log(`[Socket] Reconnected after ${attemptNumber} attempts`);
      this.connectionSubject.next(true);
      this.lastPingTime = Date.now();
      this.alertService.toast(this.translate.instant('SOCKET_RECONNECTED'), 3000);

      this.socket.io.reconnectionAttempts(0);
    });

    this.socket.on('reconnect_attempt', (attemptNumber) => {
      if (attemptNumber % 2 === 0) {
        console.log(`[Socket] Reconnection attempt ${attemptNumber}`);
        this.alertService.toast(this.translate.instant('SOCKET_RECONNECT_ATTEMPT', { attempt: attemptNumber }), 3000);
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
      this.alertService.toast(this.translate.instant('SOCKET_RECONNECT_FAILED'), 5000);

      setTimeout(() => {
        if (!this.socket.connected) {
          console.log('[Socket] Attempting fresh connection after reconnection failure');
          this.socket.connect();
        }
      }, 10000);
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

    this.startConnectionMonitoring();
  }

  private startConnectionMonitoring() {
    setInterval(() => {
      if (this.enabled && !this.socket.connected) {
        const timeSinceLastPing = Date.now() - this.lastPingTime;
        if (this.lastPingTime > 0 && timeSinceLastPing > 15000) {
          console.log(`[Socket] Connection frozen (no ping for ${Math.floor(timeSinceLastPing / 1000)}s), reconnecting...`);
          this.socket.disconnect();
          this.socket.connect();
        }
      }
    }, 10000);
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