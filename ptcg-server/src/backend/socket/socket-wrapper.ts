import { Server, Socket } from 'socket.io';
import { ApiErrorEnum } from '../common/errors';

export type Response<R = void> = (message: string, data?: R | ApiErrorEnum) => void;

export type Handler<T, R> = (data: T, response: Response<R>) => void;

interface Listener<T, R> {
  message: string,
  handler: Handler<T, R>
}

export class SocketWrapper {

  public io: Server;
  public socket: Socket;
  private listeners: Listener<any, any>[] = [];

  constructor(io: Server, socket: Socket) {
    this.io = io;
    this.socket = socket;
  }

  public attachListeners(): void {
    for (let i = 0; i < this.listeners.length; i++) {
      const listener = this.listeners[i];

      this.socket.on(listener.message, async <T, R>(data: T, fn: Function) => {
        if (!this.socket.connected) {
          console.warn(`[Socket] Received message on disconnected socket: ${listener.message}`);
          return;
        }

        const response: Response<R> =
          (message: string, data?: R | ApiErrorEnum) => fn && fn({ message, data });
        try {
          await listener.handler(data, response);
        } catch (error) {
          console.error(`[Socket] Error handling message ${listener.message}:`, error);
          response('error', error.message);
        }
      });
    }
  }

  public addListener<T, R>(message: string, handler: Handler<T, R>) {
    const listener = { message, handler };
    this.listeners.push(listener);
  }

  public emit(event: string, ...args: any[]): boolean {
    try {
      if (!this.socket.connected) {
        console.warn(`[Socket] Attempting to emit to disconnected socket: ${event}`);
        return false;
      }
      return this.socket.emit(event, ...args);
    } catch (error: any) {
      console.error(`[Socket] Error emitting event ${event}:`, error);
      return false;
    }
  }

  public isConnected(): boolean {
    try {
      return this.socket && this.socket.connected;
    } catch (error: any) {
      console.error('[Socket] Error checking connection status:', error);
      return false;
    }
  }
}