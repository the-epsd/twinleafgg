"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebSocketServer = void 0;
const socket_io_1 = require("socket.io");
const socket_client_1 = require("./socket-client");
const auth_middleware_1 = require("./auth-middleware");
const config_1 = require("../../config");
class WebSocketServer {
    constructor(core) {
        this.core = core;
    }
    async listen(httpServer) {
        const opts = {
            pingInterval: 25000,
            pingTimeout: 20000,
            connectTimeout: 45000,
            transports: ['websocket', 'polling'],
            allowUpgrades: true,
        };
        if (config_1.config.backend.allowCors) {
            opts.cors = { origin: '*' };
        }
        const server = new socket_io_1.Server(httpServer, opts);
        this.server = server;
        server.use(auth_middleware_1.authMiddleware);
        server.on('connection', (socket) => {
            const user = socket.user;
            const socketClient = new socket_client_1.SocketClient(user, this.core, server, socket);
            this.core.connect(socketClient);
            socketClient.attachListeners();
            socket.on('disconnect', (reason) => {
                console.log(`[Disconnect] User ${user.name} (${user.id}) disconnected. Reason: ${reason}`);
                this.core.disconnect(socketClient);
                user.updateLastSeen();
            });
            socket.on('error', (error) => {
                console.error(`[Socket Error] User ${user.name} (${user.id}):`, error);
            });
            socket.on('connect_error', (error) => {
                console.error(`[Connect Error] User ${user.name} (${user.id}):`, error);
            });
        });
    }
}
exports.WebSocketServer = WebSocketServer;
