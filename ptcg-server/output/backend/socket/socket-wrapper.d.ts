import { Server, Socket } from 'socket.io';
import { ApiErrorEnum } from '../common/errors';
export declare type Response<R = void> = (message: string, data?: R | ApiErrorEnum) => void;
export declare type Handler<T, R> = (data: T, response: Response<R>) => void;
export declare class SocketWrapper {
    io: Server;
    socket: Socket;
    private listeners;
    constructor(io: Server, socket: Socket);
    attachListeners(): void;
    addListener<T, R>(message: string, handler: Handler<T, R>): void;
    emit(event: string, ...args: any[]): boolean;
}
