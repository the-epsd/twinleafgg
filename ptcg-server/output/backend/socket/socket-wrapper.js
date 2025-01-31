"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SocketWrapper = void 0;
class SocketWrapper {
    constructor(io, socket) {
        this.listeners = [];
        this.lastPong = Date.now();
        this.io = io;
        this.socket = socket;
    }
    attachListeners() {
        for (let i = 0; i < this.listeners.length; i++) {
            const listener = this.listeners[i];
            this.socket.on(listener.message, async (data, fn) => {
                const response = (message, data) => fn && fn({ message, data });
                try {
                    await listener.handler(data, response);
                }
                catch (error) {
                    response('error', error.message);
                }
            });
        }
    }
    addListener(message, handler) {
        const listener = { message, handler };
        this.listeners.push(listener);
    }
    emit(event, ...args) {
        return this.socket.emit(event, ...args);
    }
    startHeartbeat() {
        const HEARTBEAT_INTERVAL = 15000;
        const TIMEOUT = 30000;
        setInterval(() => {
            if (this.socket.connected) {
                this.socket.emit('ping');
                console.log(`[Socket ${this.socket.id}] Heartbeat sent`);
                const pingTime = Date.now();
                this.socket.once('pong', () => {
                    this.lastPong = Date.now();
                    console.log(`[Socket ${this.socket.id}] Pong received, connection healthy`);
                });
                // Check for timeout
                setTimeout(() => {
                    if (Date.now() - pingTime > TIMEOUT) {
                        this.socket.disconnect(true);
                        console.log(`[Socket ${this.socket.id}] Connection timed out`);
                    }
                }, TIMEOUT);
            }
        }, HEARTBEAT_INTERVAL);
    }
}
exports.SocketWrapper = SocketWrapper;
