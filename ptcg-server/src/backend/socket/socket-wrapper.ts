import { Server, Socket } from 'socket.io';
import { ApiErrorEnum } from '../common/errors';

export type Response<R = void> = (message: string, data?: R | ApiErrorEnum) => void;

export type Handler<T, R> = (data: T, response: Response<R>) => void;

interface Listener<T = any, R = any> {
  message: string;
  handler: Handler<T, R>;
  boundHandler: (data: T, fn: Function) => void;
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
      this.socket.on(listener.message, listener.boundHandler);
    }
  }

  public addListener<T, R>(message: string, handler: Handler<T, R>) {
    const boundHandler = async (data: T, fn: Function) => {
      const response: Response<R> =
        (message: string, data?: R | ApiErrorEnum) => fn && fn({ message, data });
      try {
        await handler(data, response);
      } catch (error: any) {
        response('error', error.message);
      }
    };
    const listener: Listener<T, R> = { message, handler, boundHandler };
    this.listeners.push(listener);
  }

  public removeListener(message: string) {
    const index = this.listeners.findIndex(l => l.message === message);
    if (index !== -1) {
      const listener = this.listeners[index];
      this.socket.off(listener.message, listener.boundHandler);
      this.listeners.splice(index, 1);
    }
  }

  public emit(event: string, ...args: any[]): boolean {
    return this.socket.emit(event, ...args);
  }

}
