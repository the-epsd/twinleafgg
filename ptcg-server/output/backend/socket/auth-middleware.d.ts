import { Socket } from 'socket.io';
export declare function authMiddleware(socket: Socket, next: (err?: any) => void): Promise<void>;
