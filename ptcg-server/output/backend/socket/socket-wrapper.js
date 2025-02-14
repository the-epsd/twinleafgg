"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SocketWrapper = void 0;
const errors_1 = require("../common/errors");
class SocketWrapper {
    constructor(io, socket) {
        this.listeners = [];
        this.MAX_LISTENERS = 100; // Prevent memory leaks
        this.TIMEOUT = 30000; // 30 second timeout for handlers
        this.io = io;
        this.socket = socket;
    }
    attachListeners() {
        for (let i = 0; i < this.listeners.length; i++) {
            const listener = this.listeners[i];
            this.socket.on(listener.message, async (data, fn) => {
                // Ensure callback exists and is a function
                if (typeof fn !== 'function') {
                    return;
                }
                const response = (message, data) => {
                    try {
                        fn({ message, data });
                    }
                    catch (err) {
                        // Prevent callback errors from crashing server
                        console.error(`Socket callback error: ${err}`);
                    }
                };
                // Set timeout to prevent hanging handlers
                const timeoutId = setTimeout(() => {
                    response('error', errors_1.ApiErrorEnum.SOCKET_ERROR);
                }, this.TIMEOUT);
                try {
                    await Promise.race([
                        listener.handler(data, response),
                        new Promise((_, reject) => setTimeout(() => reject(new Error('Handler timeout')), this.TIMEOUT))
                    ]);
                }
                catch (error) {
                    response('error', error.message || errors_1.ApiErrorEnum.SOCKET_ERROR);
                }
                finally {
                    clearTimeout(timeoutId);
                }
            });
        }
    }
    addListener(message, handler) {
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
    emit(event, ...args) {
        try {
            return this.socket.emit(event, ...args);
        }
        catch (err) {
            console.error(`Socket emit error: ${err}`);
            return false;
        }
    }
}
exports.SocketWrapper = SocketWrapper;
