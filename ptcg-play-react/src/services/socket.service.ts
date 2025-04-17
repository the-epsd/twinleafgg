import { io, Socket } from 'socket.io-client';
import { authService } from './auth.service';
import { ApiError, ApiErrorEnum } from './api.error';
import { Format } from '../types/game.types';



interface SocketResponse<T> {
  status: 'ok' | 'error';
  data?: T;
  error?: string;
}

export class SocketService {
  private socket: Socket | null = null;
  private static instance: SocketService;
  private _isEnabled = false;
  private _isConnected = false;
  private connectionListeners: ((connected: boolean) => void)[] = [];
  private callbacks: { event: string; fn: (data: any) => void }[] = [];
  private lastPingTime: number = 0;

  private constructor() { }

  public static getInstance(): SocketService {
    if (!SocketService.instance) {
      SocketService.instance = new SocketService();
    }
    return SocketService.instance;
  }

  get isEnabled(): boolean {
    return this._isEnabled;
  }

  get isConnected(): boolean {
    return this._isConnected;
  }

  get socketInstance(): Socket | null {
    return this.socket;
  }

  public connect(token: string): void {
    if (this.socket?.connected) {
      return;
    }

    const wsUrl = process.env.REACT_APP_WS_URL || 'ws://localhost:8080';
    this.socket = io(wsUrl, {
      auth: { token },
      transports: ['websocket'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      withCredentials: true,
      extraHeaders: {
        'Access-Control-Allow-Origin': '*'
      }
    });

    this.socket.on('connect', () => {
      console.log('Connected to WebSocket server');
      this._isConnected = true;
      this.notifyConnectionListeners(true);
      this.lastPingTime = Date.now();
    });

    this.socket.on('disconnect', (reason) => {
      console.log('Disconnected from WebSocket server:', reason);
      this._isConnected = false;
      this.notifyConnectionListeners(false);
    });

    this.socket.on('error', (error) => {
      console.error('WebSocket error:', error);
    });
  }

  public disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  public emit<T, R>(event: string, data?: T): Promise<R> {
    return new Promise((resolve, reject) => {
      if (!this.socket?.connected) {
        reject(new ApiError(ApiErrorEnum.SOCKET_ERROR, 'Not connected to server'));
        return;
      }

      this.socket.emit(event, data, (response: SocketResponse<R>) => {
        if (response.status === 'ok' && response.data !== undefined) {
          resolve(response.data);
        } else {
          reject(new ApiError(ApiErrorEnum.API_ERROR, response.error || 'Unknown error'));
        }
      });
    });
  }

  public on<T>(event: string, callback: (data: T) => void): void {
    this.socket?.on(event, callback);
  }

  public off(event: string): void {
    this.socket?.off(event);
  }

  subscribeToConnection(callback: (connected: boolean) => void) {
    this.connectionListeners.push(callback);
    return () => {
      this.connectionListeners = this.connectionListeners.filter(
        (listener) => listener !== callback
      );
    };
  }

  private notifyConnectionListeners(connected: boolean) {
    this.connectionListeners.forEach((listener) => listener(connected));
  }

  // Game-specific methods
  async joinMatchmakingQueue(format: Format, deck: string[]): Promise<any> {
    return this.emit('matchmaking:join', { format, deck });
  }

  async leaveMatchmakingQueue(): Promise<any> {
    return this.emit('matchmaking:leave');
  }
}

export const socketService = SocketService.getInstance(); 