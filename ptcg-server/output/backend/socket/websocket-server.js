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
        const opts = {};
        if (config_1.config.backend.allowCors) {
            opts.cors = { origin: '*' };
        }
        const server = new socket_io_1.Server(httpServer, opts);
        this.server = server;
        server.use(auth_middleware_1.authMiddleware);
        server.on('connection', (socket) => {
            const user = socket.user;
            console.log(`Connection opened - ${user.name} - Active connections: ${server.engine.clientsCount}`);
            const socketClient = new socket_client_1.SocketClient(user, this.core, server, socket);
            this.core.connect(socketClient);
            socketClient.attachListeners();
            socket.on('disconnect', () => {
                console.log(`Connection closed - ${user.name} - Active connections: ${server.engine.clientsCount - 1}`);
                this.core.disconnect(socketClient);
                user.updateLastSeen();
            });
        });
    }
}
exports.WebSocketServer = WebSocketServer;
