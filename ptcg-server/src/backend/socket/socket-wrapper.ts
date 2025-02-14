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
  private readonly MAX_LISTENERS = 100; // Prevent memory leaks
  private readonly TIMEOUT = 30000; // 30 second timeout for handlers

  constructor(io: Server, socket: Socket) {
    this.io = io;
    this.socket = socket;
  }

  public attachListeners(): void {
    for (let i = 0; i < this.listeners.length; i++) {
      const listener = this.listeners[i];

      this.socket.on(listener.message, async <T, R>(data: T, fn: Function) => {
        // Ensure callback exists and is a function
        if (typeof fn !== 'function') {
          return;
        }

        const response: Response<R> = (message: string, data?: R | ApiErrorEnum) => {
          try {
            fn({ message, data });
          } catch (err) {
            // Prevent callback errors from crashing server
            console.error(`Socket callback error: ${err}`);
          }
        };

        // Set timeout to prevent hanging handlers
        const timeoutId = setTimeout(() => {
          response('error', ApiErrorEnum.SOCKET_ERROR);
        }, this.TIMEOUT);

        try {
          await Promise.race([
            listener.handler(data, response),
            new Promise((_, reject) =>
              setTimeout(() => reject(new Error('Handler timeout')), this.TIMEOUT)
            )
          ]);
        } catch (error) {
          response('error', error.message || ApiErrorEnum.SOCKET_ERROR);
        } finally {
          clearTimeout(timeoutId);
        }
      });
    }
  }

  public addListener<T, R>(message: string, handler: Handler<T, R>) {
    if (this.listeners.length >= this.MAX_LISTENERS) {
      console.error('Maximum listeners reached');
      return;
    }

    // Prevent duplicate listeners
    if (this.listeners.some(l => l.message === message)) {
      console.warn(`Duplicate listener for message: ${message}`);
      return;
    }

    const listener = { message, handler };
    this.listeners.push(listener);
  }

  public emit(event: string, ...args: any[]): boolean {
    try {
      return this.socket.emit(event, ...args);
    } catch (err) {
      console.error(`Socket emit error: ${err}`);
      return false;
    }
  }

}