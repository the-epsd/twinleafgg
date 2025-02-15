"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SocketWrapper = void 0;
class SocketWrapper {
    constructor(io, socket) {
        this.listeners = [];
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
}
exports.SocketWrapper = SocketWrapper;
